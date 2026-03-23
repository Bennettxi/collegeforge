'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

const STATS = [
  { label: 'Score Categories', value: 6 },
  { label: 'Colleges in Database', value: 80 },
  { label: 'Badges to Earn', value: 15 },
];

function AnimatedNumber({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCurrent(Math.round(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{current}</>;
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-32 pb-24">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-900/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-green-200/20 dark:bg-green-900/15 rounded-full blur-3xl animate-float-slower" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/10 dark:bg-emerald-800/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-full text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-8 animate-slide-down-fade">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Free college app analyzer
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
          Build Your Strongest{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
            College Application
          </span>
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Track your progress, level up your avatar, and get personalized
          recommendations to stand out in admissions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/onboarding">
            <Button size="lg" className="text-lg px-10 shadow-xl shadow-emerald-500/20">
              Start Building →
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="text-lg px-8">
              View Demo
            </Button>
          </Link>
        </div>

        {/* Animated stats */}
        <div className="flex items-center justify-center gap-8 md:gap-16">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                <AnimatedNumber target={stat.value} duration={1200 + i * 300} />
                <span className="text-emerald-500">+</span>
              </p>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
