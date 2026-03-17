import { AwardData } from '@/types/profile';
import { CategoryScore, ScoreDetail, getScoreLabel } from '@/types/scoring';
import { clamp } from '@/lib/utils';

export function scoreAwards(data: AwardData): CategoryScore {
  const breakdown: ScoreDetail[] = [];
  const awards = data.awards;

  if (awards.length === 0) {
    breakdown.push({ factor: 'Awards', value: 10, description: 'No awards yet — focus on activities and leadership instead' });
    return { category: 'awards', score: 10, label: getScoreLabel(10), breakdown };
  }

  const levelPoints: Record<string, number> = {
    international: 25,
    national: 20,
    state: 14,
    regional: 8,
    school: 4,
  };

  let sumPoints = 0;
  for (const award of awards) {
    sumPoints += levelPoints[award.level] ?? 4;
  }

  const highestLevel = awards.reduce((best, a) => {
    const pts = levelPoints[a.level] ?? 0;
    return pts > best.pts ? { level: a.level, pts } : best;
  }, { level: '', pts: 0 });

  breakdown.push({ factor: 'Award Points', value: Math.min(sumPoints, 90), description: `${awards.length} award(s), highest level: ${highestLevel.level}` });

  // Diversity bonus
  const uniqueCategories = new Set(awards.map(a => a.category));
  const diversityBonus = Math.min((uniqueCategories.size - 1) * 5, 10);
  if (diversityBonus > 0) {
    breakdown.push({ factor: 'Diversity', value: diversityBonus, description: `Awards across ${uniqueCategories.size} categories` });
  }

  const total = clamp(sumPoints + diversityBonus, 0, 100);
  return { category: 'awards', score: total, label: getScoreLabel(total), breakdown };
}
