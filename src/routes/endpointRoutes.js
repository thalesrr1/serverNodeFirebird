import { Router } from "express";
import {
  getEndpoints,
  createEndpoint,
  deleteEndpointById,
} from "../controllers/endpointController.js";

const router = Router();

router.get("/", getEndpoints);
router.post("/", createEndpoint);
router.delete("/:id", deleteEndpointById);

export default router;
