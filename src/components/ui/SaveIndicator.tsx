'use client';

import { useProfile } from '@/context/ProfileContext';

export function SaveIndicator() {
  const { saveStatus } = useProfile();

  if (saveStatus === 'idle') return null;

  return (
    <span className="text-xs text-gray-400 flex items-center gap-1.5 transition-opacity duration-300">
      {saveStatus === 'saving' && (
        <>
          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
          Saving...
        </>
      )}
      {saveStatus === 'saved' && (
        <>
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          Saved
        </>
      )}
      {saveStatus === 'error' && (
        <>
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
          Save failed
        </>
      )}
    </span>
  );
}
