'use client';

import { useMemo } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { useColleges } from '@/context/CollegeContext';
import { useScores } from '@/hooks/useScores';
import { evaluateBadges } from '@/lib/badges';
import { BadgeContext, EarnedBadge } from '@/types/badges';

interface UseBadgesResult {
  badges: EarnedBadge[];
  earnedCount: number;
  totalCount: number;
}

export function useBadges(): UseBadgesResult {
  const { profile } = useProfile();
  const { colleges } = useColleges();
  const scores = useScores();

  return useMemo(() => {
    // Build categoryScores record from the OverallScore data
    const categoryScores: Record<string, number> = {};
    if (scores) {
      for (const cs of scores.categoryScores) {
        categoryScores[cs.category] = cs.score;
      }
    }

    // Calculate profile completeness as a percentage (0-100)
    // Count how many of the 6 sections have been meaningfully filled in
    let filledSections = 0;

    // Academics: has a GPA entered
    if (profile.academics.gpaUnweighted !== null || profile.academics.gpaWeighted !== null) {
      filledSections++;
    }

    // Testing: has selected a test type other than 'not_yet'
    if (profile.testing.testType !== 'not_yet') {
      filledSections++;
    }

    // Activities: has at least one activity
    if (profile.activities.activities.length > 0) {
      filledSections++;
    }

    // Essays: has moved beyond 'not_started'
    if (profile.essays.personalStatementStatus !== 'not_started') {
      filledSections++;
    }

    // Awards: has at least one award
    if (profile.awards.awards.length > 0) {
      filledSections++;
    }

    // Recommendations: has at least one letter requested
    if (profile.recommendations.totalLetters > 0) {
      filledSections++;
    }

    const profileCompleteness = Math.round((filledSections / 6) * 100);

    // Build the full badge context
    const context: BadgeContext = {
      overallScore: scores?.total ?? 0,
      categoryScores,
      profileCompleteness,
      collegeCount: colleges.length,
      activityCount: profile.activities.activities.length,
      awardCount: profile.awards.awards.length,
      essayStatus: profile.essays.personalStatementStatus,
      hasRecommendations: profile.recommendations.totalLetters > 0,
    };

    const badges = evaluateBadges(context);
    const earnedCount = badges.filter((b) => b.earned).length;

    return {
      badges,
      earnedCount,
      totalCount: badges.length,
    };
  }, [profile, scores, colleges]);
}
