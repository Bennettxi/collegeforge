export type CategoryName =
  | 'academics'
  | 'testing'
  | 'activities'
  | 'essays'
  | 'awards'
  | 'recommendations';

export interface CategoryScore {
  category: CategoryName;
  score: number;
  label: ScoreLabel;
  breakdown: ScoreDetail[];
}

export type ScoreLabel =
  | 'Needs Work'
  | 'Developing'
  | 'Solid'
  | 'Strong'
  | 'Outstanding';

export interface ScoreDetail {
  factor: string;
  value: number;
  description: string;
}

export interface OverallScore {
  total: number;
  label: ScoreLabel;
  categoryScores: CategoryScore[];
  avatarLevel: number;
}

export function getScoreLabel(score: number): ScoreLabel {
  if (score >= 85) return 'Outstanding';
  if (score >= 70) return 'Strong';
  if (score >= 50) return 'Solid';
  if (score >= 30) return 'Developing';
  return 'Needs Work';
}

export const CATEGORY_WEIGHTS: Record<CategoryName, number> = {
  academics: 0.30,
  testing: 0.15,
  activities: 0.20,
  essays: 0.20,
  awards: 0.10,
  recommendations: 0.05,
};

export const CATEGORY_LABELS: Record<CategoryName, string> = {
  academics: 'Academics',
  testing: 'Test Scores',
  activities: 'Activities',
  essays: 'Essays',
  awards: 'Awards',
  recommendations: 'Recommendations',
};
