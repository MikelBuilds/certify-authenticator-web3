const mongoose = require("mongoose");
let mongoMemoryServer = null;
let connectionPromise = null;

const openConnection = async () => {
  const hosted = process.env.VERCEL || process.env.NODE_ENV === "production";
  if (hosted && !process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required in production");
  }
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/blockchain_certificate_db";
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: hosted ? 10000 : 2000 });
    console.log(`[MongoDB Connected]: Host ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // Hosted instances must use persistent storage, never a temporary database.
    if (hosted) throw error;
    console.warn(`[MongoDB Direct Connection Notice]: Local MongoDB connection timed out (${error.message}). Initializing MongoDB Memory Server...`);
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[MongoDB Memory Server Connected]: ${memUri}`);
      return conn;
    } catch (memErr) {
      console.error(`[MongoDB Memory Server Failed]: ${memErr.message}`);
      throw memErr;
    }
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!connectionPromise) {
    connectionPromise = openConnection().finally(() => {
      connectionPromise = null;
    });
  }
  return connectionPromise;
};

module.exports = connectDB;
