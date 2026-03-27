'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

const STORAGE_KEY = 'collegesprout_streaks';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: string | null;
  totalVisits: number;
  visitHistory: string[];
}

interface StreakContextValue {
  streakData: StreakData;
  isLoaded: boolean;
}

const defaultStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastVisitDate: null,
  totalVisits: 0,
  visitHistory: [],
};

const StreakContext = createContext<StreakContextValue | null>(null);

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function isYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === getDateString(yesterday);
}

function isToday(dateStr: string): boolean {
  return dateStr === getDateString(new Date());
}

function loadStreakData(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStreakData;
    const parsed = JSON.parse(raw);
    return {
      currentStreak: parsed.currentStreak ?? 0,
      longestStreak: parsed.longestStreak ?? 0,
      lastVisitDate: parsed.lastVisitDate ?? null,
      totalVisits: parsed.totalVisits ?? 0,
      visitHistory: Array.isArray(parsed.visitHistory) ? parsed.visitHistory : [],
    };
  } catch {
    return defaultStreakData;
  }
}

function saveStreakData(data: StreakData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function StreakProvider({ children }: { children: ReactNode }) {
  const [streakData, setStreakData] = useState<StreakData>(defaultStreakData);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isInitialLoad = useRef(true);

  // Load from localStorage on mount and record today's visit
  useEffect(() => {
    const saved = loadStreakData();
    const today = getDateString(new Date());

    if (saved.lastVisitDate && isToday(saved.lastVisitDate)) {
      // Already visited today — no changes
      setStreakData(saved);
    } else {
      // Need to record today's visit
      let newStreak: number;

      if (saved.lastVisitDate && isYesterday(saved.lastVisitDate)) {
        // Consecutive day — increment streak
        newStreak = saved.currentStreak + 1;
      } else {
        // First visit or gap in visits — reset to 1
        newStreak = 1;
      }

      const newLongest = Math.max(newStreak, saved.longestStreak);

      const updated: StreakData = {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastVisitDate: today,
        totalVisits: saved.totalVisits + 1,
        visitHistory: [...saved.visitHistory, today],
      };

      setStreakData(updated);
      saveStreakData(updated);
    }

    setIsLoaded(true);
    isInitialLoad.current = false;
  }, []);

  // Save to localStorage on changes (debounced)
  useEffect(() => {
    if (!isLoaded || isInitialLoad.current) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveStreakData(streakData);
    }, 300);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [streakData, isLoaded]);

  return (
    <StreakContext.Provider value={{ streakData, isLoaded }}>
      {children}
    </StreakContext.Provider>
  );
}

export function useStreaks() {
  const ctx = useContext(StreakContext);
  if (!ctx) throw new Error('useStreaks must be used within StreakProvider');
  return ctx;
}
