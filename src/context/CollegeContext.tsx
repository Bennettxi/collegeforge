'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { College } from '@/types/college';

const STORAGE_KEY = 'collegesprout_colleges';

interface CollegeContextValue {
  colleges: College[];
  addCollege: (college: Omit<College, 'id' | 'addedAt'>) => void;
  updateCollege: (id: string, updates: Partial<Omit<College, 'id' | 'addedAt'>>) => void;
  removeCollege: (id: string) => void;
  isLoaded: boolean;
}

const CollegeContext = createContext<CollegeContextValue | null>(null);

function loadColleges(): College[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveColleges(colleges: College[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colleges));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function CollegeProvider({ children }: { children: ReactNode }) {
  const [colleges, setColleges] = useState<College[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const collegesRef = useRef<College[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadColleges();
    setColleges(saved);
    collegesRef.current = saved;
    setIsLoaded(true);
  }, []);

  // Helper to update state and persist
  const persistColleges = useCallback((updater: (prev: College[]) => College[]) => {
    setColleges(prev => {
      const next = updater(prev);
      collegesRef.current = next;
      // Save synchronously so data persists immediately
      saveColleges(next);
      return next;
    });
  }, []);

  const addCollege = useCallback((college: Omit<College, 'id' | 'addedAt'>) => {
    const newCollege: College = {
      ...college,
      id: crypto.randomUUID(),
      addedAt: new Date().toISOString(),
    };
    persistColleges(prev => [newCollege, ...prev]);
  }, [persistColleges]);

  const updateCollege = useCallback((id: string, updates: Partial<Omit<College, 'id' | 'addedAt'>>) => {
    persistColleges(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  }, [persistColleges]);

  const removeCollege = useCallback((id: string) => {
    persistColleges(prev => prev.filter(c => c.id !== id));
  }, [persistColleges]);

  return (
    <CollegeContext.Provider value={{ colleges, addCollege, updateCollege, removeCollege, isLoaded }}>
      {children}
    </CollegeContext.Provider>
  );
}

export function useColleges() {
  const ctx = useContext(CollegeContext);
  if (!ctx) throw new Error('useColleges must be used within CollegeProvider');
  return ctx;
}
