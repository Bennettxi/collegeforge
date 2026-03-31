'use client';

import Link from 'next/link';
import { useProfile } from '@/context/ProfileContext';
import { useColleges } from '@/context/CollegeContext';
import { useScores } from '@/hooks/useScores';
import { AvatarDisplay } from '@/components/avatar/AvatarDisplay';
import { AvatarLevelUp } from '@/components/avatar/AvatarLevelUp';
import { ScoreBreakdown } from '@/components/dashboard/ScoreBreakdown';
import { RecommendationsList } from '@/components/dashboard/RecommendationsList';
import { InsightsCards } from '@/components/dashboard/InsightsCards';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { StreakBanner } from '@/components/dashboard/StreakBanner';
import { cn } from '@/lib/utils';

const QUICK_ACTION_STYLES = [
  { border: 'border-l-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { border: 'border-l-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
  { border: 'border-l-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { border: 'border-l-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { border: 'border-l-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { border: 'border-l-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
  { border: 'border-l-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { border: 'border-l-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
];

const QUICK_ACTIONS = [
  { label: 'Edit Profile', href: '/dashboard/settings', icon: '✏️' },
  { label: 'Add College', href: '/dashboard/colleges', icon: '🏛️' },
  { label: 'What If?', href: '/dashboard/simulator', icon: '🔮' },
  { label: 'Calendar', href: '/dashboard/calendar', icon: '📅' },
  { label: 'Documents', href: '/dashboard/documents', icon: '📁' },
  { label: 'Essay Coach', href: '/dashboard/essays', icon: '📝' },
  { label: 'Share Card', href: '/dashboard/share', icon: '🎴' },
  { label: 'See Badges', href: '/dashboard/badges', icon: '🏅' },
];

export default function DashboardPage() {
  const { isLoaded } = useProfile();
  const { colleges } = useColleges();
  const scores = useScores();

  if (!isLoaded) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      <AvatarLevelUp />

      {/* Hero section with avatar */}
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Your Application <span className="text-brand">Strength</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Here&apos;s how your college application stacks up</p>
        <AvatarDisplay />
      </div>

      {/* Streak Banner */}
      <StreakBanner />

      {/* Quick Actions */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
        {QUICK_ACTIONS.map((action, i) => (
          <Link key={action.href} href={action.href} className="group">
            <Card
              hover
              className={cn(
                '!p-3 md:!p-4 flex flex-col items-center gap-1.5 text-center cursor-pointer border-l-2',
                QUICK_ACTION_STYLES[i].border
              )}
            >
              <span className={cn(
                'text-xl md:text-2xl transition-transform group-hover:scale-105 rounded-lg p-1',
                QUICK_ACTION_STYLES[i].bg
              )}>
                {action.icon}
              </span>
              <span className="text-[11px] md:text-xs font-medium text-gray-600 dark:text-gray-400">{action.label}</span>
            </Card>
          </Link>
        ))}
      </div>

      {/* Insights */}
      <InsightsCards />

      {/* Score Breakdown Grid */}
      <ScoreBreakdown />

      {/* Top Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Recommendations</h2>
          <Link href="/dashboard/recommendations">
            <Button variant="ghost" size="sm">View All →</Button>
          </Link>
        </div>
        <RecommendationsList limit={3} />
      </div>
    </div>
  );
}
