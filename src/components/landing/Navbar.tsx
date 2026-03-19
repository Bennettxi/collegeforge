'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Navbar() {
  const { user, isLoading } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100/50 dark:border-gray-800/50">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link
          href="/"
          className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent"
        >
          CollegeForge
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </Link>
          {isLoading ? (
            <div className="w-20 h-8" />
          ) : user ? (
            <Link href="/dashboard">
              <Button size="sm">My Profile</Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
