import knex from "knex";
import FirebirdClient from "knex-firebird-dialect";

let dbInstance = null;
let currentDbConfig = null;

/**
 * Initializes the Knex.js database instance.
 * If an instance already exists, it will be destroyed and recreated with the new configuration.
 * @param {Object} config - Database connection configuration.
 * @param {string} config.host
 * @param {number} config.port
 * @param {string} config.username
 * @param {string} config.password
 * @param {string} config.database - Path to the Firebird database file.
 * @returns {knex} The initialized Knex.js instance.
 */
async function initializeDatabase(config) {
  if (dbInstance) {
    console.log("Destroying existing database connection pool...");
    await dbInstance.destroy();
    dbInstance = null;
  }

  currentDbConfig = {
    client: "firebird",
    connection: {
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
      lowercase_keys: true, // Recommended for consistency with JSON output
    },
    pool: {
      min: 2,
      max: 10,
    },
  };

  dbInstance = knex(currentDbConfig);
  console.log("Knex database instance initialized.");
  return dbInstance;
}

/**
 * Returns the current Knex.js database instance.
 * Throws an error if the database has not been initialized.
 * @returns {knex} The Knex.js instance.
 */
function getDatabase() {
  if (!dbInstance) {
    throw new Error(
      "Database not initialized. Please call initializeDatabase first."
    );
  }
  return dbInstance;
}

/**
 * Gets the currently active database configuration.
 * @returns {Object|null} The current database configuration or null if not set.
 */
function getCurrentDbConfig() {
  return currentDbConfig;
}

export { initializeDatabase, getDatabase, getCurrentDbConfig };
