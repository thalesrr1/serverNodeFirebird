import {
  getAllEndpoints,
  addEndpoint,
  deleteEndpoint,
  updateEndpoint,
} from "../services/endpointService.js";

export const getEndpoints = (req, res) => {
  try {
    const endpoints = getAllEndpoints();
    res.status(200).json(endpoints);
  } catch (error) {
    console.error("Error getting endpoints:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve endpoints.", details: error.message });
  }
};

export const createEndpoint = async (req, res) => {
  const { name, method, sql } = req.body;

  if (!name || !method || !sql) {
    return res
      .status(400)
      .json({ error: "Endpoint name, method, and SQL query are required." });
  }

  // Basic validation for method
  const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
  if (!allowedMethods.includes(method.toUpperCase())) {
    return res.status(400).json({
      error: `Invalid HTTP method. Allowed methods are: ${allowedMethods.join(
        ", "
      )}.`,
    });
  }

  try {
    const newEndpoint = await addEndpoint({
      name,
      method: method.toUpperCase(),
      sql,
    });
    res.status(201).json({
      message: "Endpoint created successfully.",
      endpoint: newEndpoint,
    });
  } catch (error) {
    console.error("Error creating endpoint:", error);
    res
      .status(500)
      .json({ error: "Failed to create endpoint.", details: error.message });
  }
};

export const deleteEndpointById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Endpoint ID is required." });
  }

  try {
    const deleted = await deleteEndpoint(id);
    if (deleted) {
      res.status(200).json({ message: "Endpoint deleted successfully." });
    } else {
      res.status(404).json({ error: "Endpoint not found." });
    }
  } catch (error) {
    console.error("Error deleting endpoint:", error);
    res
      .status(500)
      .json({ error: "Failed to delete endpoint.", details: error.message });
  }
};

export const updateEndpointById = async (req, res) => {
  const { id } = req.params;
  const { name, method, sql } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Endpoint ID is required." });
  }

  // Basic validation for method
  if (method) {
    const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
    if (!allowedMethods.includes(method.toUpperCase())) {
      return res.status(400).json({
        error: `Invalid HTTP method. Allowed methods are: ${allowedMethods.join(
          ", "
        )}.`,
      });
    }
  }

  try {
    const updatedData = {};
    if (name) updatedData.name = name;
    if (method) updatedData.method = method.toUpperCase();
    if (sql) updatedData.sql = sql;

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ error: "No update data provided." });
    }

    const updatedEndpoint = await updateEndpoint(id, updatedData);

    if (updatedEndpoint) {
      res.status(200).json({
        message: "Endpoint updated successfully.",
        endpoint: updatedEndpoint,
      });
    } else {
      res.status(404).json({ error: "Endpoint not found." });
    }
  } catch (error) {
    console.error("Error updating endpoint:", error);
    res
      .status(500)
      .json({ error: "Failed to update endpoint.", details: error.message });
  }
};
