'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useColleges } from '@/context/CollegeContext';
import { useProfile } from '@/context/ProfileContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { UpgradePrompt } from '@/components/ui/UpgradePrompt';
import { CollegeCard } from '@/components/dashboard/CollegeCard';
import { MatchBadge } from '@/components/dashboard/MatchBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { CollegeTier, ApplicationStatus, TIER_CONFIG } from '@/types/college';
import { searchColleges, CollegeStats } from '@/lib/colleges/data';
import { calculateMatch } from '@/lib/colleges/matcher';
import { getDeadlinesForCollege } from '@/lib/colleges/deadlines';

const TIER_OPTIONS = [
  { value: 'reach', label: 'Reach' },
  { value: 'match', label: 'Match' },
  { value: 'safety', label: 'Safety' },
];

const TIER_ORDER: CollegeTier[] = ['reach', 'match', 'safety'];

export default function CollegesPage() {
  const { colleges, addCollege, updateCollege, removeCollege, isLoaded } = useColleges();
  const { profile, isLoaded: profileLoaded } = useProfile();
  const { isPremium, getLimit } = useSubscription();
  const maxColleges = getLimit('maxColleges');
  const atCollegeLimit = !isPremium && colleges.length >= maxColleges;
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formTier, setFormTier] = useState<CollegeTier>('match');
  const [formDeadline, setFormDeadline] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [searchResults, setSearchResults] = useState<CollegeStats[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<CollegeStats | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search as user types
  useEffect(() => {
    const results = searchColleges(formName);
    setSearchResults(results);
    setShowDropdown(results.length > 0 && formName.length >= 2);
  }, [formName]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Group colleges by tier
  const grouped = useMemo(() => {
    const groups: Record<CollegeTier, typeof colleges> = {
      reach: [],
      match: [],
      safety: [],
    };
    for (const college of colleges) {
      if (groups[college.tier]) {
        groups[college.tier].push(college);
      }
    }
    for (const tier of TIER_ORDER) {
      groups[tier].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    }
    return groups;
  }, [colleges]);

  function selectFromSearch(college: CollegeStats) {
    setFormName(college.name);
    setSelectedMatch(college);
    setShowDropdown(false);

    // Auto-set tier based on match algorithm
    if (profileLoaded) {
      const match = calculateMatch(profile, college);
      setFormTier(match.suggestedTier);
    }

    // Auto-fill deadline from deadlines database (use RD deadline as default)
    const deadlines = getDeadlinesForCollege(college.name);
    const rdDeadline = deadlines.find(d => d.type === 'RD');
    const firstDeadline = deadlines[0];
    if (rdDeadline) {
      setFormDeadline(rdDeadline.date);
    } else if (firstDeadline) {
      setFormDeadline(firstDeadline.date);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = formName.trim();
    if (!trimmedName) return;

    addCollege({
      name: trimmedName,
      tier: formTier,
      deadline: formDeadline || undefined,
      applicationStatus: 'researching',
      notes: formNotes.trim(),
    });

    setFormName('');
    setFormTier('match');
    setFormDeadline('');
    setFormNotes('');
    setSelectedMatch(null);
    setShowForm(false);
  }

  function handleCancel() {
    setFormName('');
    setFormTier('match');
    setFormDeadline('');
    setFormNotes('');
    setSelectedMatch(null);
    setShowForm(false);
  }

  if (!isLoaded) {
    return (
      <div className="pb-20 md:pb-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-64" />
          <div className="space-y-3 mt-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My College List
            {colleges.length > 0 && (
              <span className="ml-2 text-base font-normal text-gray-400 dark:text-gray-500">
                ({colleges.length})
              </span>
            )}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Organize your target schools by tier and track your application progress.
          </p>
        </div>
        {!showForm && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(true)}
            disabled={atCollegeLimit}
          >
            + Add College
          </Button>
        )}
      </div>

      {/* Free plan college limit banner */}
      {!isPremium && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm">
          <span className="text-amber-700 dark:text-amber-300">
            Free plan: {colleges.length} of {maxColleges} colleges used
          </span>
          {atCollegeLimit && (
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Upgrade for unlimited
            </span>
          )}
        </div>
      )}

      {/* Stats Summary */}
      {colleges.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {TIER_ORDER.map(tier => {
            const count = grouped[tier].length;
            const config = TIER_CONFIG[tier];
            return (
              <div
                key={tier}
                className={cn(
                  'rounded-xl border p-3 text-center transition-colors',
                  config.bgColor
                )}
              >
                <p className={cn('text-2xl font-bold', config.color)}>{count}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                  <span>{config.emoji}</span>
                  {config.label}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Inline Add Form */}
      {showForm && atCollegeLimit && (
        <div className="mb-8 animate-slide-down-fade">
          <UpgradePrompt
            feature="Unlimited Colleges"
            description={`You've reached the free plan limit of ${maxColleges} colleges. Upgrade to add more.`}
          />
        </div>
      )}
      {showForm && !atCollegeLimit && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-8 shadow-sm animate-slide-down-fade"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add a College</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* College name with search dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Input
                label="College Name"
                type="text"
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                  setSelectedMatch(null);
                }}
                placeholder="Search colleges (e.g. MIT, Stanford)..."
                autoFocus
                autoComplete="off"
              />
              {showDropdown && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg max-h-64 overflow-y-auto">
                  {searchResults.map((college, i) => {
                    const match = profileLoaded ? calculateMatch(profile, college) : null;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectFromSearch(college)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between gap-2 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{college.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {college.acceptanceRate}% acceptance rate
                          </p>
                        </div>
                        {match && (
                          <div className="shrink-0">
                            <MatchBadge match={match} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <Select
              label="Tier"
              options={TIER_OPTIONS}
              value={formTier}
              onChange={(e) => setFormTier(e.target.value as CollegeTier)}
            />
            <Input
              label="Application Deadline"
              type="date"
              value={formDeadline}
              onChange={(e) => setFormDeadline(e.target.value)}
            />
            <Input
              label="Notes"
              type="text"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Optional notes..."
            />
          </div>

          {/* Selected college match preview */}
          {selectedMatch && profileLoaded && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <MatchBadge match={calculateMatch(profile, selectedMatch)} showDetails />
            </div>
          )}

          <div className="flex items-center gap-3 mt-5">
            <Button type="submit" variant="primary" size="sm" disabled={!formName.trim()}>
              Add to List
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Empty State */}
      {colleges.length === 0 && !showForm && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🏫</div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No colleges yet — start building your list!
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 max-w-md mx-auto">
            Add your target schools, organize them by tier, and track your application
            status all in one place. We&apos;ll show you how well you match each school.
          </p>
          <Button variant="primary" size="md" onClick={() => setShowForm(true)}>
            + Add Your First College
          </Button>
        </div>
      )}

      {/* Grouped College List */}
      {colleges.length > 0 && (
        <div className="space-y-8">
          {TIER_ORDER.map(tier => {
            const tierColleges = grouped[tier];
            if (tierColleges.length === 0) return null;

            const config = TIER_CONFIG[tier];
            return (
              <section key={tier}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{config.emoji}</span>
                  <h2 className={cn('text-lg font-semibold', config.color)}>
                    {config.label}
                  </h2>
                  <span className="text-sm text-gray-400 dark:text-gray-500">
                    ({tierColleges.length})
                  </span>
                </div>
                <div className="space-y-3">
                  {tierColleges.map(college => (
                    <CollegeCard
                      key={college.id}
                      college={college}
                      onUpdateStatus={(status: ApplicationStatus) =>
                        updateCollege(college.id, { applicationStatus: status })
                      }
                      onDelete={() => removeCollege(college.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
