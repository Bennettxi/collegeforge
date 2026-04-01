'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserMenu } from '@/components/dashboard/UserMenu';
import { SaveIndicator } from '@/components/ui/SaveIndicator';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  GraduationCap,
  SlidersHorizontal,
  CalendarDays,
  PenLine,
  FolderOpen,
  Award,
  Share2,
  Settings,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Colleges', path: '/dashboard/colleges', icon: GraduationCap },
  { label: 'Simulator', path: '/dashboard/simulator', icon: SlidersHorizontal },
  { label: 'Calendar', path: '/dashboard/calendar', icon: CalendarDays },
  { label: 'Essays', path: '/dashboard/essays', icon: PenLine },
  { label: 'Documents', path: '/dashboard/documents', icon: FolderOpen },
  { label: 'Badges', path: '/dashboard/badges', icon: Award },
  { label: 'Share', path: '/dashboard/share', icon: Share2 },
  { label: 'Profile', path: '/dashboard/settings', icon: Settings },
];

// Tips accessible from dashboard overview, not in main nav

const MOBILE_NAV: NavItem[] = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Colleges', path: '/dashboard/colleges', icon: GraduationCap },
  { label: 'Simulator', path: '/dashboard/simulator', icon: SlidersHorizontal },
  { label: 'Docs', path: '/dashboard/documents', icon: FolderOpen },
  { label: 'Profile', path: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isGuest } = useAuth();

  return (
    <div className="min-h-screen bg-[#fafbfe] dark:bg-[#0f0f1a] mesh-gradient">
      {/* Guest Mode Banner */}
      {isGuest && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-200 dark:border-indigo-800 text-center py-2 px-4">
          <p className="text-sm text-indigo-800 dark:text-indigo-200">
            You&apos;re in guest mode — your data is saved locally.{' '}
            <Link href="/auth/signup" className="font-semibold underline hover:text-indigo-900 dark:hover:text-indigo-100">
              Sign up
            </Link>{' '}
            to sync across devices.
          </p>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="glass-nav sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold text-brand hover:opacity-80 transition-opacity">
              CollegeSprout
            </Link>
            <SaveIndicator />
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            <nav className="flex items-center">
              {NAV_ITEMS.map(item => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      'relative px-2.5 py-1.5 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap',
                      isActive
                        ? ''
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                    )}
                    style={isActive ? { color: 'var(--brand-from, #6366f1)' } : undefined}
                  >
                    <item.icon className="w-4 h-4 inline-block mr-1" />
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-gradient rounded-full animate-scale-in" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User menu or sign in button */}
            {user ? (
              <UserMenu />
            ) : (
              <Link href="/auth/login">
                <Button variant="secondary" size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      {/* Mobile Bottom Tabs */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-nav z-40">
        <div className="flex items-center justify-around h-16">
          {MOBILE_NAV.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex flex-col items-center gap-0.5 text-xs font-medium py-2 px-2',
                pathname !== item.path && 'text-gray-400 dark:text-gray-500'
              )}
              style={pathname === item.path ? { color: 'var(--brand-from, #6366f1)' } : undefined}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
