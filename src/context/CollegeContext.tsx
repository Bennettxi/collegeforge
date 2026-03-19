'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { College } from '@/types/college';

const STORAGE_KEY = 'collegeforge_colleges';

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
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isInitialLoad = useRef(true);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadColleges();
    setColleges(saved);
    setIsLoaded(true);
    isInitialLoad.current = false;
  }, []);

  // Save to localStorage on changes (debounced)
  useEffect(() => {
    if (!isLoaded || isInitialLoad.current) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveColleges(colleges);
    }, 300);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [colleges, isLoaded]);

  const addCollege = useCallback((college: Omit<College, 'id' | 'addedAt'>) => {
    const newCollege: College = {
      ...college,
      id: crypto.randomUUID(),
      addedAt: new Date().toISOString(),
    };
    setColleges(prev => [newCollege, ...prev]);
  }, []);

  const updateCollege = useCallback((id: string, updates: Partial<Omit<College, 'id' | 'addedAt'>>) => {
    setColleges(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const removeCollege = useCallback((id: string) => {
    setColleges(prev => prev.filter(c => c.id !== id));
  }, []);

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
