'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CategoryScore, CATEGORY_LABELS } from '@/types/scoring';
import { cn } from '@/lib/utils';

const CATEGORY_ICONS: Record<string, string> = {
  academics: '📚',
  testing: '📝',
  activities: '🏆',
  essays: '✍️',
  awards: '🏅',
  recommendations: '📬',
};

/** Max value used for scaling breakdown progress bars */
const BREAKDOWN_DISPLAY_MAX = 50;

interface CategoryScoreCardProps {
  categoryScore: CategoryScore;
}

export function CategoryScoreCard({ categoryScore }: CategoryScoreCardProps) {
  const { category, score, label, breakdown } = categoryScore;
  const icon = CATEGORY_ICONS[category] || '📋';
  const displayLabel = CATEGORY_LABELS[category];

  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Measure the expanded content height whenever breakdown changes or expansion toggles
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [expanded, breakdown]);

  return (
    <Card
      hover
      className={cn(
        'flex flex-col items-center text-center p-5 cursor-pointer select-none transition-all duration-300',
        expanded && 'ring-1 ring-emerald-200 dark:ring-emerald-700'
      )}
    >
      {/* Clickable header area */}
      <div
        className="flex flex-col items-center text-center w-full"
        onClick={() => setExpanded(prev => !prev)}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setExpanded(prev => !prev);
          }
        }}
      >
        <div className="text-2xl mb-2">{icon}</div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{displayLabel}</h3>
        <ScoreRing score={score} size={72} strokeWidth={5} />
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">{label}</p>

        {/* Collapsed: show first breakdown description */}
        {!expanded && breakdown.length > 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
            {breakdown[0].description}
          </p>
        )}

        {/* Expand/collapse chevron */}
        <span
          className={cn(
            'inline-block mt-2 text-gray-400 dark:text-gray-500 text-xs transition-transform duration-300',
            expanded && 'rotate-180'
          )}
          aria-hidden="true"
        >
          ▼
        </span>
      </div>

      {/* Expandable breakdown content */}
      <div
        className="w-full overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: expanded ? `${contentHeight}px` : '0px' }}
      >
        <div ref={contentRef}>
          {breakdown.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 w-full space-y-3 text-left">
              {breakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                      {item.factor}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                      {item.value}/{BREAKDOWN_DISPLAY_MAX}
                    </span>
                  </div>
                  <ProgressBar
                    value={item.value}
                    max={BREAKDOWN_DISPLAY_MAX}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-400 dark:text-gray-500">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
