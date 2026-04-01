'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type ThemeMode = 'light' | 'dark' | 'system';

export interface GradientTheme {
  id: string;
  name: string;
  from: string;
  to: string;
  accent: string;
  fromClass: string;
  toClass: string;
}

export const GRADIENT_THEMES: GradientTheme[] = [
  { id: 'indigo', name: 'Indigo Night', from: '#6366f1', to: '#8b5cf6', accent: '#10b981', fromClass: 'from-indigo-500', toClass: 'to-violet-500' },
  { id: 'ocean', name: 'Ocean Blue', from: '#3b82f6', to: '#06b6d4', accent: '#10b981', fromClass: 'from-blue-500', toClass: 'to-cyan-500' },
  { id: 'sunset', name: 'Sunset', from: '#f97316', to: '#ec4899', accent: '#f59e0b', fromClass: 'from-orange-500', toClass: 'to-pink-500' },
  { id: 'forest', name: 'Forest', from: '#10b981', to: '#059669', accent: '#6366f1', fromClass: 'from-emerald-500', toClass: 'to-emerald-600' },
  { id: 'rose', name: 'Rose Gold', from: '#e11d48', to: '#be185d', accent: '#f59e0b', fromClass: 'from-rose-600', toClass: 'to-pink-700' },
  { id: 'midnight', name: 'Midnight', from: '#7c3aed', to: '#4f46e5', accent: '#06b6d4', fromClass: 'from-violet-600', toClass: 'to-indigo-600' },
];

interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  gradientTheme: string;
  setGradientTheme: (id: string) => void;
  currentGradient: GradientTheme;
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

function applyGradientTheme(themeId: string) {
  const theme = GRADIENT_THEMES.find(t => t.id === themeId) || GRADIENT_THEMES[0];
  const root = document.documentElement;
  root.style.setProperty('--brand-from', theme.from);
  root.style.setProperty('--brand-to', theme.to);
  root.style.setProperty('--brand-accent', theme.accent);
}

function applyCardStyle(style: string) {
  const root = document.documentElement;
  root.dataset.cardStyle = style;
}

const DEFAULT_GRADIENT = GRADIENT_THEMES[0];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [gradientTheme, setGradientThemeState] = useState('indigo');
  const [fontSize, setFontSizeState] = useState('default');
  const [cardStyle, setCardStyleState] = useState('rounded');

  const currentGradient = GRADIENT_THEMES.find(t => t.id === gradientTheme) || DEFAULT_GRADIENT;

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

      // Gradient theme
      const savedGradient = localStorage.getItem('collegesprout_gradient_theme');
      if (savedGradient && GRADIENT_THEMES.some(t => t.id === savedGradient)) {
        setGradientThemeState(savedGradient);
        applyGradientTheme(savedGradient);
      } else {
        applyGradientTheme('indigo');
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

  const setGradientTheme = useCallback((id: string) => {
    setGradientThemeState(id);
    applyGradientTheme(id);
    try { localStorage.setItem('collegesprout_gradient_theme', id); } catch {}
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
      gradientTheme,
      setGradientTheme,
      currentGradient,
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
  gradientTheme: 'indigo',
  setGradientTheme: () => {},
  currentGradient: DEFAULT_GRADIENT,
  fontSize: 'default',
  setFontSize: () => {},
  cardStyle: 'rounded',
  setCardStyle: () => {},
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  return ctx ?? defaultThemeValue;
}
