import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: string;
}

export function Card({ children, className, hover = false, glow }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm',
        hover && 'hover:shadow-lg hover:-translate-y-1 hover:border-emerald-100/50 dark:hover:border-emerald-600/30 transition-all duration-300 ease-out',
        className
      )}
      style={glow ? { boxShadow: `0 0 20px ${glow}20` } : undefined}
    >
      {children}
    </div>
  );
}
