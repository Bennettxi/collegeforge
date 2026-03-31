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
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]" />

      {/* Floating orb decorations */}
      <div className="absolute top-10 left-[10%] w-20 h-20 bg-white/5 rounded-full blur-xl animate-orbit" style={{ animationDuration: '16s' }} />
      <div className="absolute bottom-10 right-[15%] w-28 h-28 bg-violet-400/10 rounded-full blur-2xl animate-orbit" style={{ animationDuration: '20s', animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-[5%] w-16 h-16 bg-indigo-300/10 rounded-full blur-xl animate-orbit" style={{ animationDuration: '14s', animationDelay: '6s' }} />

      {/* Glass overlay card */}
      <div className="relative max-w-3xl mx-auto">
        <div className="glass rounded-3xl p-12 text-center border border-white/10 backdrop-blur-md bg-white/5">
          <div className="text-5xl mb-6">🌳</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build Your Best Application?
          </h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            It only takes 5 minutes to see where you stand and get your personalized action plan. No account required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/onboarding">
              <Button size="lg" variant="secondary" className="bg-white text-indigo-700 hover:bg-indigo-50 border-white/20 text-lg px-10 font-bold shadow-xl shadow-indigo-900/30">
                Get Started Free →
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="ghost" className="glass !text-white/90 hover:!text-white hover:!bg-white/15 text-lg px-8 backdrop-blur-md border border-white/20">
                Try the Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
