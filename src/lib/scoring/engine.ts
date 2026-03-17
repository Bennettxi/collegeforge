import { StudentProfile } from '@/types/profile';
import { OverallScore, CategoryScore, CATEGORY_WEIGHTS, getScoreLabel } from '@/types/scoring';
import { getAvatarLevel } from '@/types/avatar';
import { scoreAcademics } from './academics';
import { scoreTesting } from './testing';
import { scoreActivities } from './activities';
import { scoreEssays } from './essays';
import { scoreAwards } from './awards';
import { scoreRecommendations } from './recommendations';

export function calculateScores(profile: StudentProfile): OverallScore {
  const categoryScores: CategoryScore[] = [
    scoreAcademics(profile.academics),
    scoreTesting(profile.testing),
    scoreActivities(profile.activities),
    scoreEssays(profile.essays),
    scoreAwards(profile.awards),
    scoreRecommendations(profile.recommendations),
  ];

  const total = Math.round(
    categoryScores.reduce(
      (sum, cs) => sum + cs.score * CATEGORY_WEIGHTS[cs.category],
      0
    )
  );

  const avatarLevel = getAvatarLevel(total);

  return {
    total,
    label: getScoreLabel(total),
    categoryScores,
    avatarLevel: avatarLevel.level,
  };
}
