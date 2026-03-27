'use client';

import { useState, useMemo, useCallback } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { useColleges } from '@/context/CollegeContext';
import { calculateMatch, MATCH_CONFIG, MatchLevel } from '@/lib/colleges/matcher';
import { COLLEGE_DATABASE } from '@/lib/colleges/data';
import { StudentProfile } from '@/types/profile';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface SliderConfig {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}

const SLIDERS: SliderConfig[] = [
  { key: 'gpa', label: 'GPA', min: 0, max: 4.0, step: 0.1, format: (v) => v.toFixed(1) },
  { key: 'sat', label: 'SAT Score', min: 400, max: 1600, step: 10, format: (v) => String(v) },
  { key: 'act', label: 'ACT Score', min: 1, max: 36, step: 1, format: (v) => String(v) },
  { key: 'activities', label: 'Number of Activities', min: 0, max: 15, step: 1, format: (v) => String(v) },
  { key: 'leadership', label: 'Number of Leadership Roles', min: 0, max: 10, step: 1, format: (v) => String(v) },
  { key: 'awards', label: 'Number of Awards', min: 0, max: 20, step: 1, format: (v) => String(v) },
];

interface SimValues {
  gpa: number;
  sat: number;
  act: number;
  activities: number;
  leadership: number;
  awards: number;
}

function getOriginalValues(profile: StudentProfile): SimValues {
  return {
    gpa: profile.academics.gpaUnweighted ?? profile.academics.gpaWeighted ?? 3.0,
    sat: profile.testing.satScore ?? 1000,
    act: profile.testing.actScore ?? 20,
    activities: profile.activities.activities.length,
    leadership: profile.activities.activities.filter((a) => a.hasLeadership).length,
    awards: profile.awards.awards.length,
  };
}

function buildSimulatedProfile(base: StudentProfile, sim: SimValues): StudentProfile {
  // Build simulated activities list
  const simulatedActivities = Array.from({ length: sim.activities }, (_, i) => {
    const existing = base.activities.activities[i];
    if (existing) {
      return {
        ...existing,
        hasLeadership: i < sim.leadership ? true : existing.hasLeadership,
      };
    }
    return {
      id: `sim-${i}`,
      name: `Activity ${i + 1}`,
      category: 'other' as const,
      role: i < sim.leadership ? 'Leader' : 'Member',
      yearsInvolved: 1,
      hoursPerWeek: 3,
      hasLeadership: i < sim.leadership,
      description: '',
    };
  });

  // Ensure leadership count is respected
  let leadershipAssigned = 0;
  const finalActivities = simulatedActivities.map((a) => {
    if (leadershipAssigned < sim.leadership) {
      leadershipAssigned++;
      return { ...a, hasLeadership: true };
    }
    return { ...a, hasLeadership: false };
  });

  // Build simulated awards list
  const simulatedAwards = Array.from({ length: sim.awards }, (_, i) => {
    const existing = base.awards.awards[i];
    if (existing) return existing;
    return {
      id: `sim-award-${i}`,
      name: `Award ${i + 1}`,
      level: 'school' as const,
      category: 'general',
    };
  });

  return {
    ...base,
    academics: {
      ...base.academics,
      gpaUnweighted: sim.gpa,
      gpaScale: '4.0',
    },
    testing: {
      ...base.testing,
      testType: 'both',
      satScore: sim.sat,
      actScore: sim.act,
    },
    activities: {
      activities: finalActivities,
    },
    awards: {
      awards: simulatedAwards,
    },
  };
}

function matchLevelRank(level: MatchLevel): number {
  const ranks: Record<MatchLevel, number> = {
    strong_reach: 0,
    reach: 1,
    match: 2,
    likely: 3,
    safety: 4,
  };
  return ranks[level];
}

function ChangeIndicator({ originalLevel, simLevel, originalScore, simScore }: {
  originalLevel: MatchLevel;
  simLevel: MatchLevel;
  originalScore: number;
  simScore: number;
}) {
  const origRank = matchLevelRank(originalLevel);
  const simRank = matchLevelRank(simLevel);
  const scoreDiff = simScore - originalScore;

  if (simRank > origRank || (simRank === origRank && scoreDiff > 0)) {
    return (
      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
        <span className="text-xs font-medium">+{scoreDiff}</span>
      </div>
    );
  }

  if (simRank < origRank || (simRank === origRank && scoreDiff < 0)) {
    return (
      <div className="flex items-center gap-1 text-red-500 dark:text-red-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        <span className="text-xs font-medium">{scoreDiff}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
      </svg>
      <span className="text-xs font-medium">0</span>
    </div>
  );
}

function MatchBadge({ level }: { level: MatchLevel }) {
  const config = MATCH_CONFIG[level];
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border transition-all duration-300',
      config.bgColor,
      config.color
    )}>
      {config.label}
    </span>
  );
}

