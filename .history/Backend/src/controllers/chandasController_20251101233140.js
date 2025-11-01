import { supabase } from "../services/supabaseClient.js";
import Sanscript from "sanscript";

// ===================================================================
// START: New Sanskrit Prosody Engine
// ===================================================================

/**
 * NEW, MORE ROBUST Syllabifier (Laghu/Guru Engine)
 * @param {string} shloka - The shloka in Devanagari or IAST.
 * @returns {string} The Laghu/Guru pattern (e.g., "GGLG...").
 */
const getLgPattern = (shloka) => {
  // Split into pādas (lines) based on traditional dividers
  const padaList = shloka
    .split(/[|।॥\n]+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const vowels = 'aiuṛḷāīūṝeo';
  const longVowels = 'āīūṝeo';
  const patterns = [];

  for (const pada of padaList) {
    let iast = Sanscript.t(pada, "devanagari", "iast").toLowerCase();
    iast = iast.replace(/[.,\d\s]+/g, '');

    let pattern = '';
    for (let i = 0; i < iast.length; i++) {
      const char = iast[i];
      if (!vowels.includes(char)) continue;

      if (char === 'a' && iast[i + 1] === 'i') {
        pattern += 'G'; i++; continue;
      }
      if (char === 'a' && iast[i + 1] === 'u') {
        pattern += 'G'; i++; continue;
      }

      if (longVowels.includes(char)) {
        pattern += 'G'; continue;
      }

      const next1 = iast[i + 1] || '';
      const next2 = iast[i + 2] || '';

      if (next1 === 'ṃ' || next1 === 'ḥ') {
        pattern += 'G'; continue;
      }

      if (!vowels.includes(next1) && !vowels.includes(next2)) {
        pattern += 'G'; continue;
      }

      pattern += 'L';
    }

    // Store pattern for this pāda
    patterns.push(pattern);
  }

  // Return both the array and a single combined string
  return patterns;
};



/**
 * Identifies the Chandas by comparing the input pattern against DB patterns.
 * @param {string} lgPattern - The pattern from getLgPattern.
 * @param {Array} dbChandas - The array of chandas objects from Supabase.
 * @returns {object} An object with { identifiedChandas, explanation }.
 */
const findMatchInDb = (lgPatterns, dbChandas) => {
  if (!lgPatterns || lgPatterns.length === 0) {
    return {
      identifiedChandas: "Unknown",
      explanation: "Input was empty or contained no vowels."
    };
  }

  // Flatten for total length
  const combined = lgPatterns.join('');

  // Check each pāda separately
  for (const chandas of dbChandas) {
    const { name, pattern } = chandas;
    if (typeof pattern !== 'string' || pattern.length === 0) continue;

    let allMatch = true;
    for (const pada of lgPatterns) {
      // Allow partial match if the pāda is incomplete
      if (!pattern.startsWith(pada) && !pada.startsWith(pattern)) {
        allMatch = false;
        break;
      }
    }

    if (allMatch) {
      return {
        identifiedChandas: name,
        explanation: `All pādas align (fully or partially) with the ${name} pattern (${pattern}).`
      };
    }
  }

  // Check special case: Anuṣṭubh
  if (combined.length > 0 && combined.length % 8 === 0) {
    const padas = combined.match(/.{1,8}/g);
    let isAnushtubh = true;
    for (const pada of padas) {
      if (pada.length !== 8 || pada[4] !== 'L' || pada[5] !== 'G') {
        isAnushtubh = false;
        break;
      }
    }
    if (isAnushtubh) {
      return {
        identifiedChandas: "Anuṣṭubh",
        explanation: `Matches Anuṣṭubh pattern (8-syllable pādas with 5th Laghu, 6th Guru).`
      };
    }
  }

  return {
    identifiedChandas: "Unknown / Mixed",
    explanation: `Could not match any standard Chandas. Ensure full pāda or verse is input.`
  };
};

// ===================================================================
// END: New Sanskrit Prosody Engine
// ===================================================================


/**
 * Fetch all Chandas entries from Supabase
 * (Unchanged)
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
 * (Unchanged, but now uses the new, robust functions)
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
    // 1. Fetch ALL chandas definitions from the database
    const { data: dbChandas, error: dbError } = await supabase.from("chandas").select("*");
    if (dbError) throw dbError;

    // 2. Transliterate for display
    const isDevanagari = /[\u0900-\u097F]/.test(shloka);
    const devanagariForm = isDevanagari
      ? shloka
      : Sanscript.t(shloka, "iast", "devanagari");
    const latinForm = isDevanagari
      ? Sanscript.t(shloka, "devanagari", "iast")
      : shloka;

    // 3. Call the prosody engine to get the pattern
    const padaPatterns = getLgPattern(shloka);
const combinedPattern = padaPatterns.join(''); // combine for overall structure


    
    // 4. Find the match using the new DB-driven function
const { identifiedChandas, explanation } = findMatchInDb(padaPatterns, dbChandas);


    // 5. Return the real analysis
    res.status(200).json({
      success: true,
      message: "Chandas analysis successful ✅",
      analysis: {
        input: {
          original: shloka,
          devanagari: devanagariForm,
          latin: latinForm,
        },
        pattern:{ 
          byPada :  padaPatterns,
          combined : combinedPattern
        }, 
        identifiedChandas,
        explanation,
      },
    });
  } catch (err) {
    console.error("Error in analyzeChandas:", err);
    res.status(500).json({
      success: false,
      message: "Error analyzing Chandas ❌",
      error: err.message,
    });
  }
};