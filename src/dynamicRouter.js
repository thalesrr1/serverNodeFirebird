import { Router } from "express";
import { getAllEndpoints } from "./services/endpointService.js";
import { getDatabase } from "./services/databaseService.js";

let dynamicRouter = Router();

/**
 * Initializes and re-initializes dynamic routes based on stored endpoints.
 * @param {express.Application} app - The Express application instance.
 */
export const initializeDynamicRoutes = async (app) => {
  // Clear existing dynamic routes if any
  // Note: This is a simplification. For production, a more robust hot-reloading
  // mechanism might be needed without completely re-initializing the app.
  if (app._router) {
    app._router.stack = app._router.stack.filter(
      (layer) => !layer.name || layer.name !== "dynamicRouter"
    );
  }

  const endpoints = getAllEndpoints();
  dynamicRouter = Router(); // Create a new router instance for fresh routes

  console.log(`Initializing ${endpoints.length} dynamic endpoints...`);

  endpoints.forEach((endpoint) => {
    const { id, name, method, sql } = endpoint;
    const routePath = `/dynamic/${name}`;

    console.log(`  - Registering ${method} ${routePath} (ID: ${id})`);

    dynamicRouter[method.toLowerCase()](routePath, async (req, res) => {
      try {
        const db = getDatabase();
        // Execute the raw SQL query.
        // Parameters from request body/query could be passed here,
        // but for now, the SQL is directly from the stored definition.
        const result = await db.raw(sql);
        res.status(200).json(result);
      } catch (error) {
        console.error(
          `Error executing SQL for endpoint ${name} (ID: ${id}):`,
          error
        );
        res.status(500).json({
          error: "Failed to execute dynamic SQL query.",
          endpoint: name,
          details: error.message,
        });
      }
    });
  });

  app.use(dynamicRouter); // Mount the new dynamic router
  console.log("Dynamic routes initialized.");
};
