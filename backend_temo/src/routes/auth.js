import express from "express";
import {
  loginWithGoogle,
  handleAuthCallback,
  getUserProfile,
} from "../controllers/authController.js";
import { verifyAuth } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.get("/login", loginWithGoogle); //if onoly provider that we are using is only the google if not then change it someother or use the login/google if you are having more than one provider for authentication 
router.get("/callback", handleAuthCallback);
router.get("/profile", verifyAuth, getUserProfile);

export default router;
