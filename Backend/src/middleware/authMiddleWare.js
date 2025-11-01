import { supabase } from "../services/supabaseClient.js";

export const verifyAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Missing Authorization header" });

    const { data, error } = await supabase.auth.getUser(token);
    if (error) throw error;

    req.user = data.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};
