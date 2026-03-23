'use client';

import { useMemo } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { findCollege, CollegeStats } from '@/lib/colleges/data';
import { calculateMatch, CollegeMatch } from '@/lib/colleges/matcher';

export function useCollegeMatch(college: CollegeStats | null): CollegeMatch | null {
  const { profile, isLoaded } = useProfile();

  return useMemo(() => {
    if (!isLoaded || !college) return null;
    return calculateMatch(profile, college);
  }, [profile, isLoaded, college]);
}

export function useCollegeMatchByName(collegeName: string): CollegeMatch | null {
  const { profile, isLoaded } = useProfile();

  return useMemo(() => {
    if (!isLoaded || !collegeName) return null;
    const stats = findCollege(collegeName);
    if (!stats) return null;
    return calculateMatch(profile, stats);
  }, [profile, isLoaded, collegeName]);
}
