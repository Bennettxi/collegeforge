import { RecommendationData } from '@/types/profile';
import { CategoryScore, ScoreDetail, getScoreLabel } from '@/types/scoring';
import { clamp } from '@/lib/utils';

export function scoreRecommendations(data: RecommendationData): CategoryScore {
  const breakdown: ScoreDetail[] = [];

  if (data.totalLetters === 0) {
    breakdown.push({ factor: 'Status', value: 5, description: 'No recommendation letters planned — most colleges require 2-3' });
    return { category: 'recommendations', score: 5, label: getScoreLabel(5), breakdown };
  }

  // Logistics (0-80)
  const countScore = data.totalLetters >= 2 ? 20 : 10;
  breakdown.push({ factor: 'Letter Count', value: countScore, description: `${data.totalLetters} letters planned` });

  const confirmedRatio = data.totalLetters > 0 ? data.confirmed / data.totalLetters : 0;
  const confirmedScore = Math.round(confirmedRatio * 30);
  breakdown.push({ factor: 'Confirmed', value: confirmedScore, description: `${data.confirmed}/${data.totalLetters} recommenders confirmed` });

  const submittedRatio = data.totalLetters > 0 ? data.submitted / data.totalLetters : 0;
  const submittedScore = Math.round(submittedRatio * 30);
  breakdown.push({ factor: 'Submitted', value: submittedScore, description: `${data.submitted}/${data.totalLetters} letters submitted` });

  // Type quality (0-20)
  let typeScore = 0;
  const types = data.recommenderTypes;
  const coreTeachers = types.filter(t => t === 'core_teacher').length;
  if (coreTeachers >= 2) typeScore = 15;
  else if (coreTeachers >= 1) typeScore = 10;
  if (types.includes('counselor')) typeScore += 5;
  typeScore = Math.min(typeScore, 20);

  if (typeScore > 0) {
    breakdown.push({ factor: 'Recommender Quality', value: typeScore, description: `${coreTeachers} core teacher(s)${types.includes('counselor') ? ' + counselor' : ''}` });
  }

  const total = clamp(countScore + confirmedScore + submittedScore + typeScore, 0, 100);
  return { category: 'recommendations', score: total, label: getScoreLabel(total), breakdown };
}
