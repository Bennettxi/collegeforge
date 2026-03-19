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
  { label: 'Timeline', path: '/dashboard/timeline', icon: '📅' },
  { label: 'Badges', path: '/dashboard/badges', icon: '🏅' },
  { label: 'Tips', path: '/dashboard/recommendations', icon: '🎯' },
];

const MOBILE_NAV = [
  { label: 'Home', path: '/', icon: '🏠' },
  { label: 'Overview', path: '/dashboard', icon: '📊' },
  { label: 'Colleges', path: '/dashboard/colleges', icon: '🏛️' },
  { label: 'Timeline', path: '/dashboard/timeline', icon: '📅' },
  { label: 'More', path: '/dashboard/badges', icon: '🏅' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isGuest } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Guest Mode Banner */}
      {isGuest && (
        <div className="bg-amber-50 border-b border-amber-200 text-center py-2 px-4">
          <p className="text-sm text-amber-800">
            You&apos;re in guest mode — your data is saved locally.{' '}
            <Link href="/auth/signup" className="font-semibold underline hover:text-amber-900">
              Sign up
            </Link>{' '}
            to sync across devices.
          </p>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              CollegeForge
            </Link>
            <SaveIndicator />
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map(item => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      'relative px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    <span className="mr-1">{item.icon}</span>
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-500 rounded-full animate-scale-in" />
                    )}
                  </Link>
                );
              })}
              <Link
                href="/onboarding"
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <span className="mr-1">✏️</span>
                Edit
              </Link>
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around h-16">
          {MOBILE_NAV.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex flex-col items-center gap-0.5 text-xs font-medium py-2 px-2',
                pathname === item.path
                  ? 'text-emerald-600'
                  : 'text-gray-400'
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
