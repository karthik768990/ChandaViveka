import { supabase } from "../services/supabaseClient.js";
import Sanscript from "sanscript";
import { matchChandas } from "../utils/matchChandas.js";
//  Sanskrit Prosody (Chandas) Analyzer controller for the backend analysis fo the strings

/**
 * Syllabifier — returns Laghu/Guru pattern for each pāda
 * @param {string} shloka - Sanskrit input (Devanagari or IAST)
 * @returns {string[]} array of LG patterns (per pāda)
 */
const getLgPattern = (shloka) => {
  const padaList = shloka
    .split(/[|।॥\n]+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const shortVowels = ["a", "i", "u", "ṛ", "ḷ"];
  const longVowels = ["ā", "ī", "ū", "ṝ", "ḹ", "e", "ai", "o", "au"];
  const allVowels = [...shortVowels, ...longVowels];
  
  const patterns = [];
  let totalVowels = 0;

  for (const pada of padaList) {
    let iast = Sanscript.t(pada, "devanagari", "iast").toLowerCase();
    iast = iast.replace(/[^a-zāīūṛṝḷḹeioṃḥ\s]/g, "").replace(/\s+/g, "");

    let pattern = "";
    for (let i = 0; i < iast.length; i++) {
      let char = iast[i];
      let isVowel = false;
      let isLong = false;
      
      if (char === "a" && (iast[i + 1] === "i" || iast[i + 1] === "u")) {
        char = iast[i] + iast[i+1];
        i++; 
      }
      
      if (shortVowels.includes(char)) {
        isVowel = true;
      } else if (longVowels.includes(char)) {
        isVowel = true;
        isLong = true;
      }
      
      if (!isVowel) continue;
      
      totalVowels++;
      
      if (isLong) {
        pattern += "G";
        continue;
      }

      const next1 = iast[i + 1] || "";
      if (next1 === "ṃ" || next1 === "ḥ") {
        pattern += "G";
        continue;
      }
      
      let consonants = "";
      let j = i + 1;
      while (j < iast.length && !allVowels.includes(iast[j]) && iast[j] !== 'ṃ' && iast[j] !== 'ḥ') {
        consonants += iast[j];
        j++;
      }
      
      const simplifiedConsonants = consonants.replace(/([kgcjṭḍtdpb])h/g, "$1");
      
      if (simplifiedConsonants.length >= 2) {
        pattern += "G";
        continue;
      }
      
      pattern += "L";
    }

    if (pattern.length > 0) {
      patterns.push(pattern);
    }
  }

  if (totalVowels === 0) {
    throw new Error("No recognizable Sanskrit vowels found in the input.");
  }

  return patterns;
};




// Supabase Controllers

export const getAllChandas = async (req, res) => {
  try {
    const { data, error } = await supabase.from("chandas").select("*");
    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Fetched all Chandas successfully ",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching Chandas ",
      error: err.message,
    });
  }
};

// POST — Analyze śloka

export const analyzeChandas = async (req, res) => {
  const { shloka } = req.body;
  if (!shloka) {
    return res.status(400).json({
      success: false,
      message: "Missing shloka text ",
    });
  }

  try {
    const { data: dbChandas, error: dbError } = await supabase
      .from("chandas")
      .select("*");
    if (dbError) throw dbError;

    const isDevanagari = /[\u0900-\u097F]/.test(shloka);
    const devanagariForm = isDevanagari
      ? shloka
      : Sanscript.t(shloka, "iast", "devanagari");
    const latinForm = isDevanagari
      ? Sanscript.t(shloka, "devanagari", "iast")
      : shloka;

    let padaPatterns;
    try {
      padaPatterns = getLgPattern(shloka);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    const combinedPattern = padaPatterns.join("|");

    const { identifiedChandas, explanation } = matchChandas(
      padaPatterns,
      dbChandas
    );

    res.status(200).json({
      success: true,
      message: "Chandas analysis successful ",
      analysis: {
        input: {
          original: shloka,
          devanagari: devanagariForm,
          latin: latinForm,
        },
        pattern: {
          byPada: padaPatterns,
          combined: combinedPattern,
        },
        identifiedChandas,
        explanation,
      },
    });
  } catch (err) {
    console.error("Error in analyzeChandas:", err);
    res.status(500).json({
      success: false,
      message: "Error analyzing Chandas ",
      error: err.message,
    });
  }
};
