const app = require("../backend/app");
const connectDB = require("../backend/config/db");
const describeDatabaseError = require("../backend/utils/databaseError");

module.exports = async (req, res) => {
  // Liveness is available even before the database is configured.
  if (req.url.split("?")[0] === "/health") return app(req, res);

  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    return res.status(503).json({
      success: false,
      message: "Service setup is incomplete. Configure MONGO_URI and JWT_SECRET in Vercel.",
    });
  }

  try {
    await connectDB();
  } catch (error) {
    const diagnostic = describeDatabaseError(error);
    console.error(`[Database] ${diagnostic.code}`);
    return res.status(503).json({
      success: false,
      ...diagnostic,
    });
  }

  return app(req, res);
};