export default function SimulatorPage() {
  const { profile, isLoaded: profileLoaded } = useProfile();
  const { colleges, isLoaded: collegesLoaded } = useColleges();

  const originalValues = useMemo(() => getOriginalValues(profile), [profile]);
  const [simValues, setSimValues] = useState<SimValues | null>(null);

  // Initialize sim values once profile loads
  const values = simValues ?? originalValues;

  const updateValue = useCallback((key: string, value: number) => {
    setSimValues((prev) => ({
      ...(prev ?? originalValues),
      [key]: value,
    }));
  }, [originalValues]);

  const resetSlider = useCallback((key: string) => {
    setSimValues((prev) => {
      if (!prev) return null;
      const updated = { ...prev, [key]: originalValues[key as keyof SimValues] };
      // If all values match original, return null
      const allMatch = (Object.keys(originalValues) as (keyof SimValues)[]).every(
        (k) => updated[k] === originalValues[k]
      );
      return allMatch ? null : updated;
    });
  }, [originalValues]);

  const resetAll = useCallback(() => {
    setSimValues(null);
  }, []);

  // Build simulated profile and calculate matches
  const simulatedProfile = useMemo(() => buildSimulatedProfile(profile, values), [profile, values]);

  const collegeResults = useMemo(() => {
    return colleges.map((college) => {
      const collegeStats = COLLEGE_DATABASE.find(
        (c) => c.name.toLowerCase() === college.name.toLowerCase()
      );
      if (!collegeStats) return null;

      const originalMatch = calculateMatch(profile, collegeStats);
      const simMatch = calculateMatch(simulatedProfile, collegeStats);

      return {
        college,
        collegeStats,
        originalLevel: originalMatch.matchLevel,
        originalScore: originalMatch.matchScore,
        simLevel: simMatch.matchLevel,
        simScore: simMatch.matchScore,
      };
    }).filter(Boolean) as {
      college: typeof colleges[0];
      collegeStats: typeof COLLEGE_DATABASE[0];
      originalLevel: MatchLevel;
      originalScore: number;
      simLevel: MatchLevel;
      simScore: number;
    }[];
  }, [colleges, profile, simulatedProfile]);

  const hasChanges = simValues !== null;

  if (!profileLoaded || !collegesLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            What If Simulator
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            See how improving your profile changes your college matches
          </p>
        </div>
        {hasChanges && (
          <Button variant="secondary" size="sm" onClick={resetAll}>
            Reset All
          </Button>
        )}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sliders Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Adjust Your Profile
            </h2>

            {SLIDERS.map((slider) => {
              const currentVal = values[slider.key as keyof SimValues];
              const originalVal = originalValues[slider.key as keyof SimValues];
              const isChanged = currentVal !== originalVal;

              return (
                <div key={slider.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {slider.label}
                    </label>
                    <div className="flex items-center gap-2">
                      {isChanged && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                          {slider.format(originalVal)}
                        </span>
                      )}
                      <span className={cn(
                        'text-sm font-semibold tabular-nums',
                        isChanged
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-gray-900 dark:text-white'
                      )}>
                        {slider.format(currentVal)}
                      </span>
                      {isChanged && (
                        <button
                          onClick={() => resetSlider(slider.key)}
                          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          aria-label={`Reset ${slider.label}`}
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={currentVal}
                    onChange={(e) => updateValue(slider.key, parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />

                  <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
                    <span>{slider.format(slider.min)}</span>
                    <span>{slider.format(slider.max)}</span>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Match Results
            </h2>

            {collegeResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🎓</div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  No colleges to simulate
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Add colleges to your list first, then come back to see how profile changes affect your matches.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {collegeResults.map(({ college, originalLevel, originalScore, simLevel, simScore }) => (
                  <div
                    key={college.id}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-xl border transition-all duration-300',
                      simLevel !== originalLevel
                        ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50'
                        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {college.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <MatchBadge level={originalLevel} />
                        {simLevel !== originalLevel && (
                          <>
                            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            <MatchBadge level={simLevel} />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-4 shrink-0">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {originalScore !== simScore && (
                            <span className="text-xs text-gray-400 dark:text-gray-500 line-through tabular-nums">
                              {originalScore}
                            </span>
                          )}
                          <span className={cn(
                            'text-sm font-bold tabular-nums transition-colors duration-300',
                            simScore > originalScore
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : simScore < originalScore
                                ? 'text-red-500 dark:text-red-400'
                                : 'text-gray-700 dark:text-gray-300'
                          )}>
                            {simScore}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">score</span>
                      </div>

                      <ChangeIndicator
                        originalLevel={originalLevel}
                        simLevel={simLevel}
                        originalScore={originalScore}
                        simScore={simScore}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Summary card when changes exist */}
          {hasChanges && collegeResults.length > 0 && (
            <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    Simulation Summary
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                    {(() => {
                      const improved = collegeResults.filter((r) => r.simScore > r.originalScore).length;
                      const declined = collegeResults.filter((r) => r.simScore < r.originalScore).length;
                      const unchanged = collegeResults.length - improved - declined;
                      const parts: string[] = [];
                      if (improved > 0) parts.push(`${improved} improved`);
                      if (unchanged > 0) parts.push(`${unchanged} unchanged`);
                      if (declined > 0) parts.push(`${declined} declined`);
                      return parts.join(', ');
                    })()}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
