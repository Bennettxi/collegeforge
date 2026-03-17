'use client';

import { useRecommendations } from '@/hooks/useRecommendations';
import { RecommendationCard } from './RecommendationCard';

interface RecommendationsListProps {
  limit?: number;
}

export function RecommendationsList({ limit }: RecommendationsListProps) {
  const recommendations = useRecommendations();
  const displayed = limit ? recommendations.slice(0, limit) : recommendations;

  if (displayed.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-lg">Looking good!</p>
        <p className="text-sm mt-1">Complete your profile to get personalized recommendations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayed.map(rec => (
        <RecommendationCard key={rec.id} recommendation={rec} />
      ))}
    </div>
  );
}
