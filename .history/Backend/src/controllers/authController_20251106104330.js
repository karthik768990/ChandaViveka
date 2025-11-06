import { supabase } from "../services/supabaseClient.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Redirect the user to Google Auth URL
 */
export const loginWithGoogle = async (req, res) => {
  const redirectTo = `${
    process.env.APP_REDIRECT_URL || "https://chada-frontend.onrender.com"  //HardCoded as the webpage i will be using is the static and fixed
  }`; 

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  if (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  res.json({
    success: true,
    url: data.url,
  });
};

//to handle the authentication call back after the google login

export const handleAuthCallback = async (req, res) => {
  const { access_token, refresh_token } = req.query;

  if (!access_token) {
    return res
      .status(400)
      .json({ success: false, message: "Missing access token" });
  }

  res.json({
    success: true,
    message: "Authentication successful ✅",
    access_token,
    refresh_token,
  });
};



export const getUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("Missing bearer token");

    const { data, error } = await supabase.auth.getUser(token);
    if (error) throw error;

    res.json({
      success: true,
      user: data.user,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message || "Unauthorized",
    });
  }
};
