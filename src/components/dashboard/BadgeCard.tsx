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
          ? 'bg-white border-emerald-200'
          : 'bg-gray-50 border-gray-100 opacity-60'
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
        <div className="absolute top-3 right-3 text-sm text-gray-400">
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
          earned ? 'text-gray-900' : 'text-gray-400'
        )}
      >
        {badge.name}
      </h3>

      {/* Badge description */}
      <p
        className={cn(
          'text-xs leading-relaxed',
          earned ? 'text-gray-500' : 'text-gray-300'
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
              ? 'bg-blue-50 text-blue-600'
              : badge.category === 'profile'
                ? 'bg-purple-50 text-purple-600'
                : 'bg-amber-50 text-amber-600'
            : 'bg-gray-100 text-gray-300'
        )}
      >
        {badge.category}
      </span>
    </Card>
  );
}
