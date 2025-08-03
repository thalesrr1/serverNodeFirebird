import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import app from "../server.js"; // Import the app instance

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENDPOINTS_FILE = path.join(__dirname, "../../endpoints.json");

let endpoints = [];

/**
 * Ensures the endpoints.json file exists and loads its content.
 */
async function loadEndpoints() {
  try {
    const data = await fs.readFile(ENDPOINTS_FILE, "utf8");
    endpoints = JSON.parse(data);
    console.log(`Loaded ${endpoints.length} endpoints from ${ENDPOINTS_FILE}`);
  } catch (error) {
    if (error.code === "ENOENT") {
      // File does not exist, create it with an empty array
      await fs.writeFile(ENDPOINTS_FILE, "[]", "utf8");
      console.log(`Created empty endpoints file at ${ENDPOINTS_FILE}`);
      endpoints = [];
    } else {
      console.error("Error loading endpoints:", error);
      throw error;
    }
  }
}

/**
 * Saves the current in-memory endpoints array to the file.
 */
async function saveEndpoints() {
  try {
    await fs.writeFile(
      ENDPOINTS_FILE,
      JSON.stringify(endpoints, null, 2),
      "utf8"
    );
    console.log(`Saved ${endpoints.length} endpoints to ${ENDPOINTS_FILE}`);
    // Emit an event to notify the server about endpoint changes
    if (app) {
      // Check if app is defined (it might not be during initial load)
      app.emit("endpointsUpdated");
    }
  } catch (error) {
    console.error("Error saving endpoints:", error);
    throw error;
  }
}

/**
 * Retrieves all stored endpoints.
 * @returns {Array} An array of endpoint definitions.
 */
function getAllEndpoints() {
  return [...endpoints]; // Return a copy to prevent direct modification
}

/**
 * Adds a new endpoint.
 * @param {Object} endpoint - The endpoint definition to add.
 * @returns {Object} The added endpoint with a generated ID.
 */
async function addEndpoint(endpoint) {
  const newEndpoint = { id: Date.now().toString(), ...endpoint }; // Simple ID generation
  endpoints.push(newEndpoint);
  await saveEndpoints();
  return newEndpoint;
}

/**
 * Deletes an endpoint by ID.
 * @param {string} id - The ID of the endpoint to delete.
 * @returns {boolean} True if the endpoint was deleted, false otherwise.
 */
async function deleteEndpoint(id) {
  const initialLength = endpoints.length;
  endpoints = endpoints.filter((ep) => ep.id !== id);
  if (endpoints.length < initialLength) {
    await saveEndpoints();
    return true;
  }
  return false;
}

// Load endpoints when the module is imported
loadEndpoints();

export { loadEndpoints, getAllEndpoints, addEndpoint, deleteEndpoint };
