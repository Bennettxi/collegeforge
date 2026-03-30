'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  accentColor: string;
  setAccentColor: (color: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  cardStyle: string;
  setCardStyle: (style: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
}

function applyFontSize(size: string) {
  const root = document.documentElement;
  root.classList.remove('text-sm', 'text-base', 'text-lg');
  if (size === 'small') root.style.fontSize = '14px';
  else if (size === 'large') root.style.fontSize = '18px';
  else root.style.fontSize = '16px';
}

function applyAccentColor(color: string) {
  document.documentElement.style.setProperty('--accent-color', color);
}

function applyCardStyle(style: string) {
  const root = document.documentElement;
  root.dataset.cardStyle = style;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [accentColor, setAccentColorState] = useState('#10b981');
  const [fontSize, setFontSizeState] = useState('default');
  const [cardStyle, setCardStyleState] = useState('rounded');

  // Load all saved preferences on mount
  useEffect(() => {
    try {
      // Theme
      const savedTheme = localStorage.getItem('collegesprout_theme') as Theme | null;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
        setThemeModeState(savedTheme);
        applyTheme(savedTheme === 'dark');
      } else {
        setThemeModeState('system');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
        applyTheme(prefersDark);
      }

      // Accent color
      const savedAccent = localStorage.getItem('collegesprout_accent_color');
      if (savedAccent) {
        setAccentColorState(savedAccent);
        applyAccentColor(savedAccent);
      } else {
        applyAccentColor('#10b981');
      }

      // Font size
      const savedFont = localStorage.getItem('collegesprout_font_size');
      if (savedFont) {
        setFontSizeState(savedFont);
        applyFontSize(savedFont);
      }

      // Card style
      const savedCard = localStorage.getItem('collegesprout_card_style');
      if (savedCard) {
        setCardStyleState(savedCard);
        applyCardStyle(savedCard);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (themeMode !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    function handler(e: MediaQueryListEvent) {
      setTheme(e.matches ? 'dark' : 'light');
      applyTheme(e.matches);
    }
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [themeMode]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      applyTheme(next === 'dark');
      setThemeModeState(next);
      try { localStorage.setItem('collegesprout_theme', next); } catch {}
      return next;
    });
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    if (mode === 'system') {
      try { localStorage.removeItem('collegesprout_theme'); } catch {}
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      applyTheme(prefersDark);
    } else {
      setTheme(mode);
      applyTheme(mode === 'dark');
      try { localStorage.setItem('collegesprout_theme', mode); } catch {}
    }
  }, []);

  const setAccentColor = useCallback((color: string) => {
    setAccentColorState(color);
    applyAccentColor(color);
    try { localStorage.setItem('collegesprout_accent_color', color); } catch {}
  }, []);

  const setFontSize = useCallback((size: string) => {
    setFontSizeState(size);
    applyFontSize(size);
    try { localStorage.setItem('collegesprout_font_size', size); } catch {}
  }, []);

  const setCardStyle = useCallback((style: string) => {
    setCardStyleState(style);
    applyCardStyle(style);
    try { localStorage.setItem('collegesprout_card_style', style); } catch {}
  }, []);

  return (
    <ThemeContext.Provider value={{
      theme,
      themeMode,
      toggleTheme,
      setThemeMode,
      isDark: theme === 'dark',
      accentColor,
      setAccentColor,
      fontSize,
      setFontSize,
      cardStyle,
      setCardStyle,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

const defaultThemeValue: ThemeContextValue = {
  theme: 'light',
  themeMode: 'system',
  toggleTheme: () => {},
  setThemeMode: () => {},
  isDark: false,
  accentColor: '#10b981',
  setAccentColor: () => {},
  fontSize: 'default',
  setFontSize: () => {},
  cardStyle: 'rounded',
  setCardStyle: () => {},
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  return ctx ?? defaultThemeValue;
}
