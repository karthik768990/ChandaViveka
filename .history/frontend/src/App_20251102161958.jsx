import React from "react";

import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Settings from "./pages/Settings.jsx";
import ChandasAnalyzer from "./pages/ChandasAnalyzer.jsx";
import CallbackPage from "./pages/Callback.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AnimatedPage from "./components/AnimationPage.jsx";

const App = () => {
  const location = useLocation();

  return (
    <Layout>
      <AnimatedPage key={location.pathname}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyzer"
            element={
              <ProtectedRoute>
                <ChandasAnalyzer />
              </ProtectedRoute>
            }
          />
          <Route path="/auth/callback" element={<CallbackPage />} />
        </Routes>
      </AnimatedPage>
    </Layout>
  );
};

export default App;
