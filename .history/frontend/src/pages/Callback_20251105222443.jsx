// src/pages/Callback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      console.log("🔁 Checking session...");
      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData?.session) {
        console.log("✅ Session found, redirecting to /analyzer");
        navigate("/analyzer", { replace: true });
      } else {
        // Wait for auth state change after redirect
        console.log("⏳ Waiting for session...");
        const { data: listener } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            if (session) {
              console.log("✅ Session received! Redirecting...");
              navigate("/analyzer", { replace: true });
            }
          }
        );

        setTimeout(() => {
          listener.subscription.unsubscribe();
          navigate("/", { replace: true });
        }, 6000);
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
