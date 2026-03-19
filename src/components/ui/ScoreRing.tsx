'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 85) return '#8b5cf6';
  if (score >= 70) return '#06b6d4';
  if (score >= 50) return '#10b981';
  if (score >= 30) return '#f59e0b';
  return '#ef4444';
}

export function ScoreRing({ score, size = 80, strokeWidth = 6, className }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = getScoreColor(score);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-gray-100 dark:stroke-gray-700"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute text-sm font-bold" style={{ color }}>
        {Math.round(score)}
      </span>
    </div>
  );
}
