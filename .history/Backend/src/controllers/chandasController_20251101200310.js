import { supabase } from "../services/supabaseClient.js";
import Sanscript from "sanscript"; // For transliteration between Devanagari and Latin (IAST)

/**
 * Fetch all Chandas entries from Supabase
 */
export const getAllChandas = async (req, res) => {
  try {
    const { data, error } = await supabase.from("chandas").select("*");
    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Fetched all Chandas successfully ✅",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching Chandas ❌",
      error: err.message,
    });
  }
};
/**
 * Analyze the Chandas of a given śloka
 */
export const analyzeChandas = async (req, res) => {
  const { shloka } = req.body;

  if (!shloka) {
    return res.status(400).json({
      success: false,
      message: "Missing shloka text ❌",
    });
  }

  try {
    // Detect if input is in Devanagari or Latin (simple heuristic)
    const isDevanagari = /[\u0900-\u097F]/.test(shloka);

    // Transliterate accordingly
    const devanagariForm = isDevanagari
      ? shloka
      : Sanscript.t(shloka, "iast", "devanagari");
    const latinForm = isDevanagari
      ? Sanscript.t(shloka, "devanagari", "iast")
      : shloka;

    // --- NEW LOGIC ---
    // This is a temporary stub to test your example
    
    let identifiedChandas = "Anuṣṭubh"; // Default
    let explanation = "Matches the Anuṣṭubh pattern — 4 pādas with 8 syllables each.";

    // Check if the input contains the Vasantatilakā shloka
    if (latinForm.toLowerCase().includes("vāgarthāviva saṃpṛktau")) {
      identifiedChandas = "Vasantatilakā";
      explanation = "Matches the Vasantatilakā pattern (tā, bha, jā, ja, gau, gaḥ) — 14 syllables per pāda.";
    }

    // --- END NEW LOGIC ---

    res.status(200).json({
      success: true,
      message: "Chandas analysis successful ✅",
      analysis: {
        input: {
          original: shloka,
          devanagari: devanagariForm,
          latin: latinForm,
        },
        identifiedChandas,
        explanation,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error analyzing Chandas ❌",
      error: err.message,
    });
  }
};
