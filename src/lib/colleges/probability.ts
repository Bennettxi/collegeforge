// Acceptance probability estimation based on match score and college acceptance rate

export function estimateAcceptanceProbability(matchScore: number, acceptanceRate: number): number {
  let probability: number;

  if (matchScore >= 80) {
    // Safety
    probability = Math.min(95, acceptanceRate * 1.8);
  } else if (matchScore >= 65) {
    // Likely
    probability = Math.min(85, acceptanceRate * 1.4);
  } else if (matchScore >= 45) {
    // Match
    probability = acceptanceRate * 1.1;
  } else if (matchScore >= 25) {
    // Reach
    probability = acceptanceRate * 0.7;
  } else {
    // Strong reach
    probability = acceptanceRate * 0.4;
  }

  // Clamp between 3 and 95
  probability = Math.max(3, Math.min(95, probability));

  return Math.round(probability);
}

export function getProbabilityColor(probability: number): string {
  if (probability >= 70) return 'text-emerald-600 dark:text-emerald-400';
  if (probability >= 50) return 'text-blue-600 dark:text-blue-400';
  if (probability >= 30) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

export function getProbabilityLabel(probability: number): string {
  if (probability >= 75) return 'Very Likely';
  if (probability >= 55) return 'Good Chance';
  if (probability >= 35) return 'Possible';
  if (probability >= 20) return 'Competitive';
  return 'Long Shot';
}
