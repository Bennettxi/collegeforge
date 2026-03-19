'use client';

import { Card } from '@/components/ui/Card';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: '📊',
    title: 'Analyze Your Strengths',
    description: 'Get a detailed breakdown of your GPA, test scores, activities, essays, and more — all scored on a clear 0-100 scale.',
  },
  {
    icon: '🌳',
    title: 'Level Up Your Avatar',
    description: 'Watch your tree grow from a tiny seedling to a mighty oak as your application gets stronger. Earn badges for each category.',
  },
  {
    icon: '🎯',
    title: 'Get Personalized Tips',
    description: 'Receive actionable recommendations tailored to your profile. Focus on what matters most to maximize your impact.',
  },
];

export function FeatureCards() {
  const { ref, inView } = useInView(0.15);

  return (
    <section
      ref={ref}
      className={cn(
        'py-20 px-6 bg-white transition-all duration-700',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Everything You Need to Stand Out
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
          CollegeForge breaks down your application into clear, actionable areas so you know exactly where to focus.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} hover className="text-center">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
