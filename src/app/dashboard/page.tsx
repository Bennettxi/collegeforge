'use client';

import Link from 'next/link';
import { useProfile } from '@/context/ProfileContext';
import { AvatarDisplay } from '@/components/avatar/AvatarDisplay';
import { AvatarLevelUp } from '@/components/avatar/AvatarLevelUp';
import { ScoreBreakdown } from '@/components/dashboard/ScoreBreakdown';
import { RecommendationsList } from '@/components/dashboard/RecommendationsList';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { isLoaded } = useProfile();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400 text-lg">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      <AvatarLevelUp />

      {/* Hero section with avatar */}
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Application Strength</h1>
        <p className="text-gray-500 text-sm mb-6">Here&apos;s how your college application stacks up</p>
        <AvatarDisplay />
      </div>

      {/* Score Breakdown Grid */}
      <ScoreBreakdown />

      {/* Top Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Top Recommendations</h2>
          <Link href="/dashboard/recommendations">
            <Button variant="ghost" size="sm">View All →</Button>
          </Link>
        </div>
        <RecommendationsList limit={3} />
      </div>
    </div>
  );
}
