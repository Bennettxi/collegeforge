'use client';

import { useState, useMemo } from 'react';
import { useColleges } from '@/context/CollegeContext';
import { CollegeCard } from '@/components/dashboard/CollegeCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { CollegeTier, ApplicationStatus, TIER_CONFIG } from '@/types/college';

const TIER_OPTIONS = [
  { value: 'reach', label: 'Reach' },
  { value: 'match', label: 'Match' },
  { value: 'safety', label: 'Safety' },
];

const TIER_ORDER: CollegeTier[] = ['reach', 'match', 'safety'];

export default function CollegesPage() {
  const { colleges, addCollege, updateCollege, removeCollege, isLoaded } = useColleges();
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formTier, setFormTier] = useState<CollegeTier>('match');
  const [formDeadline, setFormDeadline] = useState('');
  const [formNotes, setFormNotes] = useState('');

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
    // Sort each group by addedAt descending (newest first)
    for (const tier of TIER_ORDER) {
      groups[tier].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    }
    return groups;
  }, [colleges]);

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

    // Reset form
    setFormName('');
    setFormTier('match');
    setFormDeadline('');
    setFormNotes('');
    setShowForm(false);
  }

  function handleCancel() {
    setFormName('');
    setFormTier('match');
    setFormDeadline('');
    setFormNotes('');
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
          >
            + Add College
          </Button>
        )}
      </div>

      {/* Inline Add Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-8 shadow-sm animate-slide-down-fade"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add a College</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="College Name"
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. MIT, Stanford, UCLA..."
              autoFocus
            />
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
            status all in one place.
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
