'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { useScores } from './useScores';
import { getAvatarLevel, AvatarLevel } from '@/types/avatar';

export function useAvatarLevel() {
  const scores = useScores();
  const prevLevelRef = useRef<number>(1);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const avatarLevel: AvatarLevel = useMemo(() => {
    if (!scores) return getAvatarLevel(0);
    return getAvatarLevel(scores.total);
  }, [scores]);

  useEffect(() => {
    if (avatarLevel.level > prevLevelRef.current) {
      setShowLevelUp(true);
      const timer = setTimeout(() => setShowLevelUp(false), 3000);
      return () => clearTimeout(timer);
    }
    prevLevelRef.current = avatarLevel.level;
  }, [avatarLevel.level]);

  return { avatarLevel, showLevelUp, score: scores?.total ?? 0 };
}
