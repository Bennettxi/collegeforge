import { ActivityData, Activity } from '@/types/profile';
import { CategoryScore, ScoreDetail, getScoreLabel } from '@/types/scoring';
import { clamp } from '@/lib/utils';

function scoreActivity(a: Activity): number {
  const depth = Math.min(a.yearsInvolved * 5, 20);
  const commitment = Math.min(a.hoursPerWeek * 2, 15);
  const leadership = a.hasLeadership ? 10 : 0;
  const categoryBonus = (a.category === 'research' || a.category === 'entrepreneurship') ? 5
    : (a.category === 'community_service' || a.category === 'work_experience') ? 3 : 0;
  return depth + commitment + leadership + categoryBonus;
}

export function scoreActivities(data: ActivityData): CategoryScore {
  const breakdown: ScoreDetail[] = [];
  const activities = data.activities;

  if (activities.length === 0) {
    breakdown.push({ factor: 'Activities', value: 0, description: 'No activities added yet' });
    return { category: 'activities', score: 0, label: getScoreLabel(0), breakdown };
  }

  // Score each activity, take top 5
  const strengths = activities.map(a => ({ name: a.name, strength: scoreActivity(a) }));
  strengths.sort((a, b) => b.strength - a.strength);
  const top5 = strengths.slice(0, 5);
  const sumTop5 = top5.reduce((s, a) => s + a.strength, 0);

  breakdown.push({ factor: 'Top Activities', value: Math.round(sumTop5 / 2.75), description: `${top5.map(a => a.name).join(', ')}` });

  // Diversity bonus
  const uniqueCategories = new Set(activities.map(a => a.category));
  const diversityBonus = Math.min((uniqueCategories.size - 1) * 5, 15);
  if (diversityBonus > 0) {
    breakdown.push({ factor: 'Diversity', value: diversityBonus, description: `${uniqueCategories.size} different activity types` });
  }

  // Quantity bonus
  let quantityBonus = 0;
  if (activities.length >= 7) quantityBonus = 12;
  else if (activities.length >= 5) quantityBonus = 10;
  else if (activities.length >= 3) quantityBonus = 5;
  breakdown.push({ factor: 'Breadth', value: quantityBonus, description: `${activities.length} total activities` });

  // Leadership count
  const leadershipCount = activities.filter(a => a.hasLeadership).length;
  if (leadershipCount > 0) {
    breakdown.push({ factor: 'Leadership', value: Math.min(leadershipCount * 3, 10), description: `Leadership in ${leadershipCount} activities` });
  }

  const maxPossible = 275;
  const rawScore = sumTop5 + diversityBonus + quantityBonus;
  const total = clamp(Math.round((rawScore / maxPossible) * 100), 0, 100);

  return { category: 'activities', score: total, label: getScoreLabel(total), breakdown };
}
