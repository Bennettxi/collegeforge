'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/types/badges';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
  badge: Badge;
  earned: boolean;
}

export function BadgeCard({ badge, earned }: BadgeCardProps) {
  return (
    <Card
      hover
      className={cn(
        'relative flex flex-col items-center text-center p-5 transition-all duration-300',
        earned
          ? 'bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700'
          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 opacity-60'
      )}
      glow={earned ? '#10b981' : undefined}
    >
      {/* Emoji display */}
      <div
        className={cn(
          'text-4xl mb-3 transition-transform duration-300',
          earned ? 'scale-100 grayscale-0' : 'grayscale',
          earned && 'hover:scale-110'
        )}
      >
        {badge.emoji}
      </div>

      {/* Lock overlay for unearned badges */}
      {!earned && (
        <div className="absolute top-3 right-3 text-sm text-gray-400 dark:text-gray-600">
          {'\u{1F512}'}
        </div>
      )}

      {/* Earned checkmark */}
      {earned && (
        <div className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 bg-emerald-500 rounded-full">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Badge name */}
      <h3
        className={cn(
          'text-sm font-bold mb-1',
          earned ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
        )}
      >
        {badge.name}
      </h3>

      {/* Badge description */}
      <p
        className={cn(
          'text-xs leading-relaxed',
          earned ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300 dark:text-gray-600'
        )}
      >
        {badge.description}
      </p>

      {/* Category tag */}
      <span
        className={cn(
          'mt-3 inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full',
          earned
            ? badge.category === 'score'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : badge.category === 'profile'
                ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-500'
        )}
      >
        {badge.category}
      </span>
    </Card>
  );
}
