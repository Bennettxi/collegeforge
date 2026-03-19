'use client';

import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-full flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
