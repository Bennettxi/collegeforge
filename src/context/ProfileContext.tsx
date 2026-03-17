'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { StudentProfile, createEmptyProfile, AcademicsData, TestingData, ActivityData, EssayData, AwardData, RecommendationData } from '@/types/profile';
import { saveProfile, loadProfile } from '@/lib/storage';

type ProfileSection = 'academics' | 'testing' | 'activities' | 'essays' | 'awards' | 'recommendations';
type SectionData = AcademicsData | TestingData | ActivityData | EssayData | AwardData | RecommendationData;

interface ProfileContextValue {
  profile: StudentProfile;
  updateSection: (section: ProfileSection, data: SectionData) => void;
  resetProfile: () => void;
  isLoaded: boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile>(createEmptyProfile);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = loadProfile();
    if (saved) setProfile(saved);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveProfile(profile);
    }
  }, [profile, isLoaded]);

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
    <ProfileContext.Provider value={{ profile, updateSection, isLoaded, resetProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
