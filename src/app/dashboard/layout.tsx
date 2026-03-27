'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserMenu } from '@/components/dashboard/UserMenu';
import { SaveIndicator } from '@/components/ui/SaveIndicator';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Overview', path: '/dashboard', icon: '📊' },
  { label: 'Colleges', path: '/dashboard/colleges', icon: '🏛️' },
  { label: 'Simulator', path: '/dashboard/simulator', icon: '🔮' },
  { label: 'Calendar', path: '/dashboard/calendar', icon: '📅' },
  { label: 'Essays', path: '/dashboard/essays', icon: '📝' },
  { label: 'Documents', path: '/dashboard/documents', icon: '📁' },
  { label: 'Badges', path: '/dashboard/badges', icon: '🏅' },
  { label: 'Share', path: '/dashboard/share', icon: '🎴' },
  { label: 'Profile', path: '/dashboard/settings', icon: '⚙️' },
];

// Tips accessible from dashboard overview, not in main nav

const MOBILE_NAV = [
  { label: 'Overview', path: '/dashboard', icon: '📊' },
  { label: 'Colleges', path: '/dashboard/colleges', icon: '🏛️' },
  { label: 'Simulator', path: '/dashboard/simulator', icon: '🔮' },
  { label: 'Docs', path: '/dashboard/documents', icon: '📁' },
  { label: 'Profile', path: '/dashboard/settings', icon: '⚙️' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isGuest } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Guest Mode Banner */}
      {isGuest && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 text-center py-2 px-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            You&apos;re in guest mode — your data is saved locally.{' '}
            <Link href="/auth/signup" className="font-semibold underline hover:text-amber-900 dark:hover:text-amber-100">
              Sign up
            </Link>{' '}
            to sync across devices.
          </p>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
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
                      'relative px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap',
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-500 rounded-full animate-scale-in" />
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="flex items-center justify-around h-16">
          {MOBILE_NAV.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex flex-col items-center gap-0.5 text-xs font-medium py-2 px-2',
                pathname === item.path
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-400 dark:text-gray-500'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
