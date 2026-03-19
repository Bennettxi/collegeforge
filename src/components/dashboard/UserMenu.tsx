'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initial = (user.email?.[0] ?? 'U').toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold hover:bg-emerald-600 transition-colors cursor-pointer"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50 animate-slide-down-fade">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.email}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Signed in</p>
          </div>
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700"
              onClick={() => { signOut(); setOpen(false); }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
