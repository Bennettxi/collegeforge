'use client';

import { useMemo } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { calculateScores } from '@/lib/scoring/engine';
import { OverallScore } from '@/types/scoring';

export function useScores(): OverallScore | null {
  const { profile, isLoaded } = useProfile();

  return useMemo(() => {
    if (!isLoaded) return null;
    return calculateScores(profile);
  }, [profile, isLoaded]);
}
