'use client';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: '1',
    title: 'Input Your Profile',
    description: 'Enter your GPA, test scores, activities, essays, awards, and recommendations.',
    icon: '📝',
  },
  {
    number: '2',
    title: 'See Your Scores',
    description: 'Get instant scores for each category and watch your avatar grow.',
    icon: '📊',
  },
  {
    number: '3',
    title: 'Match with Colleges',
    description: 'Search 80+ colleges and see your match level — reach, match, or safety.',
    icon: '🏛️',
  },
  {
    number: '4',
    title: 'Follow Your Plan',
    description: 'Act on personalized recommendations to strengthen weak areas.',
    icon: '🚀',
  },
];

export function HowItWorks() {
  const { ref, inView } = useInView(0.15);

  return (
    <section
      ref={ref}
      className={cn(
        'py-20 px-6 mesh-gradient transition-all duration-700',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
          How It Works
        </h2>
        <p className="text-gray-500 dark:text-gray-300 text-center mb-12 max-w-lg mx-auto">
          Get your personalized application score in under 5 minutes
        </p>
        <div className="grid md:grid-cols-4 gap-6 md:gap-4">
          {steps.map((step, i) => (
            <div key={step.number} className="relative text-center">
              {/* Connector line with indigo-violet gradient */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[calc(50%+28px)] right-[calc(-50%+28px)] h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500" />
              )}
              <div className="relative z-10">
                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 dark:from-indigo-500/30 dark:to-violet-500/30 backdrop-blur-md border border-indigo-200/50 dark:border-indigo-700/50">
                  <span className="text-xl">{step.icon}</span>
                </div>
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold mb-2 shadow-md shadow-indigo-500/30">
                  {step.number}
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
