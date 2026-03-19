import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('rounded-lg skeleton-shimmer', className)} />;
}

export function ScoreCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center gap-3">
      <Skeleton className="w-8 h-8 rounded-full" />
      <Skeleton className="w-20 h-4" />
      <Skeleton className="w-[72px] h-[72px] rounded-full" />
      <Skeleton className="w-16 h-3" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="w-48 h-60 rounded-3xl" />
        <Skeleton className="w-20 h-6 rounded-lg" />
        <Skeleton className="w-32 h-4 rounded-lg" />
      </div>
      <div>
        <Skeleton className="w-40 h-6 rounded-lg mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ScoreCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
