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
  // 1. Transliterate to IAST (Latin) and clean it
  let iast = Sanscript.t(shloka, "devanagari", "iast").toLowerCase();
  iast = iast.replace(/[|.,\d\s]+/g, ''); // Remove punctuation, spaces, and numbers

  const vowels = 'aiuṛḷāīūṝeo';
  const longVowels = 'āīūṝeo';
  let pattern = '';
  
  for (let i = 0; i < iast.length; i++) {
    let char = iast[i];
    
    // Skip consonants
    if (!vowels.includes(char)) {
      continue;
    }

    // Handle 'ai' and 'au' diphthongs (always Guru)
    if (char === 'a' && iast[i+1] === 'i') {
      pattern += 'G';
      i++; // Skip the 'i'
      continue;
    }
    if (char === 'a' && iast[i+1] === 'u') {
      pattern += 'G';
      i++; // Skip the 'u'
      continue;
    }

    // Check if the vowel is long (always Guru)
    if (longVowels.includes(char)) {
      pattern += 'G';
      continue;
    }

    // Now we know it's a short vowel ('a', 'i', 'u', 'ṛ', 'ḷ')
    // Check for Guru-making conditions
    let next1 = iast[i+1] || '';
    let next2 = iast[i+2] || '';

    // Condition 1: Followed by Anusvāra (ṃ) or Visarga (ḥ)
    if (next1 === 'ṃ' || next1 === 'ḥ') {
      pattern += 'G';
      continue;
    }
    
    // Condition 2: Followed by a conjunct consonant
    // A conjunct is two or more consonants
    if (!vowels.includes(next1) && !vowels.includes(next2)) {
      pattern += 'G';
      continue;
    }
    
    // If no conditions are met, it's Laghu
    pattern += 'L';
  }
  return pattern;
};


/**
 * Identifies the Chandas by comparing the input pattern against DB patterns.
 * @param {string} lgPattern - The pattern from getLgPattern.
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
    
    // --- ✅ ROBUST FIX ---
    // Skip if 'pattern' is not a string or is empty
    if (typeof pattern !== 'string' || pattern.length === 0) {
      continue; // Go to the next chandas in the loop
    }
    // --- END FIX ---

    // Debugging: See what the engine is comparing
    console.log(`Comparing input (len ${lgPattern.length}) with DB '${name}' (len ${pattern.length})`);

    // Check if the input pattern is a perfect repeat of the DB pattern
    if (lgPattern.length > 0 && lgPattern.length % pattern.length === 0) {
      const repeats = lgPattern.length / pattern.length;
      
      if (pattern.repeat(repeats) === lgPattern) {
        return { 
          identifiedChandas: name, 
          explanation: `Matches the ${name} pattern. (Detected ${repeats} pāda/s).`
        };
      }
    }
  }

  // 2. If no exact match, check for Anuṣṭubh (special complex case)
  if (lgPattern.length > 0 && lgPattern.length % 8 === 0) {
    const padas = lgPattern.match(/.{1,8}/g); 
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
    explanation: `Could not match the full pattern '${lgPattern}' (Length: ${lgPattern.length}) to a single, known Chandas in the database. Ensure you pasted a full, complete pāda or verse.`
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
        pattern: lgPattern, 
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