export const DEFAULT_SIMILARITY_THRESHOLD = 0.7;

export const levenshtein = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string") {
    throw new TypeError("Inputs to levenshtein must be strings.");
  }
  const m = a.length,
    n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

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

export const patternSimilarity = (detectedPattern, expectedPattern) => {
  if (!detectedPattern || !expectedPattern) return 0;
  if (typeof detectedPattern !== "string" || typeof expectedPattern !== "string") return 0;
  
  const m = detectedPattern.length;
  if (m === 0) return 0;

  const distance = levenshtein(detectedPattern, expectedPattern);
  return Math.max(0, 1 - distance / m);
};

export function matchChandas(lgPatterns, dbChandas) {
  if (!Array.isArray(lgPatterns) || lgPatterns.length === 0) {
    return {
      identifiedChandas: "Unknown",
      explanation: "Input was empty or contained no recognizable vowels.",
      similarity: 0,
    };
  }

  const combined = lgPatterns.join("");
  if (combined.length === 0) {
    return {
      identifiedChandas: "Unknown",
      explanation: "Input contained no recognizable metric patterns.",
      similarity: 0,
    };
  }

  let bestMatch = {
    name: "Unknown / Mixed",
    similarity: 0,
    matchedPattern: "",
  };

  for (const ch of dbChandas) {
    const base = Array.isArray(ch.pattern) ? ch.pattern[0] : ch.pattern;
    if (typeof base !== "string" || base.trim().length === 0) continue;

    // Repeat base to approximate total length
    const repeated = base.repeat(Math.ceil(combined.length / base.length) || 1);
    const truncated = repeated.slice(0, combined.length);

    const similarity = patternSimilarity(combined, truncated);

    if (similarity > bestMatch.similarity) {
      bestMatch = { name: ch.name, similarity, matchedPattern: base };
    }
  }

  if (bestMatch.similarity >= DEFAULT_SIMILARITY_THRESHOLD) {
    return {
      identifiedChandas: bestMatch.name,
      explanation: `Detected pattern (${combined.length} syllables) matches ${
        bestMatch.name
      } with ${(bestMatch.similarity * 100).toFixed(2)}% confidence.\nCanonical pattern: ${bestMatch.matchedPattern}`,
      similarity: bestMatch.similarity,
    };
  }

  // Check Anuṣṭubh (8-syllable pādas) as fallback for mixed similarity
  if (combined.length > 0 && combined.length % 8 === 0) {
    const padas = combined.match(/.{1,8}/g);
    const ok = padas.every((p) => p.length === 8 && p[4] === "L" && p[5] === "G");
    if (ok) {
      return {
        identifiedChandas: "Anuṣṭubh",
        explanation: "Matches Anuṣṭubh (8-syllable pādas, 5th Laghu, 6th Guru).",
        similarity: 1,
      };
    }
  }

  return {
    identifiedChandas: "Unknown / Mixed",
    explanation: `Could not match any standard Chandas. Full pattern: '${combined}' (length ${combined.length}). Ensure the verse is complete and correctly typed.`,
    similarity: bestMatch.similarity,
  };
}
