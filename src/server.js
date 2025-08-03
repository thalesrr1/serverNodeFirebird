import express from "express";
import cors from "cors";
import { serverConfig } from "./config/index.js";
import configRoutes from "./routes/configRoutes.js";
import endpointRoutes from "./routes/endpointRoutes.js";
import { initializeDynamicRoutes } from "./dynamicRouter.js";
import { loadEndpoints } from "./services/endpointService.js";
import { getCurrentDbConfig } from "./services/databaseService.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// API Routes
app.use("/api/config", configRoutes);
app.use("/api/endpoints", endpointRoutes);

// Re-initialize dynamic routes after every endpoint change
app.on("endpointsUpdated", () => {
  initializeDynamicRoutes(app);
});

// Initial load of dynamic routes
// This must be called after all other routes are defined,
// as it uses app.use to mount the dynamic router.
loadEndpoints()
  .then(() => {
    initializeDynamicRoutes(app);
  })
  .catch((error) => {
    console.error("Failed to load initial endpoints:", error);
  });

// Basic health check route
app.get("/health", (req, res) => {
  const dbConfig = getCurrentDbConfig();
  res.status(200).json({
    status: "running",
    dbConnected: !!dbConfig,
    dbHost: dbConfig ? dbConfig.connection.host : "N/A",
    dbDatabase: dbConfig ? dbConfig.connection.database : "N/A",
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handling
app.use((err, req, res, next) => {
  console.error(err); // Log the full error for debugging
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected error occurred.";
  res.status(statusCode).json({
    error: message,
    details: process.env.NODE_ENV === "production" ? undefined : err.stack, // Only show stack in development
  });
});

const PORT = serverConfig.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access health check at http://localhost:${PORT}/health`);
  console.log(
    `Configure database at http://localhost:${PORT}/api/config/connect`
  );
  console.log(`Manage endpoints at http://localhost:${PORT}/api/endpoints`);
});

export default app; // Export app for testing or further modularization
