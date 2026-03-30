'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { useScores } from './useScores';
import { getAvatarLevel, AvatarLevel } from '@/types/avatar';

const LEVEL_KEY = 'collegesprout_last_avatar_level';

export function useAvatarLevel() {
  const scores = useScores();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const hasChecked = useRef(false);

  const avatarLevel: AvatarLevel = useMemo(() => {
    if (!scores) return getAvatarLevel(0);
    return getAvatarLevel(scores.total);
  }, [scores]);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    try {
      const savedLevel = parseInt(localStorage.getItem(LEVEL_KEY) ?? '1', 10);
      if (avatarLevel.level > savedLevel) {
        // New level achieved — show animation once
        setShowLevelUp(true);
        localStorage.setItem(LEVEL_KEY, String(avatarLevel.level));
        const timer = setTimeout(() => setShowLevelUp(false), 2500);
        return () => clearTimeout(timer);
      }
      // Always update stored level (handles first visit)
      localStorage.setItem(LEVEL_KEY, String(avatarLevel.level));
    } catch {
      // localStorage unavailable
    }
  }, [avatarLevel.level]);

  return { avatarLevel, showLevelUp, score: scores?.total ?? 0 };
}
