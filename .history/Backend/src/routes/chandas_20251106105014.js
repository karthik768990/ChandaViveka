import express from "express";
import {
  getAllChandas,
  analyzeChandas,
} from "../controllers/chandasController.js";
import { validateShlokaInput } from "../middleware/validateInput.js";

const router = express.Router();

router.get("/", getAllChandas);

// Analyze a given shloka for its Chandas pattern
router.post("/analyze", validateShlokaInput, analyzeChandas);

export default router;
