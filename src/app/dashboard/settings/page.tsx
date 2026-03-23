'use client';

import { useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { useScores } from '@/hooks/useScores';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/lib/utils';
import {
  CourseRigor,
  EssayStatus,
  Activity,
  ActivityCategory,
  Award,
  AwardLevel,
  RecommenderType,
} from '@/types/profile';
import { CATEGORY_LABELS } from '@/types/scoring';

type SectionKey = 'academics' | 'testing' | 'activities' | 'essays' | 'awards' | 'recommendations' | 'account';

const RIGOR_OPTIONS = [
  { value: 'standard', label: 'Mostly Standard/Regular' },
  { value: 'some_honors', label: 'Some Honors Courses' },
  { value: 'mostly_honors', label: 'Mostly Honors Courses' },
  { value: 'mostly_ap', label: 'Mostly AP/IB Courses' },
  { value: 'all_ap_ib', label: 'All AP/IB Courses' },
];

const GPA_SCALE_OPTIONS = [
  { value: '4.0', label: '4.0 Scale' },
  { value: '5.0', label: '5.0 Scale' },
  { value: '100', label: '100 Scale' },
];

const TEST_TYPE_OPTIONS = [
  { value: 'not_yet', label: "Haven't taken a test yet" },
  { value: 'sat', label: 'SAT' },
  { value: 'act', label: 'ACT' },
  { value: 'both', label: 'Both SAT & ACT' },
  { value: 'test_optional', label: 'Going Test-Optional' },
];

const ESSAY_STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'brainstorming', label: 'Brainstorming Topics' },
  { value: 'first_draft', label: 'First Draft Done' },
  { value: 'revising', label: 'Revising' },
  { value: 'polished', label: 'Polished / Nearly Done' },
  { value: 'final', label: 'Final Version Complete' },
];

const CATEGORY_OPTIONS = [
  { value: 'academic', label: 'Academic' },
  { value: 'arts', label: 'Arts' },
  { value: 'athletics', label: 'Athletics' },
  { value: 'community_service', label: 'Community Service' },
  { value: 'work_experience', label: 'Work Experience' },
  { value: 'entrepreneurship', label: 'Entrepreneurship' },
  { value: 'research', label: 'Research' },
  { value: 'other', label: 'Other' },
];

const AWARD_LEVEL_OPTIONS = [
  { value: 'school', label: 'School' },
  { value: 'regional', label: 'Regional' },
  { value: 'state', label: 'State' },
  { value: 'national', label: 'National' },
  { value: 'international', label: 'International' },
];

const RECOMMENDER_OPTIONS: { value: RecommenderType; label: string }[] = [
  { value: 'core_teacher', label: 'Core Subject Teacher' },
  { value: 'elective_teacher', label: 'Elective Teacher' },
  { value: 'counselor', label: 'School Counselor' },
  { value: 'coach', label: 'Coach' },
  { value: 'employer', label: 'Employer / Supervisor' },
  { value: 'mentor', label: 'Mentor' },
  { value: 'other', label: 'Other' },
];

const FEEDBACK_OPTIONS = [
  { value: 'teacher', label: 'Teacher' },
  { value: 'counselor', label: 'School Counselor' },
  { value: 'tutor', label: 'Private Tutor / Consultant' },
  { value: 'peer', label: 'Peer / Friend' },
  { value: 'none', label: 'Other' },
];

function SectionHeader({
  title,
  icon,
  isOpen,
  onToggle,
  score,
}: {
  title: string;
  icon: string;
  isOpen: boolean;
  onToggle: () => void;
  score?: number;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
        {score != null && (
          <div className="flex items-center gap-2">
            <div className="w-16">
              <ProgressBar value={score} />
            </div>
            <span className="text-xs text-gray-400">{score}/100</span>
          </div>
        )}
      </div>
      <svg
        className={cn('w-5 h-5 text-gray-400 transition-transform duration-200', isOpen && 'rotate-180')}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </button>
  );
}

