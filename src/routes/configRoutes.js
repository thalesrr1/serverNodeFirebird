import { Router } from "express";
import {
  connectDatabase,
  getDatabaseConfig,
} from "../controllers/configController.js";

const router = Router();

router.post("/connect", connectDatabase);
router.get("/current", getDatabaseConfig);

export default router;
