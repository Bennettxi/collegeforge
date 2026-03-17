'use client';

import { useAvatarLevel } from '@/hooks/useAvatarLevel';
import { SeedlingTree, SproutTree, SaplingTree, FullTree, MightyOakTree } from './trees';
import { cn } from '@/lib/utils';

const treeComponents = [SeedlingTree, SproutTree, SaplingTree, FullTree, MightyOakTree];

interface AvatarDisplayProps {
  className?: string;
  showLabel?: boolean;
}

export function AvatarDisplay({ className, showLabel = true }: AvatarDisplayProps) {
  const { avatarLevel, score } = useAvatarLevel();
  const TreeComponent = treeComponents[avatarLevel.level - 1] || SeedlingTree;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div
        className="relative avatar-container rounded-full p-4"
        style={{ '--glow-color': avatarLevel.glowColor } as React.CSSProperties}
      >
        <div className={cn('w-48 h-60 md:w-56 md:h-72 rounded-3xl bg-gradient-to-b p-4', avatarLevel.bgGradient)}>
          <TreeComponent className="w-full h-full" />
        </div>
      </div>
      {showLabel && (
        <div className="text-center mt-4">
          <p className="text-2xl font-bold text-gray-900">{score}</p>
          <p className="text-sm font-medium" style={{ color: avatarLevel.glowColor }}>
            Level {avatarLevel.level}: {avatarLevel.name}
          </p>
          <p className="text-xs text-gray-500 mt-1">{avatarLevel.description}</p>
        </div>
      )}
    </div>
  );
}
