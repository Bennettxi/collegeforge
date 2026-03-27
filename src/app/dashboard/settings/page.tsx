'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { useScores } from '@/hooks/useScores';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/lib/utils';
import { TIER_INFO, FEATURE_LIMITS } from '@/types/subscription';
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

// ─── Types & Constants ──────────────────────────────────────────────

type TabKey = 'profile' | 'subscription' | 'appearance' | 'application' | 'notifications' | 'privacy';
type ProfileSectionKey = 'academics' | 'testing' | 'activities' | 'essays' | 'awards' | 'recommendations';

interface TabDef {
  key: TabKey;
  icon: string;
  label: string;
}

const TABS: TabDef[] = [
  { key: 'profile', icon: '\u{1F464}', label: 'User Profile' },
  { key: 'subscription', icon: '\u{1F48E}', label: 'Subscription' },
  { key: 'appearance', icon: '\u{1F3A8}', label: 'Appearance' },
  { key: 'application', icon: '\u{1F4CB}', label: 'Application Profile' },
  { key: 'notifications', icon: '\u{1F514}', label: 'Notifications' },
  { key: 'privacy', icon: '\u{1F512}', label: 'Data & Privacy' },
];

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

const ACCENT_COLORS = [
  { name: 'Emerald', value: '#10b981', tw: 'bg-emerald-500' },
  { name: 'Blue', value: '#3b82f6', tw: 'bg-blue-500' },
  { name: 'Purple', value: '#8b5cf6', tw: 'bg-purple-500' },
  { name: 'Rose', value: '#f43f5e', tw: 'bg-rose-500' },
  { name: 'Amber', value: '#f59e0b', tw: 'bg-amber-500' },
];

interface NotificationPrefs {
  deadlineReminders: boolean;
  weeklyProgress: boolean;
  badgeAlerts: boolean;
  featureAnnouncements: boolean;
  applicationTips: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  deadlineReminders: true,
  weeklyProgress: true,
  badgeAlerts: true,
  featureAnnouncements: false,
  applicationTips: true,
};

// ─── Sub-components ─────────────────────────────────────────────────

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

// ─── Main Component ─────────────────────────────────────────────────

