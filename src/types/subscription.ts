export type SubscriptionTier = 'sprout' | 'mighty_oak';

export interface SubscriptionData {
  tier: SubscriptionTier;
  activatedAt: string | null;
  // For future payment integration
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export type GatedFeature =
  | 'unlimited_colleges'      // Free: 3 colleges, Premium: unlimited
  | 'acceptance_probability'   // Premium only
  | 'what_if_simulator'       // Premium only
  | 'deadline_calendar'       // Premium only
  | 'all_badges'             // Free: first 5, Premium: all 15
  | 'unlimited_essays'       // Free: 1 analysis, Premium: unlimited
  | 'unlimited_documents'    // Free: 5 docs, Premium: unlimited
  | 'all_share_themes'       // Free: 1 theme, Premium: all 5
  | 'insights_cards'         // Premium only
  | 'recommendations'        // Premium only
  | 'cloud_sync';            // Premium only

export const TIER_INFO: Record<SubscriptionTier, {
  name: string;
  emoji: string;
  description: string;
  price: string;
  yearlyPrice: string;
}> = {
  sprout: {
    name: 'Sprout',
    emoji: '🌱',
    description: 'Everything you need to get started',
    price: 'Free',
    yearlyPrice: 'Free',
  },
  mighty_oak: {
    name: 'Mighty Oak',
    emoji: '🌳',
    description: 'The full toolkit for serious applicants',
    price: '$9.99/mo',
    yearlyPrice: '$59.99/yr',
  },
};

export const FEATURE_LIMITS: Record<SubscriptionTier, {
  maxColleges: number;
  maxDocuments: number;
  maxEssayAnalyses: number;
  maxShareThemes: number;
  maxBadges: number;
}> = {
  sprout: {
    maxColleges: 3,
    maxDocuments: 5,
    maxEssayAnalyses: 1,
    maxShareThemes: 1,
    maxBadges: 5,
  },
  mighty_oak: {
    maxColleges: Infinity,
    maxDocuments: Infinity,
    maxEssayAnalyses: Infinity,
    maxShareThemes: 5,
    maxBadges: 15,
  },
};
