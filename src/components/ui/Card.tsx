'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: string;
}

const CARD_RADIUS: Record<string, string> = {
  rounded: 'rounded-2xl',
  sharp: 'rounded-md',
  pill: 'rounded-3xl',
};

export function Card({ children, className, hover = false, glow }: CardProps) {
  const { cardStyle } = useTheme();
  const radius = CARD_RADIUS[cardStyle] ?? 'rounded-2xl';

  return (
    <div
      className={cn(
        'glass-card p-6',
        radius,
        hover && 'hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-200/50 dark:hover:border-indigo-500/30 transition-all duration-300 ease-out',
        className
      )}
      style={glow ? { boxShadow: `0 0 20px ${glow}20` } : undefined}
    >
      {children}
    </div>
  );
}
