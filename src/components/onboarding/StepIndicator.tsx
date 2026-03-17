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
    <div className="flex items-center justify-center gap-1 md:gap-2 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.path} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                i < currentStep
                  ? 'bg-emerald-500 text-white'
                  : i === currentStep
                  ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span className={cn(
              'text-xs mt-1 hidden md:block',
              i <= currentStep ? 'text-emerald-600 font-medium' : 'text-gray-400'
            )}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn(
              'w-6 md:w-12 h-0.5 mx-1',
              i < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

export { STEPS };
