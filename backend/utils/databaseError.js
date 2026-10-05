// Classify driver errors without exposing connection strings or credentials.
const describeDatabaseError = (error) => {
  const errors = [error, error?.cause];
  if (error?.reason?.servers instanceof Map) {
    for (const server of error.reason.servers.values()) errors.push(server.error);
  }
  const text = errors.filter(Boolean).map((item) => `${item.name || ""} ${item.code || ""} ${item.message || ""}`).join(" ");

  if (errors.some((item) => item?.code === 18) || /authentication failed|bad auth|auth failed/i.test(text)) {
    return {
      code: "DATABASE_AUTH_FAILED",
      message: "MongoDB authentication failed. Check the Atlas database username and password in MONGO_URI, then redeploy.",
    };
  }
  if (/MongoParseError|invalid.*(?:uri|connection string|scheme)|URI malformed|unescaped/i.test(text)) {
    return {
      code: "DATABASE_URI_INVALID",
      message: "MONGO_URI has an invalid format. Use the Atlas mongodb+srv:// connection string, replace all placeholders, and URL-encode special characters in the password.",
    };
  }
  if (/ENOTFOUND|ENODATA|querySrv|queryTxt|EAI_AGAIN/i.test(text)) {
    return {
      code: "DATABASE_DNS_FAILED",
      message: "The MongoDB cluster address could not be resolved. Check the hostname in MONGO_URI and confirm the Atlas cluster is active.",
    };
  }
  if (/SSL|TLS|certificate.*(?:verify|expired)/i.test(text)) {
    return {
      code: "DATABASE_TLS_FAILED",
      message: "The secure connection to MongoDB failed. Check Atlas Network Access and the cluster connection settings.",
    };
  }
  if (/MongoServerSelectionError|ETIMEDOUT|ECONNREFUSED|timed out|IP whitelist/i.test(text)) {
    return {
      code: "DATABASE_UNREACHABLE",
      message: "Vercel could not reach MongoDB. Check Atlas Network Access and confirm the cluster is running.",
    };
  }
  return {
    code: "DATABASE_CONNECTION_FAILED",
    message: "Database connection unavailable. Please try again later.",
  };
};

module.exports = describeDatabaseError;
