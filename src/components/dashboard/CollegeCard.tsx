'use client';

import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { College, CollegeTier, ApplicationStatus, TIER_CONFIG, STATUS_CONFIG } from '@/types/college';

interface CollegeCardProps {
  college: College;
  onUpdateStatus: (status: ApplicationStatus) => void;
  onDelete: () => void;
}

const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(([value, cfg]) => ({
  value,
  label: cfg.label,
}));

function formatDeadline(iso: string): string {
  const date = new Date(iso + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isDeadlinePast(iso: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(iso + 'T00:00:00');
  return deadline < today;
}

export function CollegeCard({ college, onUpdateStatus, onDelete }: CollegeCardProps) {
  const tierConfig = TIER_CONFIG[college.tier as CollegeTier];
  const statusConfig = STATUS_CONFIG[college.applicationStatus as ApplicationStatus];
  const deadlinePast = college.deadline ? isDeadlinePast(college.deadline) : false;

  return (
    <Card className="p-4 relative group animate-slide-up-fade">
      {/* Delete button */}
      <button
        onClick={onDelete}
        className={cn(
          'absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full',
          'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
          'opacity-0 group-hover:opacity-100 transition-all duration-200',
          'cursor-pointer'
        )}
        aria-label={`Remove ${college.name}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>

      <div className="flex flex-col gap-3">
        {/* Name and tier badge row */}
        <div className="flex items-start gap-2 pr-8">
          <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight">
            {college.name}
          </h3>
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border shrink-0',
              tierConfig.bgColor,
              tierConfig.color
            )}
          >
            <span>{tierConfig.emoji}</span>
            {tierConfig.label}
          </span>
        </div>

        {/* Status and deadline row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-40">
            <Select
              label=""
              options={STATUS_OPTIONS}
              value={college.applicationStatus}
              onChange={(e) => onUpdateStatus(e.target.value as ApplicationStatus)}
              className="!py-1.5 !text-sm"
            />
          </div>

          {college.deadline && (
            <span
              className={cn(
                'text-sm font-medium flex items-center gap-1',
                deadlinePast ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
              </svg>
              {formatDeadline(college.deadline)}
              {deadlinePast && ' (past due)'}
            </span>
          )}

          {/* Current status indicator (text) */}
          <span className={cn('text-sm font-medium', statusConfig.color)}>
            {statusConfig.label}
          </span>
        </div>

        {/* Notes */}
        {college.notes && (
          <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">{college.notes}</p>
        )}
      </div>
    </Card>
  );
}
