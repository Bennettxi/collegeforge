'use client';

import { cn } from '@/lib/utils';
import { MatchLevel, MATCH_CONFIG, CollegeMatch } from '@/lib/colleges/matcher';

interface MatchBadgeProps {
  match: CollegeMatch;
  showDetails?: boolean;
}

export function MatchBadge({ match, showDetails = false }: MatchBadgeProps) {
  const config = MATCH_CONFIG[match.matchLevel];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
            config.bgColor,
            config.color
          )}
        >
          <MatchIcon level={match.matchLevel} />
          {config.label}
          <span className="opacity-70">({match.matchScore}%)</span>
        </span>
      </div>

      {showDetails && (
        <div className="space-y-1.5">
          <p className="text-xs text-gray-500 dark:text-gray-400">{config.description}</p>
          <div className="space-y-1">
            {match.factors.map((factor, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <StatusDot status={factor.status} />
                <span className="text-gray-600 dark:text-gray-300">{factor.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MatchIcon({ level }: { level: MatchLevel }) {
  switch (level) {
    case 'safety':
      return <span className="text-sm">&#x2705;</span>;
    case 'likely':
      return <span className="text-sm">&#x1F44D;</span>;
    case 'match':
      return <span className="text-sm">&#x2696;&#xFE0F;</span>;
    case 'reach':
      return <span className="text-sm">&#x1F3AF;</span>;
    case 'strong_reach':
      return <span className="text-sm">&#x1F525;</span>;
  }
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === 'above'
      ? 'bg-emerald-500'
      : status === 'in_range'
        ? 'bg-blue-500'
        : status === 'below'
          ? 'bg-red-400'
          : 'bg-gray-400';

  return <span className={cn('inline-block w-1.5 h-1.5 rounded-full shrink-0', color)} />;
}
