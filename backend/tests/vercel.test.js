const request = require("supertest");
const express = require("express");

jest.mock("../config/db", () => jest.fn());
const connectDB = require("../config/db");
const handler = require("../../api/index");
const app = express();
app.use(handler);

const originalEnv = { ...process.env };
beforeEach(() => {
  jest.clearAllMocks();
  process.env.MONGO_URI = "mongodb://unused/test";
  process.env.JWT_SECRET = "test-secret";
  process.env.NODE_ENV = "production";
  delete process.env.ADMIN_REGISTRATION_CODE;
  connectDB.mockResolvedValue(undefined);
});
afterAll(() => {
  process.env = originalEnv;
});

test("health stays available without database configuration", async () => {
  delete process.env.MONGO_URI;
  const response = await request(app).get("/health");
  expect(response.status).toBe(200);
  expect(connectDB).not.toHaveBeenCalled();
});

test("missing production configuration returns an actionable 503", async () => {
  delete process.env.MONGO_URI;
  const response = await request(app).get("/api/certificates");
  expect(response.status).toBe(503);
  expect(response.body.message).toContain("MONGO_URI");
  expect(connectDB).not.toHaveBeenCalled();
});

test("database failures return 503 without leaking connection details", async () => {
  connectDB.mockRejectedValue(new Error("mongodb://secret:password@host"));
  const response = await request(app).get("/api/certificates");
  expect(response.status).toBe(503);
  expect(response.text).not.toContain("password");
});

test.each([
  [Object.assign(new Error("bad auth: authentication failed"), { code: 18 }), "DATABASE_AUTH_FAILED"],
  [Object.assign(new Error("Invalid scheme"), { name: "MongoParseError" }), "DATABASE_URI_INVALID"],
  [new Error("querySrv ENOTFOUND _mongodb._tcp.invalid.example.com"), "DATABASE_DNS_FAILED"],
  [Object.assign(new Error("Could not connect to any servers"), { name: "MongoServerSelectionError" }), "DATABASE_UNREACHABLE"],
  [Object.assign(new Error("selection failed"), { reason: { servers: new Map([["host", { error: new Error("SSL alert handshake failure") }]]) } }), "DATABASE_TLS_FAILED"],
])("database failures provide an actionable category without raw driver details", async (error, expectedCode) => {
  connectDB.mockRejectedValue(error);
  const response = await request(app).get("/api/certificates");
  expect(response.status).toBe(503);
  expect(response.body.code).toBe(expectedCode);
  expect(response.body).not.toHaveProperty("stack");
});

test("connected API requests reach the existing validation routes", async () => {
  const response = await request(app).post("/api/certificates/verify");
  expect(response.status).toBe(400);
  expect(response.body.message).toContain("PDF");
  expect(connectDB).toHaveBeenCalledTimes(1);
});

test("PDF requests over the hosted upload limit return 413", async () => {
  const response = await request(app)
    .post("/api/certificates/verify")
    .attach("certificatePdf", Buffer.alloc(4 * 1024 * 1024 + 1), "large.pdf");
  expect(response.status).toBe(413);
  expect(response.body.message).toContain("4 MB");
});

test("public visitors cannot register as admins without the invitation code", async () => {
  const response = await request(app).post("/api/auth/register").send({
    name: "Visitor", email: "visitor@example.com", password: "password123", role: "Admin",
  });
  expect(response.status).toBe(403);
  expect(response.body.message).toContain("invitation code");
});
