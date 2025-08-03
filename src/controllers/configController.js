import {
  initializeDatabase,
  getDatabase,
  getCurrentDbConfig,
} from "../services/databaseService.js";

export const connectDatabase = async (req, res) => {
  const { host, port, username, password, database } = req.body;

  if (!host || !port || !username || !password || !database) {
    return res
      .status(400)
      .json({
        error:
          "All database connection parameters (host, port, username, password, database) are required.",
      });
  }

  try {
    const db = await initializeDatabase({
      host,
      port,
      username,
      password,
      database,
    });

    // Perform a simple query to test the connection
    await db.raw("SELECT 1 FROM RDB$DATABASE");

    return res
      .status(200)
      .json({
        message: "Database connected successfully.",
        config: getCurrentDbConfig().connection,
      });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    return res
      .status(500)
      .json({
        error: "Failed to connect to database.",
        details: error.message,
      });
  }
};

export const getDatabaseConfig = (req, res) => {
  const config = getCurrentDbConfig();
  if (config) {
    // Only return non-sensitive information
    const { password, ...safeConfig } = config.connection;
    return res.status(200).json({ config: safeConfig });
  }
  return res.status(404).json({ message: "Database configuration not set." });
};
