import { supabase } from "../services/supabaseClient.js";
import Sanscript from "sanscript";

//  Sanskrit Prosody (Chandas) Analyzer controller for the backend analysis fo the strings 

/**
 * Syllabifier — returns Laghu/Guru pattern for each pāda
 * @param {string} shloka - Sanskrit input (Devanagari or IAST)
 * @returns {string[]} array of LG patterns (per pāda)
 */
const getLgPattern = (shloka) => {
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

      if (char === 'a' && (iast[i + 1] === 'i' || iast[i + 1] === 'u')) {
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

    patterns.push(pattern);
  }

  return patterns;
};

// Pattern Matcher — with fuzzy similarity using simple  Levenshtein distance 

const levenshtein = (a, b) => {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
};

/**
 * Fuzzy Chandas matcher
 */
const findMatchInDb = (lgPatterns, dbChandas) => {
  if (!lgPatterns || lgPatterns.length === 0) {
    return {
      identifiedChandas: "Unknown",
      explanation: "Input was empty or contained no recognizable vowels.",
    };
  }

  const combined = lgPatterns.join("");

  let bestMatch = { name: "Unknown / Mixed", similarity: 0, matchedPattern: "" };

  

  // 1️⃣ Compare with every chandas pattern using fuzzy similarity
  for (const ch of dbChandas) {
    const base = Array.isArray(ch.pattern) ? ch.pattern[0] : ch.pattern;
    if (typeof base !== "string" || base.trim().length === 0) continue;

    // Repeat base to approximate total length
    const repeated = base.repeat(Math.ceil(combined.length / base.length));
    const truncated = repeated.slice(0, combined.length);

    const distance = levenshtein(combined, truncated);
    const similarity = 1 - distance / combined.length;

    if (similarity > bestMatch.similarity) {
      bestMatch = { name: ch.name, similarity, matchedPattern: base };
    }
  }

  // 2️⃣ Threshold logic
  if (bestMatch.similarity >= 0.7) {
    return {
      identifiedChandas: bestMatch.name,
      explanation: `Detected pattern (${combined.length} syllables) matches ${bestMatch.name} with ${(bestMatch.similarity * 100).toFixed(1)}% confidence.\nCanonical pattern: ${bestMatch.matchedPattern}`,
    };
  }

  // 3️⃣ Check Anuṣṭubh (8-syllable pādas)
  if (combined.length % 8 === 0) {
    const padas = combined.match(/.{1,8}/g);
    const ok = padas.every(p => p.length === 8 && p[4] === "L" && p[5] === "G");
    if (ok) {
      return {
        identifiedChandas: "Anuṣṭubh",
        explanation: "Matches Anuṣṭubh (8-syllable pādas, 5th Laghu, 6th Guru).",
      };
    }
  }

  // 4️⃣ Otherwise no clear match
  return {
    identifiedChandas: "Unknown / Mixed",
    explanation: `Could not match any standard Chandas. Full pattern: '${combined}' (length ${combined.length}). Ensure the verse is complete and correctly typed.`,
  };
};

// Supabase Controllers

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

// POST — Analyze śloka

export const analyzeChandas = async (req, res) => {
  const { shloka } = req.body;
  if (!shloka) {
    return res.status(400).json({
      success: false,
      message: "Missing shloka text ❌",
    });
  }

  try {
    const { data: dbChandas, error: dbError } = await supabase.from("chandas").select("*");
    if (dbError) throw dbError;

    const isDevanagari = /[\u0900-\u097F]/.test(shloka);
    const devanagariForm = isDevanagari ? shloka : Sanscript.t(shloka, "iast", "devanagari");
    const latinForm = isDevanagari ? Sanscript.t(shloka, "devanagari", "iast") : shloka;

    const padaPatterns = getLgPattern(shloka);
    const combinedPattern = padaPatterns.join("|");

    const { identifiedChandas, explanation } = findMatchInDb(padaPatterns, dbChandas);

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
