'use client';

import { Card } from '@/components/ui/Card';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { CategoryScore, CATEGORY_LABELS } from '@/types/scoring';

const CATEGORY_ICONS: Record<string, string> = {
  academics: '📚',
  testing: '📝',
  activities: '🏆',
  essays: '✍️',
  awards: '🏅',
  recommendations: '📬',
};

interface CategoryScoreCardProps {
  categoryScore: CategoryScore;
}

export function CategoryScoreCard({ categoryScore }: CategoryScoreCardProps) {
  const { category, score, label, breakdown } = categoryScore;
  const icon = CATEGORY_ICONS[category] || '📋';
  const displayLabel = CATEGORY_LABELS[category];

  return (
    <Card hover className="flex flex-col items-center text-center p-5">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{displayLabel}</h3>
      <ScoreRing score={score} size={72} strokeWidth={5} />
      <p className="text-xs font-medium text-gray-500 mt-2">{label}</p>
      {breakdown.length > 0 && (
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
          {breakdown[0].description}
        </p>
      )}
    </Card>
  );
}
