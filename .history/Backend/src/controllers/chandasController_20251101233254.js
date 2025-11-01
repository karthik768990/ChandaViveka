import { supabase } from "../services/supabaseClient.js";
import Sanscript from "sanscript";

// ===================================================================
//  🌸 Sanskrit Prosody (Chandas) Engine — Fully Robust Version
// ===================================================================

/**
 * Syllabifier — returns Laghu/Guru pattern for each pāda
 * @param {string} shloka - Sanskrit input (Devanagari or IAST)
 * @returns {string[]} array of LG patterns (per pāda)
 */
const getLgPattern = (shloka) => {
  // Split verse into pādas using danda, double danda, or newlines
  const padaList = shloka
    .split(/[|।॥\n]+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const vowels = 'aiuṛḷāīūṝeo';
  const longVowels = 'āīūṝeo';
  const patterns = [];

  for (const pada of padaList) {
    // Always convert to IAST
    let iast = Sanscript.t(pada, "devanagari", "iast").toLowerCase();
    iast = iast.replace(/[.,\d\s]+/g, '');

    let pattern = '';
    for (let i = 0; i < iast.length; i++) {
      const char = iast[i];
      if (!vowels.includes(char)) continue;

      // handle diphthongs
      if (char === 'a' && (iast[i + 1] === 'i' || iast[i + 1] === 'u')) {
        pattern += 'G'; i++; continue;
      }

      // long vowels
      if (longVowels.includes(char)) {
        pattern += 'G'; continue;
      }

      const next1 = iast[i + 1] || '';
      const next2 = iast[i + 2] || '';

      // anusvāra/visarga makes guru
      if (next1 === 'ṃ' || next1 === 'ḥ') {
        pattern += 'G'; continue;
      }

      // consonant cluster → guru
      if (!vowels.includes(next1) && !vowels.includes(next2)) {
        pattern += 'G'; continue;
      }

      // default laghu
      pattern += 'L';
    }

    patterns.push(pattern);
  }

  return patterns;
};

// ===================================================================
//  Pattern Matcher — compares LG pattern with DB chandas patterns
// ===================================================================

/**
 * Match detected LG patterns with database entries
 * @param {string[]} lgPatterns - array of per-pāda LG strings
 * @param {Array} dbChandas - Supabase chandas table rows
 * @returns {{identifiedChandas: string, explanation: string}}
 */
const findMatchInDb = (lgPatterns, dbChandas) => {
  if (!lgPatterns || lgPatterns.length === 0) {
    return {
      identifiedChandas: "Unknown",
      explanation: "Input was empty or contained no recognizable vowels.",
    };
  }

  const combined = lgPatterns.join('');

  // --- 1️⃣ Try matching each pāda with DB patterns ---
  for (const chandas of dbChandas) {
    const { name, pattern } = chandas;
    if (typeof pattern !== 'string' || pattern.trim().length === 0) continue;

    let allMatch = true;
    for (const pada of lgPatterns) {
      // Allow partial match if pāda shorter or longer than canonical
      const shorter = pada.length <= pattern.length ? pada : pattern;
      const longer  = pada.length > pattern.length ? pada : pattern;
      if (!longer.startsWith(shorter)) {
        allMatch = false;
        break;
      }
    }

    if (allMatch) {
      return {
        identifiedChandas: name,
        explanation: `All pādas align (fully or partially) with the ${name} pattern (${pattern}).`,
      };
    }
  }

  // --- 2️⃣ Check special Anuṣṭubh case (8-syllable pādas) ---
  if (combined.length % 8 === 0) {
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
        explanation: `Matches Anuṣṭubh pattern (8-syllable pādas with 5th Laghu, 6th Guru).`,
      };
    }
  }

  // --- 3️⃣ Fuzzy fallback (for near-matches) ---
  const closeMatches = [];
  for (const chandas of dbChandas) {
    const { name, pattern } = chandas;
    if (typeof pattern !== 'string' || !pattern) continue;

    const distance = levenshtein(combined, pattern.repeat(Math.ceil(combined.length / pattern.length)).slice(0, combined.length));
    const similarity = 1 - distance / combined.length;

    if (similarity > 0.85) {
      closeMatches.push(`${name} (${Math.round(similarity * 100)}%)`);
    }
  }
  if (closeMatches.length > 0) {
    return {
      identifiedChandas: "Near match: " + closeMatches.join(", "),
      explanation: "Pattern closely resembles one or more known Chandas (minor variations possible).",
    };
  }

  // --- 4️⃣ Default fallback ---
  return {
    identifiedChandas: "Unknown / Mixed",
    explanation: `Could not match any standard Chandas. Full pattern: '${combined}' (length ${combined.length}). Ensure the verse is complete and correctly typed.`,
  };
};

/**
 * Simple Levenshtein distance (edit distance)
 */
const levenshtein = (a, b) => {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,     // deletion
        dp[i][j - 1] + 1,     // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[m][n];
};

// ===================================================================
//  Supabase Controllers
// ===================================================================

/**
 * GET all chandas patterns from DB
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
 * POST — analyze given śloka’s Chandas
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
    // 1. Load DB chandas definitions
    const { data: dbChandas, error: dbError } = await supabase.from("chandas").select("*");
    if (dbError) throw dbError;

    // 2. Prepare transliterations
    const isDevanagari = /[\u0900-\u097F]/.test(shloka);
    const devanagariForm = isDevanagari ? shloka : Sanscript.t(shloka, "iast", "devanagari");
    const latinForm = isDevanagari ? Sanscript.t(shloka, "devanagari", "iast") : shloka;

    // 3. Get Laghu-Guru pattern
    const padaPatterns = getLgPattern(shloka);
    const combinedPattern = padaPatterns.join('');

    // 4. Find best match
    const { identifiedChandas, explanation } = findMatchInDb(padaPatterns, dbChandas);

    // 5. Respond
    res.status(200).json({
      success: true,
      message: "Chandas analysis successful ✅",
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
      message: "Error analyzing Chandas ❌",
      error: err.message,
    });
  }
};
