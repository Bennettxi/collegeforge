import { Badge, BadgeContext, EarnedBadge } from '@/types/badges';

export const BADGES: Badge[] = [
  // Score badges
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Started building your college application profile',
    emoji: '\u{1F331}',
    category: 'score',
    isEarned: (ctx: BadgeContext) => ctx.overallScore > 0,
  },
  {
    id: 'getting-serious',
    name: 'Getting Serious',
    description: 'Reached an overall score of 30 or higher',
    emoji: '\u{1F4C8}',
    category: 'score',
    isEarned: (ctx: BadgeContext) => ctx.overallScore >= 30,
  },
  {
    id: 'on-track',
    name: 'On Track',
    description: 'Reached an overall score of 50 or higher',
    emoji: '\u{1F680}',
    category: 'score',
    isEarned: (ctx: BadgeContext) => ctx.overallScore >= 50,
  },
  {
    id: 'college-ready',
    name: 'College Ready',
    description: 'Reached an overall score of 70 or higher',
    emoji: '\u{1F393}',
    category: 'score',
    isEarned: (ctx: BadgeContext) => ctx.overallScore >= 70,
  },
  {
    id: 'elite-applicant',
    name: 'Elite Applicant',
    description: 'Reached an overall score of 85 or higher',
    emoji: '\u{2B50}',
    category: 'score',
    isEarned: (ctx: BadgeContext) => ctx.overallScore >= 85,
  },

  // Profile badges
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Achieved an academics score of 80 or higher',
    emoji: '\u{1F4DA}',
    category: 'profile',
    isEarned: (ctx: BadgeContext) => (ctx.categoryScores['academics'] ?? 0) >= 80,
  },
  {
    id: 'test-ace',
    name: 'Test Ace',
    description: 'Achieved a testing score of 85 or higher',
    emoji: '\u{1F4AF}',
    category: 'profile',
    isEarned: (ctx: BadgeContext) => (ctx.categoryScores['testing'] ?? 0) >= 85,
  },
  {
    id: 'go-getter',
    name: 'Go-Getter',
    description: 'Achieved an activities score of 70 or higher',
    emoji: '\u{1F3C6}',
    category: 'profile',
    isEarned: (ctx: BadgeContext) => (ctx.categoryScores['activities'] ?? 0) >= 70,
  },
  {
    id: 'wordsmith',
    name: 'Wordsmith',
    description: 'Achieved an essays score of 80 or higher',
    emoji: '\u{270D}\u{FE0F}',
    category: 'profile',
    isEarned: (ctx: BadgeContext) => (ctx.categoryScores['essays'] ?? 0) >= 80,
  },
  {
    id: 'well-rounded',
    name: 'Well-Rounded',
    description: 'Scored at least 40 in every category',
    emoji: '\u{1F3AF}',
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
    emoji: '\u{1F50D}',
    category: 'milestone',
    isEarned: (ctx: BadgeContext) => ctx.collegeCount >= 3,
  },
  {
    id: 'award-winner',
    name: 'Award Winner',
    description: 'Earned 3 or more awards or honors',
    emoji: '\u{1F947}',
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
