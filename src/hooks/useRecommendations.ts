'use client';

import { useMemo } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { generateRecommendations, Recommendation } from '@/lib/recommendations/generator';

export function useRecommendations(): Recommendation[] {
  const { profile, isLoaded } = useProfile();

  return useMemo(() => {
    if (!isLoaded) return [];
    return generateRecommendations(profile);
  }, [profile, isLoaded]);
}
