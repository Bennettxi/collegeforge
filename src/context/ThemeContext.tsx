'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  // Load saved theme on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('collegesprout_theme') as Theme | null;
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved);
        document.documentElement.classList.toggle('dark', saved === 'dark');
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      try {
        localStorage.setItem('collegesprout_theme', next);
      } catch {
        // localStorage unavailable
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

const defaultThemeValue: ThemeContextValue = {
  theme: 'light',
  toggleTheme: () => {},
  isDark: false,
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  return ctx ?? defaultThemeValue;
}
