'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { Document } from '@/types/documents';

const STORAGE_KEY = 'collegesprout_documents';

interface DocumentContextValue {
  documents: Document[];
  addDocument: (doc: Omit<Document, 'id' | 'addedAt' | 'updatedAt'>) => void;
  updateDocument: (id: string, updates: Partial<Omit<Document, 'id' | 'addedAt'>>) => void;
  removeDocument: (id: string) => void;
  isLoaded: boolean;
}

const DocumentContext = createContext<DocumentContextValue | null>(null);

function loadDocuments(): Document[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveDocuments(documents: Document[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isInitialLoad = useRef(true);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadDocuments();
    setDocuments(saved);
    setIsLoaded(true);
    isInitialLoad.current = false;
  }, []);

  // Save to localStorage on changes (debounced)
  useEffect(() => {
    if (!isLoaded || isInitialLoad.current) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveDocuments(documents);
    }, 300);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [documents, isLoaded]);

  const addDocument = useCallback((doc: Omit<Document, 'id' | 'addedAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newDoc: Document = {
      ...doc,
      id: crypto.randomUUID(),
      addedAt: now,
      updatedAt: now,
    };
    setDocuments(prev => [newDoc, ...prev]);
  }, []);

  const updateDocument = useCallback((id: string, updates: Partial<Omit<Document, 'id' | 'addedAt'>>) => {
    setDocuments(prev =>
      prev.map(d => (d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d))
    );
  }, []);

  const removeDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  }, []);

  return (
    <DocumentContext.Provider value={{ documents, addDocument, updateDocument, removeDocument, isLoaded }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error('useDocuments must be used within DocumentProvider');
  return ctx;
}
