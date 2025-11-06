export function matchChandas(detectedPattern, chandasList) {
  let bestMatch = {
    name: "Unknown / Mixed",
    confidence: 0,
    matchedPattern: null,
  };

  for (const ch of chandasList) {
    const expected = ch.pattern[0];
    const perPada = ch.syllables_per_pada;
    const padaPatterns =
      detectedPattern.match(new RegExp(`.{1,${perPada}}`, "g")) || [];

    let matches = 0;
    for (const pada of padaPatterns) {
      const score = patternSimilarity(pada, expected);
      if (score > 0.8) matches++;
    }

    const overallScore = matches / (padaPatterns.length || 1);

    if (overallScore > bestMatch.confidence) {
      bestMatch = {
        name: ch.name,
        confidence: overallScore,
        matchedPattern: expected,
      };
    }
  }

  return bestMatch.confidence > 0.7 ? bestMatch : { name: "Unknown / Mixed" };
}

function patternSimilarity(a, b) {
  const len = Math.max(a.length, b.length);
  let same = 0;
  for (let i = 0; i < len; i++) {
    if (a[i] === b[i]) same++;
  }
  return same / len;
}
