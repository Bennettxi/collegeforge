'use client';

import Link from 'next/link';
import { useProfile } from '@/context/ProfileContext';
import { useBadges } from '@/hooks/useBadges';
import { BadgeCard } from '@/components/dashboard/BadgeCard';
import { Button } from '@/components/ui/Button';

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

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Badges</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {earnedCount} of {totalCount} earned
          </p>
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
          style={{ width: `${totalCount > 0 ? (earnedCount / totalCount) * 100 : 0}%` }}
        />
      </div>

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
          <p className="text-4xl mb-4">{'\u{1F331}'}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Start filling out your profile to earn badges!
          </p>
          <Link href="/onboarding" className="inline-block mt-4">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
