import { StudentProfile } from '@/types/profile';
import { CollegeStats } from './data';
import { CollegeTier } from '@/types/college';

export type MatchLevel = 'strong_reach' | 'reach' | 'match' | 'likely' | 'safety';

export interface CollegeMatch {
  college: CollegeStats;
  matchLevel: MatchLevel;
  suggestedTier: CollegeTier;
  matchScore: number; // 0-100, higher = better fit
  factors: MatchFactor[];
}

export interface MatchFactor {
  label: string;
  status: 'above' | 'in_range' | 'below' | 'neutral';
  detail: string;
}

export const MATCH_CONFIG: Record<MatchLevel, { label: string; color: string; bgColor: string; description: string }> = {
  strong_reach: { label: 'Strong Reach', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', description: 'Very competitive — admission is unlikely but possible' },
  reach: { label: 'Reach', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800', description: 'Competitive — below average for admitted students' },
  match: { label: 'Match', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', description: 'Good fit — your stats align with admitted students' },
  likely: { label: 'Likely', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800', description: 'Strong chance — you exceed many requirements' },
  safety: { label: 'Safety', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800', description: 'Very likely — you exceed most requirements' },
};

function getStudentGPA(profile: StudentProfile): number | null {
  const { gpaUnweighted, gpaWeighted, gpaScale } = profile.academics;
  if (gpaUnweighted != null) {
    if (gpaScale === '100') return (gpaUnweighted / 100) * 4.0;
    if (gpaScale === '5.0') return (gpaUnweighted / 5.0) * 4.0;
    return gpaUnweighted;
  }
  if (gpaWeighted != null) {
    if (gpaScale === '5.0') return (gpaWeighted / 5.0) * 4.0;
    return Math.min(gpaWeighted, 4.0);
  }
  return null;
}

function getStudentSAT(profile: StudentProfile): number | null {
  if (profile.testing.testType === 'sat' || profile.testing.testType === 'both') {
    return profile.testing.satScore ?? null;
  }
  return null;
}

function getStudentACT(profile: StudentProfile): number | null {
  if (profile.testing.testType === 'act' || profile.testing.testType === 'both') {
    return profile.testing.actScore ?? null;
  }
  return null;
}

function scoreGPA(studentGPA: number | null, collegeGPA: number): { score: number; factor: MatchFactor } {
  if (studentGPA == null) {
    return {
      score: 50,
      factor: { label: 'GPA', status: 'neutral', detail: 'No GPA entered' },
    };
  }

  const diff = studentGPA - collegeGPA;
  let score: number;
  let status: MatchFactor['status'];
  let detail: string;

  if (diff >= 0.2) {
    score = 90;
    status = 'above';
    detail = `Your ${studentGPA.toFixed(2)} GPA is above the ${collegeGPA.toFixed(2)} average`;
  } else if (diff >= 0) {
    score = 75;
    status = 'in_range';
    detail = `Your ${studentGPA.toFixed(2)} GPA is at the ${collegeGPA.toFixed(2)} average`;
  } else if (diff >= -0.15) {
    score = 55;
    status = 'in_range';
    detail = `Your ${studentGPA.toFixed(2)} GPA is slightly below the ${collegeGPA.toFixed(2)} average`;
  } else if (diff >= -0.3) {
    score = 35;
    status = 'below';
    detail = `Your ${studentGPA.toFixed(2)} GPA is below the ${collegeGPA.toFixed(2)} average`;
  } else {
    score = 15;
    status = 'below';
    detail = `Your ${studentGPA.toFixed(2)} GPA is well below the ${collegeGPA.toFixed(2)} average`;
  }

  return { score, factor: { label: 'GPA', status, detail } };
}

function scoreSAT(studentSAT: number | null, collegeRange: [number, number]): { score: number; factor: MatchFactor } | null {
  if (studentSAT == null) return null;

  const [low, high] = collegeRange;
  const mid = (low + high) / 2;
  let score: number;
  let status: MatchFactor['status'];
  let detail: string;

  if (studentSAT >= high) {
    score = 95;
    status = 'above';
    detail = `Your SAT ${studentSAT} is above the 75th percentile (${high})`;
  } else if (studentSAT >= mid) {
    score = 75;
    status = 'in_range';
    detail = `Your SAT ${studentSAT} is within the middle range (${low}–${high})`;
  } else if (studentSAT >= low) {
    score = 50;
    status = 'in_range';
    detail = `Your SAT ${studentSAT} is at the 25th percentile (${low}–${high})`;
  } else if (studentSAT >= low - 60) {
    score = 30;
    status = 'below';
    detail = `Your SAT ${studentSAT} is below the range (${low}–${high})`;
  } else {
    score = 10;
    status = 'below';
    detail = `Your SAT ${studentSAT} is well below the range (${low}–${high})`;
  }

  return { score, factor: { label: 'SAT', status, detail } };
}

function scoreACT(studentACT: number | null, collegeRange: [number, number]): { score: number; factor: MatchFactor } | null {
  if (studentACT == null) return null;

  const [low, high] = collegeRange;
  const mid = (low + high) / 2;
  let score: number;
  let status: MatchFactor['status'];
  let detail: string;

  if (studentACT >= high) {
    score = 95;
    status = 'above';
    detail = `Your ACT ${studentACT} is above the 75th percentile (${high})`;
  } else if (studentACT >= mid) {
    score = 75;
    status = 'in_range';
    detail = `Your ACT ${studentACT} is within the middle range (${low}–${high})`;
  } else if (studentACT >= low) {
    score = 50;
    status = 'in_range';
    detail = `Your ACT ${studentACT} is at the 25th percentile (${low}–${high})`;
  } else if (studentACT >= low - 3) {
    score = 30;
    status = 'below';
    detail = `Your ACT ${studentACT} is below the range (${low}–${high})`;
  } else {
    score = 10;
    status = 'below';
    detail = `Your ACT ${studentACT} is well below the range (${low}–${high})`;
  }

  return { score, factor: { label: 'ACT', status, detail } };
}

function scoreExtracurriculars(profile: StudentProfile): { score: number; factor: MatchFactor } {
  const activityCount = profile.activities.activities.length;
  const hasLeadership = profile.activities.activities.some(a => a.hasLeadership);
  const awardCount = profile.awards.awards.length;
  const hasNationalAward = profile.awards.awards.some(a => a.level === 'national' || a.level === 'international');

  let score = 50; // baseline
  if (activityCount >= 5) score += 15;
  else if (activityCount >= 3) score += 8;
  if (hasLeadership) score += 10;
  if (awardCount >= 3) score += 10;
  else if (awardCount >= 1) score += 5;
  if (hasNationalAward) score += 10;

  score = Math.min(score, 100);

  let status: MatchFactor['status'] = 'neutral';
  let detail: string;
  if (score >= 80) {
    status = 'above';
    detail = `Strong extracurriculars: ${activityCount} activities, ${awardCount} awards`;
  } else if (score >= 60) {
    status = 'in_range';
    detail = `Good extracurriculars: ${activityCount} activities, ${awardCount} awards`;
  } else {
    status = 'below';
    detail = `Consider strengthening extracurriculars (${activityCount} activities)`;
  }

  return { score, factor: { label: 'Extracurriculars', status, detail } };
}

export function calculateMatch(profile: StudentProfile, college: CollegeStats): CollegeMatch {
  const gpaResult = scoreGPA(getStudentGPA(profile), college.avgGPA);
  const satResult = scoreSAT(getStudentSAT(profile), college.satRange);
  const actResult = scoreACT(getStudentACT(profile), college.actRange);
  const ecResult = scoreExtracurriculars(profile);

  const factors: MatchFactor[] = [gpaResult.factor];
  const scores: number[] = [gpaResult.score];
  const weights: number[] = [0.35];

  // Use best test score if both available
  if (satResult && actResult) {
    if (satResult.score >= actResult.score) {
      factors.push(satResult.factor);
      scores.push(satResult.score);
    } else {
      factors.push(actResult.factor);
      scores.push(actResult.score);
    }
    weights.push(0.35);
  } else if (satResult) {
    factors.push(satResult.factor);
    scores.push(satResult.score);
    weights.push(0.35);
  } else if (actResult) {
    factors.push(actResult.factor);
    scores.push(actResult.score);
    weights.push(0.35);
  } else {
    // Test optional or no scores — give neutral weight
    factors.push({ label: 'Test Scores', status: 'neutral', detail: 'No test scores entered' });
    scores.push(50);
    weights.push(0.15);
  }

  factors.push(ecResult.factor);
  scores.push(ecResult.score);
  weights.push(0.30);

  // Acceptance rate factor — lower acceptance = harder
  const acceptancePenalty = college.acceptanceRate < 10 ? -10 : college.acceptanceRate < 20 ? -5 : 0;

  // Weighted average
  const totalWeight = weights.reduce((s, w) => s + w, 0);
  const matchScore = Math.round(
    scores.reduce((s, score, i) => s + score * weights[i], 0) / totalWeight + acceptancePenalty
  );

  const clampedScore = Math.max(0, Math.min(100, matchScore));

  let matchLevel: MatchLevel;
  if (clampedScore >= 80) matchLevel = 'safety';
  else if (clampedScore >= 65) matchLevel = 'likely';
  else if (clampedScore >= 45) matchLevel = 'match';
  else if (clampedScore >= 25) matchLevel = 'reach';
  else matchLevel = 'strong_reach';

  const tierMap: Record<MatchLevel, CollegeTier> = {
    strong_reach: 'reach',
    reach: 'reach',
    match: 'match',
    likely: 'safety',
    safety: 'safety',
  };

  return {
    college,
    matchLevel,
    suggestedTier: tierMap[matchLevel],
    matchScore: clampedScore,
    factors,
  };
}

// Get matches for all colleges in the database, sorted by match score
export function getTopMatches(profile: StudentProfile, colleges: CollegeStats[]): CollegeMatch[] {
  return colleges
    .map(c => calculateMatch(profile, c))
    .sort((a, b) => b.matchScore - a.matchScore);
}
