import express from "express";
import {
  loginWithGoogle,
  handleAuthCallback,
  getUserProfile,
} from "../controllers/authController.js";

import { verifyAuth } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.get("/login", loginWithGoogle); //only for the google single platform authentication
 
router.get("/callback", handleAuthCallback);
router.get("/profile", verifyAuth, getUserProfile);

export default router;
