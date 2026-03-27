'use client';

import { useStreaks } from '@/context/StreakContext';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const MILESTONES = [
  { days: 3, label: '3 Days', emoji: '🌱' },
  { days: 7, label: '7 Days', emoji: '🌿' },
  { days: 14, label: '14 Days', emoji: '🌳' },
  { days: 30, label: '30 Days', emoji: '⭐' },
  { days: 60, label: '60 Days', emoji: '💎' },
  { days: 100, label: '100 Days', emoji: '👑' },
];

export function StreakBanner() {
  const { streakData, isLoaded } = useStreaks();

  if (!isLoaded) return null;

  const { currentStreak, longestStreak, totalVisits } = streakData;

  const specialMessage =
    currentStreak >= 30
      ? 'Legendary! 🌟'
      : currentStreak >= 7
        ? 'On fire! 🔥'
        : null;

  return (
    <Card className={cn('animate-slide-up-fade overflow-hidden')}>
      <div className="flex flex-col gap-4">
        {/* Streak counter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 dark:from-emerald-500 dark:to-green-700 text-white text-2xl font-bold shadow-md">
            🔥
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 dark:from-emerald-400 dark:to-green-500 bg-clip-text text-transparent">
                {currentStreak}
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                day streak!
              </span>
              {specialMessage && (
                <span className="text-sm font-medium text-amber-500 dark:text-amber-400">
                  {specialMessage}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Longest: {longestStreak} days</span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span>Total visits: {totalVisits}</span>
            </div>
          </div>
        </div>

        {/* Milestone badges */}
        <div className="flex flex-wrap gap-2">
          {MILESTONES.map(milestone => {
            const achieved = longestStreak >= milestone.days;
            return (
              <div
                key={milestone.days}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
                  achieved
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500'
                )}
              >
                <span>{milestone.emoji}</span>
                <span>{milestone.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
