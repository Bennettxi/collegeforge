export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'score' | 'profile' | 'milestone';
  isEarned: (context: BadgeContext) => boolean;
}

export interface BadgeContext {
  overallScore: number;
  categoryScores: Record<string, number>;
  profileCompleteness: number; // 0-100 percentage
  collegeCount: number;
  activityCount: number;
  awardCount: number;
  essayStatus: string;
  hasRecommendations: boolean;
}

export interface EarnedBadge {
  badge: Badge;
  earned: boolean;
}
