import { supabase } from "../services/supabaseClient.js";
import Sanscript from "sanscript"; // For transliteration

// ===================================================================
// START: New Sanskrit Prosody Engine
// ===================================================================

/**
 * A dictionary of known Chandas patterns (pāda-by-pāda).
 */
const chandasDefinitions = {
  "Vasantatilakā": {
    pattern: "GGLGLLLGLGGLGG", // 14 syllables
    explanation: "Matches the Vasantatilakā pattern (tā, bha, jā, ja, gau, gaḥ) — 14 syllables per pāda."
  },
  "Indravajrā": {
    pattern: "GGLGGLGLGG", // 11 syllables
    explanation: "Matches the Indravajrā pattern (tā, tā, jā, gau, gaḥ) — 11 syllables per pāda."
  },
  "Upendravajrā": {
    pattern: "LGLGGLGLGG", // 11 syllables
    explanation: "Matches the Upendravajrā pattern (jā, tā, jā, gau, gaḥ) — 11 syllables per pāda."
  },
  "Mālinī": {
    pattern: "LLLLLLGGLGLGGLG", // 15 syllables
    explanation: "Matches the Mālinī pattern (na, na, ma, ya, ya) — 15 syllables per pāda."
  },
};

/**
 * Analyzes a shloka and returns its Laghu/Guru pattern string (e.g., "GGLG...").
 * @param {string} shloka - The shloka in Devanagari or IAST.
 * @returns {string} The Laghu/Guru pattern.
 */
const getLgPattern = (shloka) => {
  // 1. Transliterate to IAST (Latin) and convert to lowercase
  let iast = Sanscript.t(shloka, "devanagari", "iast").toLowerCase();
  
  // 2. Mark short vowels that are Guru as uppercase
  // A short vowel ([aiuṛḷ]) is Guru if followed by:
  //   a) A conjunct consonant (C-C)
  //   b) Anusvāra (ṃ) or Visarga (ḥ)
  const guruRegex = /([aiuṛḷ])(?=([^aiuṛḷāīūṝeoṃḥ\s][^aiuṛḷāīūṝeo\s])|[ṃḥ])/g;
  iast = iast.replace(guruRegex, (match, shortVowel) => {
    return shortVowel.toUpperCase(); // e.g., 'a' -> 'A'
  });
  
  // 3. Remove spaces and punctuation AFTER marking, so they don't block conjuncts
  iast = iast.replace(/['\d.| ]+/g, '');
  
  // 4. Build the final L/G pattern string
  let pattern = '';
  for (let i = 0; i < iast.length; i++) {
    const char = iast[i];
    
    // Handle diphthongs 'ai' and 'au' (always Guru)
    if (char === 'a' && iast[i+1] === 'i') {
      pattern += 'G';
      i++; // Skip the 'i'
    } else if (char === 'a' && iast[i+1] === 'u') {
      pattern += 'G';
      i++; // Skip the 'u'
    }
    // Handle long vowels (ā, ī, etc.) or short-marked-as-Guru (A, I, etc.)
    else if ('āīūṝeoAIUṚḶ'.includes(char)) {
      pattern += 'G';
    }
    // Handle short vowels (a, i, etc.)
    else if ('aiuṛḷ'.includes(char)) {
      pattern += 'L';
    }
    // Ignore consonants
  }
  return pattern;
};

/**
 * Identifies the Chandas from a given Laghu/Guru pattern.
 * @param {string} lgPattern - The pattern from getLgPattern (e.g., "GGGL LGGG...").
 * @returns {object} An object with { identifiedChandas, explanation }.
 */
const identifyChandas = (lgPattern) => {
  if (!lgPattern || lgPattern.length === 0) {
    return {
      identifiedChandas: "Unknown",
      explanation: "Input was empty or contained no vowels."
    };
  }

  // 1. Check for exact matches first (Vasantatilakā, etc.)
  for (const [name, { pattern, explanation }] of Object.entries(chandasDefinitions)) {
    // Check if the input pattern is a perfect repeat of the definition
    if (lgPattern.length > 0 && lgPattern.length % pattern.length === 0) {
      const repeats = lgPattern.length / pattern.length;
      if (pattern.repeat(repeats) === lgPattern) {
        return { 
          identifiedChandas: name, 
          explanation: `${explanation} (Detected ${repeats} pāda/s).`
        };
      }
    }
  }

  // 2. If no exact match, check for Anuṣṭubh (most common)
  // Rule: Must be in 8-syllable pādas
  if (lgPattern.length > 0 && lgPattern.length % 8 === 0) {
    const padas = lgPattern.match(/.{1,8}/g); // Split into 8-char chunks
    let isAnushtubh = true;
    
    for (const pada of padas) {
      // Main Anuṣṭubh rule: 5th syllable must be Laghu
      if (pada[4] !== 'L') {
        isAnushtubh = false;
        break;
      }
      // Main Anuṣṭubh rule: 6th syllable must be Guru
      if (pada[5] !== 'G') {
        isAnushtubh = false;
        break;
      }
    }
    
    if (isAnushtubh) {
      return {
        identifiedChandas: "Anuṣṭubh",
        explanation: `Matches the Anuṣṭubh pattern (pādas of 8 syllables, with 5th Laghu and 6th Guru). Detected ${padas.length} pāda/s.`
      };
    }
  }

  // 3. Default fallback
  return {
    identifiedChandas: "Unknown / Mixed",
    explanation: `Could not match the full pattern '${lgPattern}' (Length: ${lgPattern.length}) to a single, known Chandas. It may be a mixed meter (Upajāti) or not a standard meter.`
  };
};

// ===================================================================
// END: New Sanskrit Prosody Engine
// ===================================================================


/**
 * Fetch all Chandas entries from Supabase
 * (This function is unchanged)
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
 * (This function is NOW UPDATED)
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
    // 1. Transliterate for display
    const isDevanagari = /[\u0900-\u097F]/.test(shloka);
    const devanagariForm = isDevanagari
      ? shloka
      : Sanscript.t(shloka, "iast", "devanagari");
    const latinForm = isDevanagari
      ? Sanscript.t(shloka, "devanagari", "iast")
      : shloka;

    // 2. Call the new prosody engine
    const lgPattern = getLgPattern(shloka);
    const { identifiedChandas, explanation } = identifyChandas(lgPattern);

    // 3. Return the real analysis
    res.status(200).json({
      success: true,
      message: "Chandas analysis successful ✅",
      analysis: {
        input: {
          original: shloka,
          devanagari: devanagariForm,
          latin: latinForm,
        },
        pattern: lgPattern, // Send the pattern to the frontend!
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