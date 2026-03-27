'use client';

import { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useProfile } from '@/context/ProfileContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { useScores } from '@/hooks/useScores';
import { useBadges } from '@/hooks/useBadges';
import { useColleges } from '@/context/CollegeContext';
import { getAvatarLevel, AVATAR_LEVELS } from '@/types/avatar';
import { CATEGORY_LABELS, type CategoryName } from '@/types/scoring';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const CARD_THEMES = [
  {
    id: 'emerald',
    name: 'Forest',
    bg: 'from-emerald-600 via-green-600 to-teal-700',
    accent: 'emerald',
    textClass: 'text-white',
    subClass: 'text-emerald-100',
    barBg: 'bg-white/20',
    barFill: 'bg-white',
    ringBg: '#ffffff30',
    ringFill: '#ffffff',
    badgeBg: 'bg-white/15',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    bg: 'from-gray-900 via-slate-800 to-gray-900',
    accent: 'slate',
    textClass: 'text-white',
    subClass: 'text-gray-300',
    barBg: 'bg-white/10',
    barFill: 'bg-emerald-400',
    ringBg: '#ffffff15',
    ringFill: '#34d399',
    badgeBg: 'bg-white/10',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    bg: 'from-orange-500 via-rose-500 to-purple-600',
    accent: 'rose',
    textClass: 'text-white',
    subClass: 'text-rose-100',
    barBg: 'bg-white/20',
    barFill: 'bg-white',
    ringBg: '#ffffff30',
    ringFill: '#ffffff',
    badgeBg: 'bg-white/15',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    bg: 'from-blue-600 via-cyan-600 to-teal-500',
    accent: 'cyan',
    textClass: 'text-white',
    subClass: 'text-cyan-100',
    barBg: 'bg-white/20',
    barFill: 'bg-white',
    ringBg: '#ffffff30',
    ringFill: '#ffffff',
    badgeBg: 'bg-white/15',
  },
  {
    id: 'royal',
    name: 'Royal',
    bg: 'from-violet-600 via-purple-600 to-indigo-700',
    accent: 'violet',
    textClass: 'text-white',
    subClass: 'text-violet-100',
    barBg: 'bg-white/20',
    barFill: 'bg-white',
    ringBg: '#ffffff30',
    ringFill: '#ffffff',
    badgeBg: 'bg-white/15',
  },
];

const TREE_EMOJIS = ['🌱', '🌿', '🌳', '🌲', '🏔️'];

