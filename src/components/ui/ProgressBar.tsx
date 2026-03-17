import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

function getBarColor(pct: number): string {
  if (pct >= 85) return 'bg-gradient-to-r from-violet-500 to-purple-500';
  if (pct >= 70) return 'bg-gradient-to-r from-cyan-500 to-blue-500';
  if (pct >= 50) return 'bg-gradient-to-r from-emerald-500 to-green-500';
  if (pct >= 30) return 'bg-gradient-to-r from-yellow-500 to-amber-500';
  return 'bg-gradient-to-r from-red-400 to-orange-400';
}

export function ProgressBar({ value, max = 100, className, showLabel = false }: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className={cn('w-full', className)}>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', getBarColor(pct))}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 mt-1 text-right">{Math.round(pct)}%</p>
      )}
    </div>
  );
}
