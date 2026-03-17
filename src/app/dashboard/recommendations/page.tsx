'use client';

import { RecommendationsList } from '@/components/dashboard/RecommendationsList';

export default function RecommendationsPage() {
  return (
    <div className="pb-20 md:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Action Plan</h1>
        <p className="text-gray-500 text-sm mt-1">
          Personalized recommendations sorted by impact. Focus on the high-priority items first.
        </p>
      </div>
      <RecommendationsList />
    </div>
  );
}
