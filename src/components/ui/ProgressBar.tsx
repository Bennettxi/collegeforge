import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

function getBarColor(pct: number): string {
  if (pct >= 85) return 'bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]';
  if (pct >= 70) return 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]';
  if (pct >= 50) return 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]';
  if (pct >= 30) return 'bg-gradient-to-r from-amber-500 to-yellow-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]';
  return 'bg-gradient-to-r from-red-500 to-orange-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]';
}

export function ProgressBar({ value, max = 100, className, showLabel = false }: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className={cn('w-full', className)}>
      <div className="h-2.5 bg-gray-100/50 dark:bg-white/5 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', getBarColor(pct))}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">{Math.round(pct)}%</p>
      )}
    </div>
  );
}
