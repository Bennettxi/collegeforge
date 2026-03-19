'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { StudentProfile, createEmptyProfile, AcademicsData, TestingData, ActivityData, EssayData, AwardData, RecommendationData } from '@/types/profile';
import { saveProfile, loadProfile, clearProfile } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

type ProfileSection = 'academics' | 'testing' | 'activities' | 'essays' | 'awards' | 'recommendations';
type SectionData = AcademicsData | TestingData | ActivityData | EssayData | AwardData | RecommendationData;
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface ProfileContextValue {
  profile: StudentProfile;
  updateSection: (section: ProfileSection, data: SectionData) => void;
  resetProfile: () => void;
  isLoaded: boolean;
  saveStatus: SaveStatus;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

async function loadFromSupabase(userId: string): Promise<StudentProfile | null> {
  try {
    const supabase = createClient();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('profile_data')
      .eq('user_id', userId)
      .single();
    if (error || !data) return null;
    return data.profile_data as StudentProfile;
  } catch {
    return null;
  }
}

async function saveToSupabase(userId: string, profile: StudentProfile): Promise<boolean> {
  try {
    const supabase = createClient();
    if (!supabase) return false;
    const { error } = await supabase
      .from('profiles')
      .upsert(
        { user_id: userId, profile_data: profile },
        { onConflict: 'user_id' }
      );
    return !error;
  } catch {
    return false;
  }
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<StudentProfile>(createEmptyProfile);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isInitialLoad = useRef(true);

  // Load profile based on auth state
  useEffect(() => {
    if (authLoading) return;

    async function load() {
      if (user) {
        // Logged in: try Supabase first
        const cloudProfile = await loadFromSupabase(user.id);
        if (cloudProfile) {
          setProfile(cloudProfile);
        } else {
          // First login: check localStorage for migration
          const localProfile = loadProfile();
          if (localProfile) {
            setProfile(localProfile);
            await saveToSupabase(user.id, localProfile);
            clearProfile();
          }
        }
      } else {
        // Guest mode: use localStorage
        const saved = loadProfile();
        if (saved) setProfile(saved);
      }
      setIsLoaded(true);
      isInitialLoad.current = false;
    }

    load();
  }, [user, authLoading]);

  // Save profile on changes (debounced for Supabase, immediate for localStorage)
  useEffect(() => {
    if (!isLoaded || isInitialLoad.current) return;

    if (user) {
      setSaveStatus('saving');
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        const success = await saveToSupabase(user.id, profile);
        setSaveStatus(success ? 'saved' : 'error');
        if (success) {
          setTimeout(() => setSaveStatus('idle'), 2000);
        }
      }, 1000);
    } else {
      const success = saveProfile(profile);
      setSaveStatus(success ? 'saved' : 'error');
      setTimeout(() => setSaveStatus('idle'), 1500);
    }

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [profile, isLoaded, user]);

  const updateSection = useCallback((section: ProfileSection, data: SectionData) => {
    setProfile(prev => ({
      ...prev,
      [section]: data,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const resetProfile = useCallback(() => {
    const fresh = createEmptyProfile();
    setProfile(fresh);
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, updateSection, isLoaded, resetProfile, saveStatus }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
