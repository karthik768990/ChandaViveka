import { useState, useEffect } from "react";
import api from "../services/api";

export const useChandasAnalyzer = () => {
  const [shloka, setShloka] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [chandasList, setChandasList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChandas = async () => {
      try {
        const { data } = await api.get("/chandas");
        if (data.success) {
          setChandasList(data.data);
        }
      } catch (err) {
        console.error("Error fetching chandas list", err);
      } finally {
        setListLoading(false);
      }
    };
    fetchChandas();
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!shloka.trim()) {
      setError("Please enter a shloka to analyze.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setAnalysis(null);
    
    try {
      const { data } = await api.post("/chandas/analyze", { shloka });
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setError(data.message || "Unable to analyze.");
      }
    } catch (err) {
      // Implement Fail Fast error surfacing
      setError(
        err.response?.data?.message || err.message || "Server error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setShloka("");
    setAnalysis(null);
    setError(null);
  };

  return {
    shloka,
    setShloka,
    analysis,
    chandasList,
    loading,
    listLoading,
    error,
    handleSubmit,
    resetAnalysis,
  };
};
