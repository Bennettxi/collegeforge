import { Badge, BadgeContext, EarnedBadge } from '@/types/badges';

export const BADGES: Badge[] = [
  // Score badges
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Started building your college application profile',
    emoji: '🌱',
    category: 'score',
    isEarned: (ctx: BadgeContext) => ctx.overallScore > 0,
  },
  {
    id: 'getting-serious',
    name: 'Getting Serious',
    description: 'Reached an overall score of 30 or higher',
    emoji: '📈',
    category: 'score',
    isEarned: (ctx: BadgeContext) => ctx.overallScore >= 30,
  },
  {
    id: 'on-track',
    name: 'On Track',
    description: 'Reached an overall score of 50 or higher',
    emoji: '🚀',
    category: 'score',
    isEarned: (ctx: BadgeContext) => ctx.overallScore >= 50,
  },
  {
    id: 'college-ready',
    name: 'College Ready',
    description: 'Reached an overall score of 70 or higher',
    emoji: '🎓',
    category: 'score',
    isEarned: (ctx: BadgeContext) => ctx.overallScore >= 70,
  },
  {
    id: 'elite-applicant',
    name: 'Elite Applicant',
    description: 'Reached an overall score of 85 or higher',
    emoji: '⭐',
    category: 'score',
    isEarned: (ctx: BadgeContext) => ctx.overallScore >= 85,
  },

  // Profile badges
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Achieved an academics score of 80 or higher',
    emoji: '📚',
    category: 'profile',
    isEarned: (ctx: BadgeContext) => (ctx.categoryScores['academics'] ?? 0) >= 80,
  },
  {
    id: 'test-ace',
    name: 'Test Ace',
    description: 'Achieved a testing score of 85 or higher',
    emoji: '💯',
    category: 'profile',
    isEarned: (ctx: BadgeContext) => (ctx.categoryScores['testing'] ?? 0) >= 85,
  },
  {
    id: 'go-getter',
    name: 'Go-Getter',
    description: 'Achieved an activities score of 70 or higher',
    emoji: '🏆',
    category: 'profile',
    isEarned: (ctx: BadgeContext) => (ctx.categoryScores['activities'] ?? 0) >= 70,
  },
  {
    id: 'wordsmith',
    name: 'Wordsmith',
    description: 'Achieved an essays score of 80 or higher',
    emoji: '✏️',
    category: 'profile',
    isEarned: (ctx: BadgeContext) => (ctx.categoryScores['essays'] ?? 0) >= 80,
  },
  {
    id: 'well-rounded',
    name: 'Well-Rounded',
    description: 'Scored at least 40 in every category',
    emoji: '🎯',
    category: 'profile',
    isEarned: (ctx: BadgeContext) => {
      const categories = ['academics', 'testing', 'activities', 'essays', 'awards', 'recommendations'];
      return categories.every((cat) => (ctx.categoryScores[cat] ?? 0) >= 40);
    },
  },

  // Milestone badges
  {
    id: 'college-explorer',
    name: 'College Explorer',
    description: 'Added 3 or more colleges to your list',
    emoji: '🔍',
    category: 'milestone',
    isEarned: (ctx: BadgeContext) => ctx.collegeCount >= 3,
  },
  {
    id: 'award-winner',
    name: 'Award Winner',
    description: 'Earned 3 or more awards or honors',
    emoji: '🥇',
    category: 'milestone',
    isEarned: (ctx: BadgeContext) => ctx.awardCount >= 3,
  },
];

export function evaluateBadges(context: BadgeContext): EarnedBadge[] {
  return BADGES.map((badge) => ({
    badge,
    earned: badge.isEarned(context),
  }));
}
