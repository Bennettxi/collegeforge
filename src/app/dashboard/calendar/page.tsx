'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useColleges } from '@/context/CollegeContext';
import { getUpcomingDeadlines, CollegeDeadline } from '@/lib/colleges/deadlines';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type FilterType = 'All' | 'ED' | 'EA' | 'RD' | 'Financial Aid';

const TYPE_COLORS: Record<CollegeDeadline['type'], { badge: string; dot: string }> = {
  ED: {
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    dot: 'bg-purple-500',
  },
  ED2: {
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    dot: 'bg-purple-500',
  },
  EA: {
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  REA: {
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  RD: {
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  'Financial Aid': {
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  'Housing Deposit': {
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    dot: 'bg-orange-500',
  },
};

const FILTER_TABS: FilterType[] = ['All', 'ED', 'EA', 'RD', 'Financial Aid'];

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatMonthYear(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatDay(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getDate();
}

function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7); // "YYYY-MM"
}

export default function CalendarPage() {
  const { colleges, isLoaded } = useColleges();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const allDeadlines = useMemo(() => {
    if (!isLoaded) return [];
    return getUpcomingDeadlines(colleges.map(c => c.name));
  }, [colleges, isLoaded]);

  const filteredDeadlines = useMemo(() => {
    if (activeFilter === 'All') return allDeadlines;
    return allDeadlines.filter(d => {
      if (activeFilter === 'ED') return d.type === 'ED' || d.type === 'ED2';
      if (activeFilter === 'EA') return d.type === 'EA' || d.type === 'REA';
      return d.type === activeFilter;
    });
  }, [allDeadlines, activeFilter]);

  // Group by month
  const grouped = useMemo(() => {
    const map = new Map<string, CollegeDeadline[]>();
    for (const d of filteredDeadlines) {
      const key = monthKey(d.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    }
    return map;
  }, [filteredDeadlines]);

  // Stats
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const upcomingDeadlines = allDeadlines.filter(d => daysUntil(d.date) >= 0);
  const nextDeadline = upcomingDeadlines[0] ?? null;
  const thisMonthCount = allDeadlines.filter(d => monthKey(d.date) === currentMonthKey).length;

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Empty state
  if (colleges.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-slide-up-fade">
        <Card className="text-center py-16">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            No Colleges Yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Add colleges to your list to see their application deadlines here.
          </p>
          <Link href="/dashboard/colleges">
            <Button variant="primary" size="md">
              Add Colleges
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-slide-up-fade">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <span>{'📅'}</span> Application Calendar
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Never miss an important deadline
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {upcomingDeadlines.length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Deadlines</p>
        </Card>

        <Card className="text-center py-4">
          {nextDeadline ? (
            <>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {daysUntil(nextDeadline.date) === 0
                  ? 'Today'
                  : `${daysUntil(nextDeadline.date)}d`}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate px-2">
                Next: {nextDeadline.collegeName}
              </p>
            </>
          ) : (
            <>
              <p className="text-3xl font-bold text-gray-400">--</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming</p>
            </>
          )}
        </Card>

        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {thisMonthCount}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTER_TABS.map(tab => (
          <Button
            key={tab}
            variant={activeFilter === tab ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Timeline */}
      {filteredDeadlines.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No deadlines match the current filter.
          </p>
        </Card>
      ) : (
        <div className="space-y-10">
          {Array.from(grouped.entries()).map(([month, deadlines]) => (
            <section key={month}>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 sticky top-0 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm py-2 z-10">
                {formatMonthYear(deadlines[0].date)}
              </h2>

              <div className="space-y-3">
                {deadlines.map((deadline, idx) => {
                  const days = daysUntil(deadline.date);
                  const isPast = days < 0;
                  const colors = TYPE_COLORS[deadline.type];

                  return (
                    <Card
                      key={`${deadline.collegeName}-${deadline.type}-${idx}`}
                      hover={!isPast}
                      className={cn(
                        'flex items-start gap-4 transition-opacity',
                        isPast && 'opacity-50'
                      )}
                    >
                      {/* Date circle */}
                      <div
                        className={cn(
                          'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2',
                          isPast
                            ? 'border-gray-300 text-gray-400 dark:border-gray-600 dark:text-gray-500'
                            : 'border-emerald-300 text-emerald-700 dark:border-emerald-600 dark:text-emerald-300'
                        )}
                      >
                        {formatDay(deadline.date)}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 dark:text-white truncate">
                            {deadline.collegeName}
                          </span>
                          <span
                            className={cn(
                              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                              colors.badge
                            )}
                          >
                            {deadline.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {deadline.description}
                        </p>
                      </div>

                      {/* Countdown */}
                      <div className="flex-shrink-0 text-right">
                        {isPast ? (
                          <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                            Passed
                          </span>
                        ) : days === 0 ? (
                          <span className="text-sm font-bold text-red-600 dark:text-red-400">
                            Today!
                          </span>
                        ) : (
                          <span
                            className={cn(
                              'text-sm font-medium',
                              days <= 7
                                ? 'text-red-600 dark:text-red-400'
                                : days <= 30
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-gray-500 dark:text-gray-400'
                            )}
                          >
                            in {days}d
                          </span>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
