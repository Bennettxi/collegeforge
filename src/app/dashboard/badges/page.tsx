'use client';

import Link from 'next/link';
import { useProfile } from '@/context/ProfileContext';
import { useBadges } from '@/hooks/useBadges';
import { BadgeCard } from '@/components/dashboard/BadgeCard';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function BadgesPage() {
  const { isLoaded } = useProfile();
  const { badges, earnedCount, totalCount } = useBadges();

  if (!isLoaded) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-48 skeleton-shimmer rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 skeleton-shimmer rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);
  const nextBadge = locked[0]; // first locked badge is the easiest to earn next
  const pct = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header with progress ring */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ScoreRing score={pct} size={64} strokeWidth={5} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Badges</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {earnedCount} of {totalCount} earned
            </p>
          </div>
        </div>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            &larr; Dashboard
          </Button>
        </Link>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-emerald-500 h-2.5 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Next badge to earn */}
      {nextBadge && (
        <Card className="!p-4 border-l-4 border-l-amber-400 dark:border-l-amber-500">
          <div className="flex items-center gap-4">
            <span className="text-3xl grayscale opacity-60">{nextBadge.badge.emoji}</span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-0.5">Next Badge</p>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{nextBadge.badge.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{nextBadge.badge.description}</p>
            </div>
            <Link href="/dashboard/settings" className="shrink-0">
              <Button variant="ghost" size="sm">Update Profile →</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Earned badges section */}
      {earned.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Earned
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {earned.map((eb, index) => (
              <div
                key={eb.badge.id}
                className="animate-stagger-in"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <BadgeCard badge={eb.badge} earned={eb.earned} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Locked badges section */}
      {locked.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Locked
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {locked.map((eb, index) => (
              <div
                key={eb.badge.id}
                className="animate-stagger-in"
                style={{ animationDelay: `${(earned.length + index) * 80}ms` }}
              >
                <BadgeCard badge={eb.badge} earned={eb.earned} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state when nothing earned */}
      {earnedCount === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="text-5xl mb-4">🌱</div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No badges earned yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
            Start filling out your profile to unlock achievements. Each badge represents a milestone in your college application journey.
          </p>
          <Link href="/dashboard/settings">
            <Button variant="primary" size="sm">
              Build Your Profile →
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
