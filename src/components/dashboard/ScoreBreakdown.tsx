'use client';

import { useScores } from '@/hooks/useScores';
import { CategoryScoreCard } from './CategoryScoreCard';

export function ScoreBreakdown() {
  const scores = useScores();
  if (!scores) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {scores.categoryScores.map(cs => (
          <CategoryScoreCard key={cs.category} categoryScore={cs} />
        ))}
      </div>
    </div>
  );
}
