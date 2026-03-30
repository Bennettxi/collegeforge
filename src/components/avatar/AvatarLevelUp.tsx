'use client';

import { useAvatarLevel } from '@/hooks/useAvatarLevel';

export function AvatarLevelUp() {
  const { showLevelUp, avatarLevel } = useAvatarLevel();

  if (!showLevelUp) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
      onClick={() => {
        // Allow dismissing by clicking
        const event = new Event('dismiss-level-up');
        window.dispatchEvent(event);
      }}
    >
      <div className="absolute inset-0 bg-black/20 animate-fade-in" />
      <div className="relative text-center animate-bounce-in pointer-events-none">
        <div
          className="w-32 h-32 rounded-full mx-auto mb-4 animate-level-up-burst"
          style={{ background: `radial-gradient(circle, ${avatarLevel.glowColor}40, transparent)` }}
        />
        <h2 className="text-3xl font-bold text-white drop-shadow-lg">Level Up!</h2>
        <p className="text-xl font-semibold text-white drop-shadow-md mt-2">
          {avatarLevel.name}
        </p>
        <p className="text-white/80 mt-1 drop-shadow">{avatarLevel.description}</p>
        <p className="text-white/50 text-sm mt-4">Tap to dismiss</p>
      </div>
    </div>
  );
}
