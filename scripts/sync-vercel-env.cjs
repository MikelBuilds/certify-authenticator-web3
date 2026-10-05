// Send server configuration through stdin so secret values never enter shell arguments.
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const dotenv = require("../backend/node_modules/dotenv");

const root = path.resolve(__dirname, "..");
const values = dotenv.parse(fs.readFileSync(path.join(root, "backend/.env")));
values.NODE_ENV = "production";
const names = ["MONGO_URI", "JWT_SECRET", "ADMIN_REGISTRATION_CODE", "RPC_URL", "ISSUER_PRIVATE_KEY", "CONTRACT_ADDRESS", "NODE_ENV"];
const npxCli = path.join(path.dirname(process.execPath), "node_modules/npm/bin/npx-cli.js");

for (const name of names) {
  if (!values[name]) {
    console.log(`Skipped ${name}: not set locally.`);
    continue;
  }
  const result = spawnSync(process.execPath, [npxCli, "--yes", "vercel@latest", "env", "add", name, "production", "--sensitive", "--yes", "--force"], {
    cwd: root,
    input: values[name],
    encoding: "utf8",
    windowsHide: true,
    timeout: 60000,
  });
  if (result.status !== 0) {
    // Do not echo command output, which might contain configuration values on failure.
    console.error(`Failed to configure ${name}. Check Vercel authentication and project access.`);
    process.exit(1);
  }
  console.log(`Configured ${name} in Vercel production.`);
}