export default function SettingsPage() {
  const { profile, updateSection, resetProfile, isLoaded } = useProfile();
  const { user, isGuest } = useAuth();
  const scores = useScores();
  const [openSection, setOpenSection] = useState<SectionKey | null>(null);

  // Academics state
  const [gpa, setGpa] = useState(profile.academics.gpaUnweighted?.toString() ?? '');
  const [gpaScale, setGpaScale] = useState(profile.academics.gpaScale);
  const [rigor, setRigor] = useState<CourseRigor>(profile.academics.courseRigor);
  const [apCount, setApCount] = useState(profile.academics.apCourseCount.toString());
  const [honorsCount, setHonorsCount] = useState(profile.academics.honorsCount.toString());

  // Testing state
  const [testType, setTestType] = useState(profile.testing.testType);
  const [satScore, setSatScore] = useState(profile.testing.satScore?.toString() ?? '');
  const [actScore, setActScore] = useState(profile.testing.actScore?.toString() ?? '');

  // Activities state
  const [activities, setActivities] = useState<Activity[]>(profile.activities.activities);

  // Essays state
  const [essayStatus, setEssayStatus] = useState<EssayStatus>(profile.essays.personalStatementStatus);
  const [drafts, setDrafts] = useState(profile.essays.personalStatementDrafts.toString());
  const [suppCount, setSuppCount] = useState(profile.essays.supplementalEssayCount.toString());
  const [suppDone, setSuppDone] = useState(profile.essays.supplementalCompleted.toString());
  const [hasFeedback, setHasFeedback] = useState(profile.essays.hasReceivedFeedback);
  const [feedbackSource, setFeedbackSource] = useState<'teacher' | 'counselor' | 'tutor' | 'peer' | 'none'>(profile.essays.feedbackSource ?? 'none');

  // Awards state
  const [awards, setAwards] = useState<Award[]>(profile.awards.awards);

  // Recommendations state
  const [totalLetters, setTotalLetters] = useState(profile.recommendations.totalLetters.toString());
  const [confirmed, setConfirmed] = useState(profile.recommendations.confirmed.toString());
  const [submitted, setSubmitted] = useState(profile.recommendations.submitted.toString());
  const [recommenderTypes, setRecommenderTypes] = useState<RecommenderType[]>(profile.recommendations.recommenderTypes);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  function toggleSection(key: SectionKey) {
    if (openSection === key) {
      // Save and close
      saveSection(key);
      setOpenSection(null);
    } else {
      // Save current section if open, then open new one
      if (openSection) saveSection(openSection);
      setOpenSection(key);
    }
  }

  function saveSection(key: SectionKey) {
    switch (key) {
      case 'academics':
        updateSection('academics', {
          gpaUnweighted: gpa ? parseFloat(gpa) : null,
          gpaWeighted: null,
          gpaScale,
          courseRigor: rigor,
          apCourseCount: parseInt(apCount) || 0,
          honorsCount: parseInt(honorsCount) || 0,
        });
        break;
      case 'testing':
        updateSection('testing', {
          testType,
          satScore: satScore ? parseInt(satScore) : null,
          actScore: actScore ? parseInt(actScore) : null,
          apScores: profile.testing.apScores || [],
        });
        break;
      case 'activities':
        updateSection('activities', { activities: activities.filter(a => a.name.trim() !== '') });
        break;
      case 'essays': {
        const planned = parseInt(suppCount) || 0;
        const completed = Math.min(parseInt(suppDone) || 0, planned);
        updateSection('essays', {
          personalStatementStatus: essayStatus,
          personalStatementDrafts: parseInt(drafts) || 0,
          supplementalEssayCount: planned,
          supplementalCompleted: completed,
          hasReceivedFeedback: hasFeedback,
          feedbackSource: hasFeedback ? feedbackSource as 'teacher' | 'counselor' | 'tutor' | 'peer' | 'none' : undefined,
        });
        break;
      }
      case 'awards':
        updateSection('awards', { awards: awards.filter(a => a.name.trim() !== '') });
        break;
      case 'recommendations': {
        const total = parseInt(totalLetters) || 0;
        const conf = Math.min(parseInt(confirmed) || 0, total);
        const sub = Math.min(parseInt(submitted) || 0, conf);
        updateSection('recommendations', {
          totalLetters: total,
          confirmed: conf,
          submitted: sub,
          recommenderTypes,
        });
        break;
      }
    }
  }

  function getScoreForCategory(name: string): number | undefined {
    return scores?.categoryScores.find(c => c.category === name)?.score;
  }

  // Activity helpers
  function addActivity() {
    setActivities(prev => [...prev, {
      id: crypto.randomUUID(),
      name: '', category: 'other' as ActivityCategory, role: '',
      yearsInvolved: 1, hoursPerWeek: 2, hasLeadership: false, description: '',
    }]);
  }
  function removeActivity(id: string) { setActivities(prev => prev.filter(a => a.id !== id)); }
  function updateActivity(id: string, field: keyof Activity, value: Activity[keyof Activity]) {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  }

  // Award helpers
  function addAward() {
    setAwards(prev => [...prev, { id: crypto.randomUUID(), name: '', level: 'school' as AwardLevel, category: '' }]);
  }
  function removeAward(id: string) { setAwards(prev => prev.filter(a => a.id !== id)); }
  function updateAward(id: string, field: keyof Award, value: string) {
    setAwards(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  }

  function toggleRecommenderType(type: RecommenderType) {
    setRecommenderTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  }

  if (!isLoaded) {
    return (
      <div className="pb-20 md:pb-8 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
        {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile & Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Update your application profile. Changes save automatically.
        </p>
      </div>

      {/* Score summary */}
      {scores && (
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Overall Application Score</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{scores.total}<span className="text-lg text-gray-400">/100</span></p>
            </div>
            <div className="text-right">
              <span className={cn(
                'px-3 py-1 rounded-full text-sm font-semibold',
                scores.total >= 70 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                  : scores.total >= 50 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
              )}>
                {scores.label}
              </span>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {/* Academics */}
        <Card className="!p-0 overflow-hidden">
          <SectionHeader
            title={CATEGORY_LABELS.academics}
            icon="📚"
            isOpen={openSection === 'academics'}
            onToggle={() => toggleSection('academics')}
            score={getScoreForCategory('academics')}
          />
          {openSection === 'academics' && (
            <div className="px-4 pb-4 space-y-4 animate-slide-down-fade">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Unweighted GPA"
                  type="number"
                  step="0.01"
                  min="0"
                  max={gpaScale === '5.0' ? '5.0' : gpaScale === '100' ? '100' : '4.0'}
                  placeholder={gpaScale === '5.0' ? 'e.g. 4.5' : gpaScale === '100' ? 'e.g. 95' : 'e.g. 3.85'}
                  value={gpa}
                  onChange={e => setGpa(e.target.value)}
                />
                <Select label="GPA Scale" value={gpaScale} onChange={e => setGpaScale(e.target.value as typeof gpaScale)} options={GPA_SCALE_OPTIONS} />
              </div>
              <Select label="Course Rigor" value={rigor} onChange={e => setRigor(e.target.value as CourseRigor)} options={RIGOR_OPTIONS} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="AP/IB Courses" type="number" min="0" value={apCount} onChange={e => setApCount(e.target.value)} placeholder="e.g. 5" />
                <Input label="Honors Courses" type="number" min="0" value={honorsCount} onChange={e => setHonorsCount(e.target.value)} placeholder="e.g. 3" />
              </div>
              <div className="flex justify-end pt-2">
                <Button size="sm" onClick={() => { saveSection('academics'); setOpenSection(null); }}>Save</Button>
              </div>
            </div>
          )}
        </Card>

        {/* Testing */}
        <Card className="!p-0 overflow-hidden">
          <SectionHeader
            title={CATEGORY_LABELS.testing}
            icon="📝"
            isOpen={openSection === 'testing'}
            onToggle={() => toggleSection('testing')}
            score={getScoreForCategory('testing')}
          />
          {openSection === 'testing' && (
            <div className="px-4 pb-4 space-y-4 animate-slide-down-fade">
              <Select label="Test Strategy" value={testType} onChange={e => setTestType(e.target.value as typeof testType)} options={TEST_TYPE_OPTIONS} />
              {(testType === 'sat' || testType === 'both') && (
                <Input label="SAT Score" type="number" min="400" max="1600" placeholder="e.g. 1450" value={satScore} onChange={e => setSatScore(e.target.value)} />
              )}
              {(testType === 'act' || testType === 'both') && (
                <Input label="ACT Score" type="number" min="1" max="36" placeholder="e.g. 32" value={actScore} onChange={e => setActScore(e.target.value)} />
              )}
              <div className="flex justify-end pt-2">
                <Button size="sm" onClick={() => { saveSection('testing'); setOpenSection(null); }}>Save</Button>
              </div>
            </div>
          )}
        </Card>

        {/* Activities */}
        <Card className="!p-0 overflow-hidden">
          <SectionHeader
            title={CATEGORY_LABELS.activities}
            icon="🏃"
            isOpen={openSection === 'activities'}
            onToggle={() => toggleSection('activities')}
            score={getScoreForCategory('activities')}
          />
          {openSection === 'activities' && (
            <div className="px-4 pb-4 space-y-4 animate-slide-down-fade">
              {activities.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-gray-500">No activities added yet.</p>
              )}
              {activities.map((activity, i) => (
                <div key={activity.id} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Activity {i + 1}</span>
                    <button type="button" onClick={() => removeActivity(activity.id)} className="text-red-400 hover:text-red-600 text-sm cursor-pointer">Remove</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Name" placeholder="e.g. Debate Team" value={activity.name} onChange={e => updateActivity(activity.id, 'name', e.target.value)} />
                    <Input label="Role" placeholder="e.g. Captain" value={activity.role} onChange={e => updateActivity(activity.id, 'role', e.target.value)} />
                  </div>
                  <Select label="Category" value={activity.category} onChange={e => updateActivity(activity.id, 'category', e.target.value as ActivityCategory)} options={CATEGORY_OPTIONS} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Years" type="number" min="1" max="4" value={activity.yearsInvolved.toString()} onChange={e => updateActivity(activity.id, 'yearsInvolved', parseInt(e.target.value) || 1)} />
                    <Input label="Hours/Week" type="number" min="0" max="40" value={activity.hoursPerWeek.toString()} onChange={e => updateActivity(activity.id, 'hoursPerWeek', parseInt(e.target.value) || 0)} />
                  </div>
                  <Toggle label="Leadership position" checked={activity.hasLeadership} onChange={checked => updateActivity(activity.id, 'hasLeadership', checked)} />
                </div>
              ))}
              <Button variant="secondary" onClick={addActivity} className="w-full">+ Add Activity</Button>
              <div className="flex justify-end pt-2">
                <Button size="sm" onClick={() => { saveSection('activities'); setOpenSection(null); }}>Save</Button>
              </div>
            </div>
          )}
        </Card>

        {/* Essays */}
        <Card className="!p-0 overflow-hidden">
          <SectionHeader
            title={CATEGORY_LABELS.essays}
            icon="✍️"
            isOpen={openSection === 'essays'}
            onToggle={() => toggleSection('essays')}
            score={getScoreForCategory('essays')}
          />
          {openSection === 'essays' && (
            <div className="px-4 pb-4 space-y-4 animate-slide-down-fade">
              <Select label="Personal Statement Status" value={essayStatus} onChange={e => setEssayStatus(e.target.value as EssayStatus)} options={ESSAY_STATUS_OPTIONS} />
              <Input label="Number of Drafts Written" type="number" min="0" value={drafts} onChange={e => setDrafts(e.target.value)} placeholder="e.g. 3" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Supplementals Planned" type="number" min="0" value={suppCount} onChange={e => setSuppCount(e.target.value)} placeholder="e.g. 8" />
                <Input label="Supplementals Done" type="number" min="0" value={suppDone} onChange={e => setSuppDone(e.target.value)} placeholder="e.g. 3" />
              </div>
              <Toggle label="Received feedback on essays" checked={hasFeedback} onChange={setHasFeedback} />
              {hasFeedback && (
                <Select label="Feedback Source" value={feedbackSource} onChange={e => setFeedbackSource(e.target.value as typeof feedbackSource)} options={FEEDBACK_OPTIONS} />
              )}
              <div className="flex justify-end pt-2">
                <Button size="sm" onClick={() => { saveSection('essays'); setOpenSection(null); }}>Save</Button>
              </div>
            </div>
          )}
        </Card>

        {/* Awards */}
        <Card className="!p-0 overflow-hidden">
          <SectionHeader
            title={CATEGORY_LABELS.awards}
            icon="🏆"
            isOpen={openSection === 'awards'}
            onToggle={() => toggleSection('awards')}
            score={getScoreForCategory('awards')}
          />
          {openSection === 'awards' && (
            <div className="px-4 pb-4 space-y-4 animate-slide-down-fade">
              {awards.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-gray-500">No awards added yet.</p>
              )}
              {awards.map((award, i) => (
                <div key={award.id} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Award {i + 1}</span>
                    <button type="button" onClick={() => removeAward(award.id)} className="text-red-400 hover:text-red-600 text-sm cursor-pointer">Remove</button>
                  </div>
                  <Input label="Award Name" placeholder="e.g. National Merit Semifinalist" value={award.name} onChange={e => updateAward(award.id, 'name', e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <Select label="Level" value={award.level} onChange={e => updateAward(award.id, 'level', e.target.value as AwardLevel)} options={AWARD_LEVEL_OPTIONS} />
                    <Input label="Category" placeholder="e.g. STEM" value={award.category} onChange={e => updateAward(award.id, 'category', e.target.value)} />
                  </div>
                </div>
              ))}
              <Button variant="secondary" onClick={addAward} className="w-full">+ Add Award</Button>
              <div className="flex justify-end pt-2">
                <Button size="sm" onClick={() => { saveSection('awards'); setOpenSection(null); }}>Save</Button>
              </div>
            </div>
          )}
        </Card>

        {/* Recommendations */}
        <Card className="!p-0 overflow-hidden">
          <SectionHeader
            title={CATEGORY_LABELS.recommendations}
            icon="💌"
            isOpen={openSection === 'recommendations'}
            onToggle={() => toggleSection('recommendations')}
            score={getScoreForCategory('recommendations')}
          />
          {openSection === 'recommendations' && (
            <div className="px-4 pb-4 space-y-4 animate-slide-down-fade">
              <div className="grid grid-cols-3 gap-3">
                <Input label="Total Planned" type="number" min="0" value={totalLetters} onChange={e => setTotalLetters(e.target.value)} placeholder="e.g. 3" />
                <Input label="Confirmed" type="number" min="0" value={confirmed} onChange={e => setConfirmed(e.target.value)} placeholder="e.g. 2" />
                <Input label="Submitted" type="number" min="0" value={submitted} onChange={e => setSubmitted(e.target.value)} placeholder="e.g. 0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommender Types</label>
                <div className="space-y-2">
                  {RECOMMENDER_OPTIONS.map(opt => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={recommenderTypes.includes(opt.value)}
                        onChange={() => toggleRecommenderType(opt.value)}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button size="sm" onClick={() => { saveSection('recommendations'); setOpenSection(null); }}>Save</Button>
              </div>
            </div>
          )}
        </Card>

        {/* Account Section */}
        <Card className="!p-0 overflow-hidden">
          <SectionHeader
            title="Account"
            icon="👤"
            isOpen={openSection === 'account'}
            onToggle={() => toggleSection('account')}
          />
          {openSection === 'account' && (
            <div className="px-4 pb-4 space-y-4 animate-slide-down-fade">
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {isGuest ? 'Guest (local storage only)' : 'Signed in'}
                  </span>
                </div>
                {user && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Profile Created</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(profile.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                {!showResetConfirm ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                    onClick={() => setShowResetConfirm(true)}
                  >
                    Reset All Profile Data
                  </Button>
                ) : (
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-red-500">Are you sure? This cannot be undone.</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="!text-red-600 !bg-red-50 dark:!bg-red-900/20"
                      onClick={() => { resetProfile(); setShowResetConfirm(false); }}
                    >
                      Yes, Reset
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowResetConfirm(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
