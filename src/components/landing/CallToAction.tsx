'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

export function CallToAction() {
  const { ref, inView } = useInView(0.15);

  return (
    <section
      ref={ref}
      className={cn(
        'relative py-24 px-6 overflow-hidden transition-all duration-700',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]" />

      <div className="relative max-w-3xl mx-auto text-center">
        <div className="text-5xl mb-6">🌳</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Build Your Best Application?
        </h2>
        <p className="text-emerald-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          It only takes 5 minutes to see where you stand and get your personalized action plan. No account required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/onboarding">
            <Button size="lg" variant="secondary" className="bg-white text-emerald-700 hover:bg-emerald-50 border-white/20 text-lg px-10 font-bold shadow-xl">
              Get Started Free →
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="ghost" className="!text-white/90 hover:!text-white hover:!bg-white/10 text-lg px-8">
              Try the Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
