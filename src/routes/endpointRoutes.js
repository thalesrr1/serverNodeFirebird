import { Router } from "express";
import {
  getEndpoints,
  createEndpoint,
  deleteEndpointById,
  updateEndpointById,
} from "../controllers/endpointController.js";

const router = Router();

router.get("/", getEndpoints);
router.post("/", createEndpoint);
router.delete("/:id", deleteEndpointById);
router.put("/:id", updateEndpointById);

export default router;
