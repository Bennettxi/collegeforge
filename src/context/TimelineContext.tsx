'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { TimelineEvent } from '@/types/timeline';

const STORAGE_KEY = 'collegesprout_timeline';

interface TimelineContextValue {
  events: TimelineEvent[];
  addEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<Omit<TimelineEvent, 'id'>>) => void;
  removeEvent: (id: string) => void;
  toggleComplete: (id: string) => void;
}

const TimelineContext = createContext<TimelineContextValue | null>(null);

function loadEvents(): TimelineEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function persistEvents(events: TimelineEvent[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.warn('Failed to save timeline to localStorage:', e);
  }
}

function generateId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function TimelineProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadEvents();
    setEvents(stored);
    setIsLoaded(true);
  }, []);

  // Persist whenever events change (skip initial empty state)
  useEffect(() => {
    if (!isLoaded) return;
    persistEvents(events);
  }, [events, isLoaded]);

  const addEvent = useCallback((event: Omit<TimelineEvent, 'id'>) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: generateId(),
    };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<Omit<TimelineEvent, 'id'>>) => {
    setEvents(prev =>
      prev.map(evt => (evt.id === id ? { ...evt, ...updates } : evt))
    );
  }, []);

  const removeEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(evt => evt.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setEvents(prev =>
      prev.map(evt =>
        evt.id === id ? { ...evt, completed: !evt.completed } : evt
      )
    );
  }, []);

  return (
    <TimelineContext.Provider value={{ events, addEvent, updateEvent, removeEvent, toggleComplete }}>
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  const ctx = useContext(TimelineContext);
  if (!ctx) throw new Error('useTimeline must be used within TimelineProvider');
  return ctx;
}
