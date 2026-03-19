'use client';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const steps = [
  { number: '1', title: 'Input Your Profile', description: 'Enter your GPA, test scores, activities, essays, awards, and recommendations.' },
  { number: '2', title: 'See Your Scores', description: 'Get instant scores for each category and watch your avatar grow.' },
  { number: '3', title: 'Follow Your Plan', description: 'Act on personalized recommendations to strengthen weak areas.' },
];

export function HowItWorks() {
  const { ref, inView } = useInView(0.15);

  return (
    <section
      ref={ref}
      className={cn(
        'py-20 px-6 bg-gray-50 transition-all duration-700',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
