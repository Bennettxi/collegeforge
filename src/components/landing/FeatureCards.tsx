'use client';

import { Card } from '@/components/ui/Card';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: '📊',
    title: 'Analyze Your Strengths',
    description: 'Get a detailed breakdown of your GPA, test scores, activities, essays, and more — all scored on a clear 0-100 scale.',
    gradient: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-900/20 dark:to-cyan-900/20',
    border: 'hover:border-blue-200 dark:hover:border-blue-700',
  },
  {
    icon: '🌳',
    title: 'Level Up Your Avatar',
    description: 'Watch your tree grow from a tiny seedling to a mighty oak as your application gets stronger. Earn badges for each category.',
    gradient: 'from-emerald-500/10 to-green-500/10 dark:from-emerald-900/20 dark:to-green-900/20',
    border: 'hover:border-emerald-200 dark:hover:border-emerald-700',
  },
  {
    icon: '🎯',
    title: 'Get Personalized Tips',
    description: 'Receive actionable recommendations tailored to your profile. Focus on what matters most to maximize your impact.',
    gradient: 'from-amber-500/10 to-orange-500/10 dark:from-amber-900/20 dark:to-orange-900/20',
    border: 'hover:border-amber-200 dark:hover:border-amber-700',
  },
  {
    icon: '🏛️',
    title: 'Match with Colleges',
    description: 'See how you stack up against 80+ colleges. Get instant match scores and suggested tiers — reach, match, or safety.',
    gradient: 'from-purple-500/10 to-violet-500/10 dark:from-purple-900/20 dark:to-violet-900/20',
    border: 'hover:border-purple-200 dark:hover:border-purple-700',
  },
];

export function FeatureCards() {
  const { ref, inView } = useInView(0.15);

  return (
    <section
      ref={ref}
      className={cn(
        'py-20 px-6 bg-white dark:bg-gray-900 transition-all duration-700',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Everything You Need to Stand Out
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-12 max-w-xl mx-auto">
          CollegeSprout breaks down your application into clear, actionable areas so you know exactly where to focus.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <Card
              key={f.title}
              hover
              className={cn(
                'text-center transition-all duration-300',
                f.border
              )}
            >
              <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-4', f.gradient)}>
                <span className="text-2xl">{f.icon}</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
