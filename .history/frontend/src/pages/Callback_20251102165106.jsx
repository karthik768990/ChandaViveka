// src/pages/Callback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Callback page mounted...");
    const handleAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data?.session) {
          console.log("✅ Logged in successfully, redirecting...");
          navigate("/analyzer"); // or "/dashboard" if you prefer
        } else {
          console.warn("⚠️ No session found, redirecting to home.");
          navigate("/");
        }
      } catch (err) {
        console.error("Callback error:", err.message);
        navigate("/");
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div style={{ color: "#ccc", textAlign: "center", marginTop: "3rem" }}>
      Logging you in... Please wait.
    </div>
  );
};

export default CallbackPage;
