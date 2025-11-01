import { supabase } from "../services/supabaseClient.js";
import Sanscript from "sanscript"; // For transliteration

// ===================================================================
// START: Sanskrit Prosody Engine
// ===================================================================

/**
 * Analyzes a shloka and returns its Laghu/Guru pattern string (e.g., "GGLG...").
 * This function is our "syllabifier".
 * @param {string} shloka - The shloka in Devanagari or IAST.
 * @returns {string} The Laghu/Guru pattern.
 */
const getLgPattern = (shloka) => {
  // 1. Transliterate to IAST (Latin) and convert to lowercase
  let iast = Sanscript.t(shloka, "devanagari", "iast").toLowerCase();
  
  // 2. Mark short vowels that are Guru as uppercase
  const guruRegex = /([aiuṛḷ])(?=([^aiuṛḷāīūṝeoṃḥ\s][^aiuṛḷāīūṝeo\s])|[ṃḥ])/g;
  iast = iast.replace(guruRegex, (match, shortVowel) => {
    return shortVowel.toUpperCase(); // e.g., 'a' -> 'A'
  });
  
  // 3. Remove spaces and punctuation
  iast = iast.replace(/['\d.| ]+/g, '');
  
  // 4. Build the final L/G pattern string
  let pattern = '';
  for (let i = 0; i < iast.length; i++) {
    const char = iast[i];
    
    if (char === 'a' && iast[i+1] === 'i') {
      pattern += 'G'; i++;
    } else if (char === 'a' && iast[i+1] === 'u') {
      pattern += 'G'; i++;
    } else if ('āīūṝeoAIUṚḶ'.includes(char)) {
      pattern += 'G';
    } else if ('aiuṛḷ'.includes(char)) {
      pattern += 'L';
    }
    // Ignore consonants
  }
  return pattern;
};
/**
 * Identifies the Chandas by comparing the input pattern against DB patterns.
 * @param {string} lgPattern - The pattern from getLgPattern (e.g., "GGGL...").
 * @param {Array} dbChandas - The array of chandas objects from Supabase.
 * @returns {object} An object with { identifiedChandas, explanation }.
 */
const findMatchInDb = (lgPattern, dbChandas) => {
  if (!lgPattern || lgPattern.length === 0) {
    return {
      identifiedChandas: "Unknown",
      explanation: "Input was empty or contained no vowels."
    };
  }

  // 1. Check for exact matches from the DB
  for (const chandas of dbChandas) {
    const { name, pattern } = chandas;
    
    // --- ✅ THE FIX IS HERE ---
    // Skip if the DB entry has no pattern OR if the pattern is not a string
    if (!pattern || typeof pattern !== 'string') {
      continue; // Go to the next chandas in the loop
    }
    // --- END FIX ---

    // Check if the input pattern is a perfect repeat of the DB pattern
    if (lgPattern.length > 0 && lgPattern.length % pattern.length === 0) {
      const repeats = lgPattern.length / pattern.length;
      
      // Now we know 'pattern' is a string, so .repeat() is safe
      if (pattern.repeat(repeats) === lgPattern) {
        return { 
          identifiedChandas: name, 
          explanation: `Matches the ${name} pattern. (Detected ${repeats} pāda/s).`
        };
      }
    }
  }

  // 2. If no exact match, check for Anuṣṭubh (special complex case)
  // (This part is unchanged and safe)
  if (lgPattern.length > 0 && lgPattern.length % 8 === 0) {
    const padas = lgPattern.match(/.{1,8}/g); // Split into 8-char chunks
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
        explanation: `Matches the Anuṣṭubh pattern (pādas of 8 syllables, with 5th Laghu and 6th Guru). Detected ${padas.length} pāda/s.`
      };
    }
  }

  // 3. Default fallback
  return {
    identifiedChandas: "Unknown / Mixed",
    explanation: `Could not match the full pattern '${lgPattern}' (Length: ${lgPattern.length}) to a single, known Chandas in the database.`
  };
};
// END: Sanskrit Prosody Engine
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
 * (This function is unchanged, but now uses the fixed findMatchInDb)
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
    const lgPattern = getLgPattern(shloka);
    
    // 4. Find the match using the new DB-driven function
    const { identifiedChandas, explanation } = findMatchInDb(lgPattern, dbChandas);

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
        pattern: lgPattern, // Send the pattern to the frontend
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