export default function SettingsPage() {
  const { profile, updateSection, resetProfile, isLoaded } = useProfile();
  const { user, isGuest, signOut } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { tier, isPremium, upgradeToPremium, downgradeToFree } = useSubscription();
  const scores = useScores();

  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [mobileTabOpen, setMobileTabOpen] = useState(false);

  // ─── User Profile state ───────────────────────────────────────
  const [displayName, setDisplayName] = useState('');
  useEffect(() => {
    try {
      const saved = localStorage.getItem('collegesprout_display_name');
      if (saved) setDisplayName(saved);
    } catch { /* noop */ }
  }, []);
  function saveDisplayName(name: string) {
    setDisplayName(name);
    try { localStorage.setItem('collegesprout_display_name', name); } catch { /* noop */ }
  }

  // ─── Appearance state ─────────────────────────────────────────
  const [accentColor, setAccentColor] = useState('#10b981');
  useEffect(() => {
    try {
      const saved = localStorage.getItem('collegesprout_accent_color');
      if (saved) setAccentColor(saved);
    } catch { /* noop */ }
  }, []);
  function saveAccent(color: string) {
    setAccentColor(color);
    try { localStorage.setItem('collegesprout_accent_color', color); } catch { /* noop */ }
  }

  function setThemeMode(mode: 'light' | 'dark' | 'system') {
    if (mode === 'system') {
      try { localStorage.removeItem('collegesprout_theme'); } catch { /* noop */ }
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    } else {
      if ((mode === 'dark') !== isDark) toggleTheme();
    }
  }

  function getCurrentThemeMode(): 'light' | 'dark' | 'system' {
    try {
      const saved = localStorage.getItem('collegesprout_theme');
      if (saved === 'light') return 'light';
      if (saved === 'dark') return 'dark';
    } catch { /* noop */ }
    return 'system';
  }

  // ─── Notifications state ──────────────────────────────────────
  const [notifications, setNotifications] = useState<NotificationPrefs>(DEFAULT_NOTIFICATIONS);
  useEffect(() => {
    try {
      const saved = localStorage.getItem('collegesprout_notifications');
      if (saved) setNotifications({ ...DEFAULT_NOTIFICATIONS, ...JSON.parse(saved) });
    } catch { /* noop */ }
  }, []);
  function updateNotification(key: keyof NotificationPrefs, value: boolean) {
    setNotifications(prev => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem('collegesprout_notifications', JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  }

  // ─── Application Profile state (preserved from original) ─────
  const [openSection, setOpenSection] = useState<ProfileSectionKey | null>(null);

  const [gpa, setGpa] = useState(profile.academics.gpaUnweighted?.toString() ?? '');
  const [gpaScale, setGpaScale] = useState(profile.academics.gpaScale);
  const [rigor, setRigor] = useState<CourseRigor>(profile.academics.courseRigor);
  const [apCount, setApCount] = useState(profile.academics.apCourseCount.toString());
  const [honorsCount, setHonorsCount] = useState(profile.academics.honorsCount.toString());

  const [testType, setTestType] = useState(profile.testing.testType);
  const [satScore, setSatScore] = useState(profile.testing.satScore?.toString() ?? '');
  const [actScore, setActScore] = useState(profile.testing.actScore?.toString() ?? '');

  const [activities, setActivities] = useState<Activity[]>(profile.activities.activities);

  const [essayStatus, setEssayStatus] = useState<EssayStatus>(profile.essays.personalStatementStatus);
  const [drafts, setDrafts] = useState(profile.essays.personalStatementDrafts.toString());
  const [suppCount, setSuppCount] = useState(profile.essays.supplementalEssayCount.toString());
  const [suppDone, setSuppDone] = useState(profile.essays.supplementalCompleted.toString());
  const [hasFeedback, setHasFeedback] = useState(profile.essays.hasReceivedFeedback);
  const [feedbackSource, setFeedbackSource] = useState<'teacher' | 'counselor' | 'tutor' | 'peer' | 'none'>(profile.essays.feedbackSource ?? 'none');

  const [awards, setAwards] = useState<Award[]>(profile.awards.awards);

  const [totalLetters, setTotalLetters] = useState(profile.recommendations.totalLetters.toString());
  const [confirmed, setConfirmed] = useState(profile.recommendations.confirmed.toString());
  const [submitted, setSubmitted] = useState(profile.recommendations.submitted.toString());
  const [recommenderTypes, setRecommenderTypes] = useState<RecommenderType[]>(profile.recommendations.recommenderTypes);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showClearDoubleConfirm, setShowClearDoubleConfirm] = useState(false);

  // ─── Application Profile helpers ──────────────────────────────

  function toggleProfileSection(key: ProfileSectionKey) {
    if (openSection === key) {
      saveProfileSection(key);
      setOpenSection(null);
    } else {
      if (openSection) saveProfileSection(openSection);
      setOpenSection(key);
    }
  }

  function saveProfileSection(key: ProfileSectionKey) {
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

  // ─── Data & Privacy helpers ───────────────────────────────────

  function exportData() {
    const data = {
      profile,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `collegesprout-profile-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearAllData() {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('collegesprout_'));
      keys.forEach(k => localStorage.removeItem(k));
    } catch { /* noop */ }
    resetProfile();
    setShowClearConfirm(false);
    setShowClearDoubleConfirm(false);
    window.location.reload();
  }

  function getStorageUsage(): string {
    try {
      let total = 0;
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('collegesprout_')) {
          total += localStorage.getItem(key)?.length ?? 0;
        }
      }
      if (total < 1024) return `${total} bytes`;
      return `${(total / 1024).toFixed(1)} KB`;
    } catch {
      return 'Unknown';
    }
  }

  // ─── Loading state ────────────────────────────────────────────

  if (!isLoaded) {
    return (
      <div className="pb-20 md:pb-8 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
        {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl" />)}
      </div>
    );
  }

  // ─── Tab content renderers ────────────────────────────────────

  function renderUserProfile() {
    return (
      <div className="space-y-6 animate-slide-up-fade">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">User Profile</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account information.</p>
        </div>

        <Card className="space-y-4">
          <Input
            label="Display Name"
            placeholder="Enter your name"
            value={displayName}
            onChange={e => saveDisplayName(e.target.value)}
          />

          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.email ?? 'Guest'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Account Status</span>
            <span className={cn(
              'text-sm font-semibold px-2.5 py-0.5 rounded-full',
              isGuest
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
            )}>
              {isGuest ? 'Guest' : 'Signed In'}
            </span>
          </div>

          {!isGuest && user?.created_at && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Account Created</span>
              <span className="text-sm text-gray-900 dark:text-white">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </Card>

        {/* Auth actions */}
        <Card className="space-y-3">
          {isGuest ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sign in to sync your data across devices.
              </p>
              <div className="flex gap-3">
                <Button size="sm" onClick={() => window.location.href = '/auth/login'}>Sign In</Button>
                <Button variant="secondary" size="sm" onClick={() => window.location.href = '/auth/signup'}>Sign Up</Button>
              </div>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => signOut()}>Sign Out</Button>
          )}
        </Card>

        {/* Danger zone */}
        {!isGuest && (
          <Card className="!border-red-200 dark:!border-red-900/50">
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Permanently delete your account and all associated data.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900/20"
              onClick={() => alert('Account deletion is not yet implemented. Please contact support.')}
            >
              Delete Account
            </Button>
          </Card>
        )}
      </div>
    );
  }

  function renderSubscription() {
    const currentTier = TIER_INFO[tier];
    const features = [
      { name: 'Colleges', free: '3', premium: 'Unlimited' },
      { name: 'Documents', free: '5', premium: 'Unlimited' },
      { name: 'Essay Analyses', free: '1', premium: 'Unlimited' },
      { name: 'Share Themes', free: '1', premium: 'All 5' },
      { name: 'Badges', free: '5', premium: 'All 15' },
      { name: 'What-If Simulator', free: false, premium: true },
      { name: 'Acceptance Probability', free: false, premium: true },
      { name: 'Deadline Calendar', free: false, premium: true },
      { name: 'Insights Cards', free: false, premium: true },
      { name: 'Recommendations', free: false, premium: true },
      { name: 'Cloud Sync', free: false, premium: true },
    ];

    return (
      <div className="space-y-6 animate-slide-up-fade">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Subscription</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your plan and features.</p>
        </div>

        {/* Current plan */}
        <Card className="text-center space-y-2">
          <span className="text-4xl">{currentTier.emoji}</span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{currentTier.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{currentTier.description}</p>
          <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{currentTier.price}</p>
        </Card>

        {/* Beta banner */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            Currently free during beta!
          </p>
        </div>

        {/* Comparison table */}
        <Card className="!p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Feature</th>
                <th className="text-center p-3 font-semibold text-gray-700 dark:text-gray-300">
                  {TIER_INFO.sprout.emoji} Sprout
                </th>
                <th className="text-center p-3 font-semibold text-gray-700 dark:text-gray-300">
                  {TIER_INFO.mighty_oak.emoji} Mighty Oak
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={f.name} className={cn(
                  'border-b border-gray-100 dark:border-gray-700/50',
                  i % 2 === 0 && 'bg-gray-50/50 dark:bg-gray-800/50'
                )}>
                  <td className="p-3 text-gray-700 dark:text-gray-300">{f.name}</td>
                  <td className="p-3 text-center text-gray-500 dark:text-gray-400">
                    {typeof f.free === 'boolean' ? (f.free ? '\u2705' : '\u274C') : f.free}
                  </td>
                  <td className="p-3 text-center text-gray-900 dark:text-white font-medium">
                    {typeof f.premium === 'boolean' ? (f.premium ? '\u2705' : '\u274C') : f.premium}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-3">
          {isPremium ? (
            <>
              <span className="px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
                Current Plan: Mighty Oak
              </span>
              <button
                onClick={downgradeToFree}
                className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline cursor-pointer"
              >
                Downgrade to Free
              </button>
            </>
          ) : (
            <Button onClick={upgradeToPremium} size="lg">
              Upgrade to Mighty Oak {TIER_INFO.mighty_oak.emoji}
            </Button>
          )}
        </div>
      </div>
    );
  }

  function renderAppearance() {
    const currentMode = getCurrentThemeMode();
    const modes: { value: 'light' | 'dark' | 'system'; label: string; icon: string }[] = [
      { value: 'light', label: 'Light', icon: '\u2600\uFE0F' },
      { value: 'dark', label: 'Dark', icon: '\u{1F319}' },
      { value: 'system', label: 'System', icon: '\u{1F4BB}' },
    ];

    return (
      <div className="space-y-6 animate-slide-up-fade">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Appearance</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Customize how CollegeSprout looks.</p>
        </div>

        {/* Theme mode */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Theme</h3>
          <div className="grid grid-cols-3 gap-3">
            {modes.map(m => (
              <button
                key={m.value}
                type="button"
                onClick={() => setThemeMode(m.value)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer',
                  currentMode === m.value
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <span className="text-2xl">{m.icon}</span>
                <span className={cn(
                  'text-sm font-medium',
                  currentMode === m.value
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-gray-600 dark:text-gray-400'
                )}>
                  {m.label}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Theme preview */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Preview</h3>
          <div className={cn(
            'rounded-xl p-4 border',
            isDark
              ? 'bg-gray-900 border-gray-700'
              : 'bg-white border-gray-200'
          )}>
            <div className="flex items-center gap-3 mb-3">
              <div className={cn('w-10 h-10 rounded-full', isDark ? 'bg-gray-700' : 'bg-gray-200')} />
              <div className="space-y-1">
                <div className={cn('h-3 w-24 rounded', isDark ? 'bg-gray-700' : 'bg-gray-200')} />
                <div className={cn('h-2 w-16 rounded', isDark ? 'bg-gray-800' : 'bg-gray-100')} />
              </div>
            </div>
            <div className="space-y-2">
              <div className={cn('h-2 w-full rounded', isDark ? 'bg-gray-700' : 'bg-gray-200')} />
              <div className={cn('h-2 w-3/4 rounded', isDark ? 'bg-gray-700' : 'bg-gray-200')} />
            </div>
            <div className="mt-3 flex gap-2">
              <div className="h-6 w-16 rounded-lg bg-emerald-500" />
              <div className={cn('h-6 w-16 rounded-lg border', isDark ? 'border-gray-600' : 'border-gray-300')} />
            </div>
          </div>
        </Card>

        {/* Accent color */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Accent Color</h3>
          <div className="flex gap-3">
            {ACCENT_COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => saveAccent(c.value)}
                className={cn(
                  'w-10 h-10 rounded-full transition-all cursor-pointer',
                  c.tw,
                  accentColor === c.value
                    ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white dark:ring-offset-gray-800 scale-110'
                    : 'hover:scale-105'
                )}
                title={c.name}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Accent color customization coming soon.
          </p>
        </Card>
      </div>
    );
  }

  function renderApplicationProfile() {
    return (
      <div className="space-y-6 animate-slide-up-fade">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Application Profile</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update your application profile. Changes save when you close each section.
          </p>
        </div>

        {/* Score summary */}
        {scores && (
          <Card className="p-4">
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
              icon="\u{1F4DA}"
              isOpen={openSection === 'academics'}
              onToggle={() => toggleProfileSection('academics')}
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
                  <Button size="sm" onClick={() => { saveProfileSection('academics'); setOpenSection(null); }}>Save</Button>
                </div>
              </div>
            )}
          </Card>

          {/* Testing */}
          <Card className="!p-0 overflow-hidden">
            <SectionHeader
              title={CATEGORY_LABELS.testing}
              icon="\u{1F4DD}"
              isOpen={openSection === 'testing'}
              onToggle={() => toggleProfileSection('testing')}
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
                  <Button size="sm" onClick={() => { saveProfileSection('testing'); setOpenSection(null); }}>Save</Button>
                </div>
              </div>
            )}
          </Card>

          {/* Activities */}
          <Card className="!p-0 overflow-hidden">
            <SectionHeader
              title={CATEGORY_LABELS.activities}
              icon="\u{1F3C3}"
              isOpen={openSection === 'activities'}
              onToggle={() => toggleProfileSection('activities')}
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
                  <Button size="sm" onClick={() => { saveProfileSection('activities'); setOpenSection(null); }}>Save</Button>
                </div>
              </div>
            )}
          </Card>

          {/* Essays */}
          <Card className="!p-0 overflow-hidden">
            <SectionHeader
              title={CATEGORY_LABELS.essays}
              icon="\u270D\uFE0F"
              isOpen={openSection === 'essays'}
              onToggle={() => toggleProfileSection('essays')}
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
                  <Button size="sm" onClick={() => { saveProfileSection('essays'); setOpenSection(null); }}>Save</Button>
                </div>
              </div>
            )}
          </Card>

          {/* Awards */}
          <Card className="!p-0 overflow-hidden">
            <SectionHeader
              title={CATEGORY_LABELS.awards}
              icon="\u{1F3C6}"
              isOpen={openSection === 'awards'}
              onToggle={() => toggleProfileSection('awards')}
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
                  <Button size="sm" onClick={() => { saveProfileSection('awards'); setOpenSection(null); }}>Save</Button>
                </div>
              </div>
            )}
          </Card>

          {/* Recommendations */}
          <Card className="!p-0 overflow-hidden">
            <SectionHeader
              title={CATEGORY_LABELS.recommendations}
              icon="\u{1F48C}"
              isOpen={openSection === 'recommendations'}
              onToggle={() => toggleProfileSection('recommendations')}
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
                  <Button size="sm" onClick={() => { saveProfileSection('recommendations'); setOpenSection(null); }}>Save</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  function renderNotifications() {
    return (
      <div className="space-y-6 animate-slide-up-fade">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Notifications</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Choose what you want to be notified about.</p>
        </div>

        <Card className="space-y-5">
          <Toggle
            label="Deadline reminders"
            checked={notifications.deadlineReminders}
            onChange={v => updateNotification('deadlineReminders', v)}
          />
          <Toggle
            label="Weekly progress summary"
            checked={notifications.weeklyProgress}
            onChange={v => updateNotification('weeklyProgress', v)}
          />
          <Toggle
            label="Badge earned alerts"
            checked={notifications.badgeAlerts}
            onChange={v => updateNotification('badgeAlerts', v)}
          />
          <Toggle
            label="New feature announcements"
            checked={notifications.featureAnnouncements}
            onChange={v => updateNotification('featureAnnouncements', v)}
          />
          <Toggle
            label="Application tips"
            checked={notifications.applicationTips}
            onChange={v => updateNotification('applicationTips', v)}
          />
        </Card>

        <Card className="!bg-blue-50 dark:!bg-blue-900/20 !border-blue-200 dark:!border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Email notifications coming soon. These preferences will apply once email notifications are enabled.
          </p>
        </Card>
      </div>
    );
  }

  function renderPrivacy() {
    return (
      <div className="space-y-6 animate-slide-up-fade">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Data & Privacy</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your data and privacy settings.</p>
        </div>

        {/* Data info */}
        <Card className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Data Storage</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your data is stored locally on your device. Premium users&apos; data is also synced to our secure cloud.
          </p>
          <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Local Storage Usage</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{getStorageUsage()}</span>
          </div>
        </Card>

        {/* Export */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Export Data</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Download a copy of your profile data as a JSON file.
          </p>
          <Button variant="secondary" size="sm" onClick={exportData}>
            Export Data
          </Button>
        </Card>

        {/* Danger zone */}
        <Card className="!border-red-200 dark:!border-red-900/50 space-y-4">
          <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>

          {/* Reset profile */}
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Reset your application profile to defaults. This removes all your academic data.
            </p>
            {!showResetConfirm ? (
              <Button
                variant="ghost"
                size="sm"
                className="!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                onClick={() => setShowResetConfirm(true)}
              >
                Reset Profile
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

          <div className="border-t border-red-100 dark:border-red-900/30 pt-4 space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Clear all CollegeSprout data from this device including preferences, profile, and settings.
            </p>
            {!showClearConfirm ? (
              <Button
                variant="ghost"
                size="sm"
                className="!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                onClick={() => setShowClearConfirm(true)}
              >
                Clear All Data
              </Button>
            ) : !showClearDoubleConfirm ? (
              <div className="flex items-center gap-3">
                <p className="text-sm text-red-500">This will delete everything. Continue?</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="!text-red-600 !bg-red-50 dark:!bg-red-900/20"
                  onClick={() => setShowClearDoubleConfirm(true)}
                >
                  Yes, Continue
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <p className="text-sm text-red-600 font-semibold">Last chance. All data will be permanently deleted.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="!text-white !bg-red-600 hover:!bg-red-700"
                  onClick={clearAllData}
                >
                  Delete Everything
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setShowClearConfirm(false); setShowClearDoubleConfirm(false); }}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  const tabContent: Record<TabKey, () => React.ReactElement> = {
    profile: renderUserProfile,
    subscription: renderSubscription,
    appearance: renderAppearance,
    application: renderApplicationProfile,
    notifications: renderNotifications,
    privacy: renderPrivacy,
  };

  const activeTabDef = TABS.find(t => t.key === activeTab)!;

  // ─── Render ───────────────────────────────────────────────────

  return (
    <div className="pb-20 md:pb-8">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      {/* Mobile tab selector */}
      <div className="md:hidden mb-6">
        <button
          type="button"
          onClick={() => setMobileTabOpen(!mobileTabOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span>{activeTabDef.icon}</span>
            <span className="font-medium text-gray-900 dark:text-white">{activeTabDef.label}</span>
          </div>
          <svg
            className={cn('w-5 h-5 text-gray-400 transition-transform', mobileTabOpen && 'rotate-180')}
            fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        {mobileTabOpen && (
          <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg animate-slide-down-fade">
            {TABS.map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => { setActiveTab(tab.key); setMobileTabOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer',
                  activeTab === tab.key
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                )}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop layout: sidebar + content */}
      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-60 shrink-0">
          <nav className="sticky top-6 space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer',
                  activeTab === tab.key
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-semibold shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0 max-w-3xl" key={activeTab}>
          {tabContent[activeTab]()}
        </div>
      </div>
    </div>
  );
}
