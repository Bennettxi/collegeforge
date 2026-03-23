'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

const STEPS = [
  { label: 'Academics', path: '/onboarding' },
  { label: 'Testing', path: '/onboarding/testing' },
  { label: 'Activities', path: '/onboarding/activities' },
  { label: 'Essays', path: '/onboarding/essays' },
  { label: 'Awards', path: '/onboarding/awards' },
  { label: 'Letters', path: '/onboarding/recommendations' },
];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-center gap-1 md:gap-2">
        {STEPS.map((step, i) => (
          <div key={step.path} className="flex items-center">
            <Link href={step.path} className="flex flex-col items-center group">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                  i < currentStep
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : i === currentStep
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-900/50'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500',
                  'cursor-pointer'
                )}
              >
                {i < currentStep ? '✓' : i + 1}
              </div>
              <span className={cn(
                'text-xs mt-1 hidden md:block transition-colors',
                i === currentStep
                  ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                  : i < currentStep
                  ? 'text-emerald-600 dark:text-emerald-400 font-medium group-hover:text-emerald-700'
                  : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
              )}>
                {step.label}
              </span>
            </Link>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'w-6 md:w-12 h-0.5 mx-1',
                i < currentStep ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-600'
              )} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Link
          href="/dashboard"
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          Skip to Dashboard →
        </Link>
      </div>
    </div>
  );
}

export { STEPS };