export default function SharePage() {
  const { profile, isLoaded } = useProfile();
  const scores = useScores();
  const { earnedCount, totalCount, badges } = useBadges();
  const { colleges } = useColleges();
  const { canAccess } = useSubscription();
  const hasAllThemes = canAccess('all_share_themes');
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const theme = CARD_THEMES[selectedTheme];
  const avatarLevel = scores ? getAvatarLevel(scores.total) : AVATAR_LEVELS[0];
  const treeEmoji = TREE_EMOJIS[Math.min((avatarLevel.level || 1) - 1, 4)];

  const topCategories = scores
    ? [...scores.categoryScores]
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
    : [];

  const earnedBadges = badges.filter(b => b.earned).slice(0, 5);

  // Download card as image using canvas
  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      // Use html2canvas-like approach with canvas
      const canvas = document.createElement('canvas');
      const scale = 2; // retina
      const cardWidth = 440;
      const cardHeight = 560;
      canvas.width = cardWidth * scale;
      canvas.height = cardHeight * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.scale(scale, scale);

      // Background gradient
      const gradColors = getGradientColors(theme.id);
      const grad = ctx.createLinearGradient(0, 0, cardWidth, cardHeight);
      grad.addColorStop(0, gradColors[0]);
      grad.addColorStop(0.5, gradColors[1]);
      grad.addColorStop(1, gradColors[2]);
      ctx.fillStyle = grad;

      // Rounded rect
      roundRect(ctx, 0, 0, cardWidth, cardHeight, 24);
      ctx.fill();

      // Decorative circles
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.beginPath();
      ctx.arc(350, 80, 120, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(80, 480, 100, 0, Math.PI * 2);
      ctx.fill();

      // Header: CollegeSprout
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '600 12px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('COLLEGESPROUT', 32, 40);

      // Tree emoji + level
      ctx.font = '48px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(treeEmoji, 220, 100);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
      ctx.fillText(avatarLevel.name, 220, 140);

      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '14px system-ui, -apple-system, sans-serif';
      ctx.fillText(avatarLevel.description, 220, 162);

      // Score ring area
      const scoreTotal = scores?.total || 0;
      const ringX = 220;
      const ringY = 220;
      const ringR = 40;

      // Ring background
      ctx.strokeStyle = theme.ringBg;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(ringX, ringY, ringR, 0, Math.PI * 2);
      ctx.stroke();

      // Ring fill
      ctx.strokeStyle = theme.ringFill;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(ringX, ringY, ringR, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * scoreTotal / 100));
      ctx.stroke();

      // Score number
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(Math.round(scoreTotal)), ringX, ringY + 8);

      // Label
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.fillText('OVERALL SCORE', ringX, ringY + 28);

      // Stats row
      const statsY = 295;
      const stats = [
        { val: String(topCategories.length > 0 ? Math.round(topCategories[0].score) : '-'), label: topCategories[0] ? CATEGORY_LABELS[topCategories[0].category as CategoryName] : 'Top Category' },
        { val: `${earnedCount}/${totalCount}`, label: 'Badges' },
        { val: String(colleges.length), label: 'Colleges' },
      ];

      const statWidth = cardWidth / 3;
      stats.forEach((stat, i) => {
        const x = statWidth * i + statWidth / 2;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
        ctx.fillText(stat.val, x, statsY);

        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '11px system-ui, -apple-system, sans-serif';
        ctx.fillText(stat.label, x, statsY + 18);
      });

      // Category bars
      const barsStartY = 345;
      ctx.textAlign = 'left';
      topCategories.forEach((cat, i) => {
        const y = barsStartY + i * 38;
        const barX = 32;
        const barW = cardWidth - 64;
        const fillW = (cat.score / 100) * barW;

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = '12px system-ui, -apple-system, sans-serif';
        ctx.fillText(CATEGORY_LABELS[cat.category as CategoryName], barX, y);

        // Score
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
        ctx.fillText(String(Math.round(cat.score)), barX + barW, y);
        ctx.textAlign = 'left';

        // Bar bg
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        roundRect(ctx, barX, y + 6, barW, 6, 3);
        ctx.fill();

        // Bar fill
        ctx.fillStyle = theme.ringFill;
        if (fillW > 6) {
          roundRect(ctx, barX, y + 6, fillW, 6, 3);
          ctx.fill();
        }
      });

      // Earned badges emoji row
      if (earnedBadges.length > 0) {
        const badgeY = barsStartY + topCategories.length * 38 + 20;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '11px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('EARNED BADGES', 220, badgeY);

        ctx.font = '24px system-ui';
        const totalBadgeW = earnedBadges.length * 40;
        const startX = 220 - totalBadgeW / 2 + 20;
        earnedBadges.forEach((b, i) => {
          ctx.fillText(b.badge.emoji, startX + i * 40, badgeY + 30);
        });
      }

      // Footer
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Made with CollegeSprout — collegesprout.app', 220, cardHeight - 20);

      // Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `collegesprout-profile-${avatarLevel.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Fallback: just alert
      alert('Download failed. Try taking a screenshot instead!');
    } finally {
      setDownloading(false);
    }
  }, [scores, avatarLevel, treeEmoji, theme, topCategories, earnedCount, totalCount, earnedBadges, colleges.length]);

  // Copy stats to clipboard
  const handleCopyStats = useCallback(() => {
    const lines = [
      `🌱 CollegeSprout Profile`,
      ``,
      `${treeEmoji} Level: ${avatarLevel.name}`,
      `📊 Overall Score: ${scores?.total ? Math.round(scores.total) : 0}/100`,
      ``,
      `Top Categories:`,
      ...topCategories.map(c => `  • ${CATEGORY_LABELS[c.category as CategoryName]}: ${Math.round(c.score)}/100`),
      ``,
      `🏅 Badges: ${earnedCount}/${totalCount} earned`,
      `🏛️ Colleges: ${colleges.length} on list`,
      ``,
      `— Made with CollegeSprout`,
    ];

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [scores, avatarLevel, treeEmoji, topCategories, earnedCount, totalCount, colleges.length]);

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 skeleton-shimmer rounded-lg" />
        <div className="h-96 skeleton-shimmer rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-3xl">🎴</span> Share Profile
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Download a beautiful profile card to share your progress
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">&larr; Dashboard</Button>
        </Link>
      </div>

      {/* Theme Picker */}
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Choose a theme
        </p>
        <div className="flex gap-3 flex-wrap">
          {CARD_THEMES.map((t, i) => {
            const isLocked = !hasAllThemes && i > 0;
            return (
              <button
                key={t.id}
                onClick={() => !isLocked && setSelectedTheme(i)}
                className={cn(
                  'relative w-12 h-12 rounded-xl bg-gradient-to-br transition-all duration-200',
                  t.bg,
                  isLocked && 'cursor-not-allowed opacity-40',
                  selectedTheme === i
                    ? 'ring-2 ring-offset-2 ring-emerald-500 dark:ring-offset-gray-900 scale-110'
                    : !isLocked && 'hover:scale-105 opacity-70 hover:opacity-100'
                )}
                title={isLocked ? `🔒 Upgrade to unlock ${t.name} theme` : t.name}
                disabled={isLocked}
              >
                {selectedTheme === i && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-lg">✓</span>
                )}
                {isLocked && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-sm">🔒</span>
                )}
              </button>
            );
          })}
        </div>
        {!hasAllThemes && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
            <a href="/dashboard/settings" className="underline hover:no-underline">Unlock all themes</a> with Mighty Oak
          </p>
        )}
      </div>

      {/* Card Preview + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Preview Card */}
        <div className="lg:col-span-2 flex justify-center">
          <div
            ref={cardRef}
            className={cn(
              'relative w-full max-w-[440px] rounded-3xl bg-gradient-to-br p-8 overflow-hidden shadow-2xl',
              theme.bg
            )}
          >
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-12 translate-x-12" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/5 translate-y-12 -translate-x-12" />

            {/* Content */}
            <div className="relative z-10">
              {/* Logo */}
              <p className="text-xs font-semibold text-white/60 uppercase tracking-[0.2em] mb-6">
                CollegeSprout
              </p>

              {/* Avatar & Level */}
              <div className="text-center mb-6">
                <div className="text-5xl mb-2">{treeEmoji}</div>
                <h2 className={cn('text-2xl font-bold', theme.textClass)}>{avatarLevel.name}</h2>
                <p className={cn('text-sm', theme.subClass)}>{avatarLevel.description}</p>
              </div>

              {/* Score Ring Visual */}
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
                    <circle
                      cx="48" cy="48" r="40" fill="none"
                      stroke={theme.ringFill}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - (scores?.total || 0) / 100)}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn('text-2xl font-bold', theme.textClass)}>
                      {scores ? Math.round(scores.total) : 0}
                    </span>
                    <span className="text-[10px] text-white/50 uppercase">Score</span>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { val: topCategories[0] ? Math.round(topCategories[0].score) : '-', label: topCategories[0] ? CATEGORY_LABELS[topCategories[0].category as CategoryName] : 'Best' },
                  { val: `${earnedCount}/${totalCount}`, label: 'Badges' },
                  { val: colleges.length, label: 'Colleges' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className={cn('text-xl font-bold', theme.textClass)}>{stat.val}</p>
                    <p className="text-[11px] text-white/50">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Top Category Bars */}
              <div className="space-y-3 mb-6">
                {topCategories.map((cat) => (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white/70">{CATEGORY_LABELS[cat.category as CategoryName]}</span>
                      <span className={cn('text-xs font-bold', theme.textClass)}>{Math.round(cat.score)}</span>
                    </div>
                    <div className={cn('h-1.5 rounded-full', theme.barBg)}>
                      <div
                        className={cn('h-full rounded-full transition-all duration-700', theme.barFill)}
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Badge Row */}
              {earnedBadges.length > 0 && (
                <div className="text-center">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Earned Badges</p>
                  <div className="flex justify-center gap-2">
                    {earnedBadges.map((b) => (
                      <span
                        key={b.badge.id}
                        className={cn('w-9 h-9 rounded-lg flex items-center justify-center text-lg', theme.badgeBg)}
                        title={b.badge.name}
                      >
                        {b.badge.emoji}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <p className="text-center text-[10px] text-white/25 mt-6">
                Made with CollegeSprout
              </p>
            </div>
          </div>
        </div>

        {/* Actions Panel */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Download Card</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Save your profile card as a high-res PNG image
            </p>
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? '⏳ Generating...' : '📥 Download PNG'}
            </Button>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Copy Stats</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Copy your stats as text to share anywhere
            </p>
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              onClick={handleCopyStats}
            >
              {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
            </Button>
          </Card>

          <Card className="!bg-emerald-50 dark:!bg-emerald-900/20 !border-emerald-100 dark:!border-emerald-800">
            <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">Pro Tip</h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              Share your card with your guidance counselor to show your application progress, or post it to celebrate milestones!
            </p>
          </Card>

          {/* Score summary */}
          <Card className="!p-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              All Categories
            </p>
            {scores?.categoryScores.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {CATEGORY_LABELS[cat.category as CategoryName]}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {Math.round(cat.score)}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Canvas helpers ---
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function getGradientColors(themeId: string): [string, string, string] {
  switch (themeId) {
    case 'emerald': return ['#059669', '#16a34a', '#0f766e'];
    case 'midnight': return ['#111827', '#1e293b', '#111827'];
    case 'sunset': return ['#f97316', '#f43f5e', '#9333ea'];
    case 'ocean': return ['#2563eb', '#0891b2', '#14b8a6'];
    case 'royal': return ['#7c3aed', '#9333ea', '#4338ca'];
    default: return ['#059669', '#16a34a', '#0f766e'];
  }
}
