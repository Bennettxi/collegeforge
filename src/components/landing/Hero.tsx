'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

const STATS = [
  { label: 'Score Categories', value: 6, accent: 'border-indigo-500' },
  { label: 'Colleges in Database', value: 80, accent: 'border-violet-500' },
  { label: 'Badges to Earn', value: 15, accent: 'border-emerald-500' },
];

function AnimatedNumber({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{current}</>;
}

export function Hero() {
  return (
    <section className="relative overflow-hidden mesh-hero pt-32 pb-24">
      {/* Floating orbital decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Orbiting circles */}
        <div
          className="absolute top-1/4 left-1/4 w-3 h-3 bg-indigo-500/40 rounded-full animate-orbit"
          style={{ animationDuration: '12s', animationDelay: '0s' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-2 h-2 bg-violet-500/50 rounded-full animate-orbit"
          style={{ animationDuration: '18s', animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-emerald-500/30 rounded-full animate-orbit"
          style={{ animationDuration: '15s', animationDelay: '5s' }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-indigo-400/35 rounded-full animate-orbit"
          style={{ animationDuration: '20s', animationDelay: '8s' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-3.5 h-3.5 bg-violet-400/25 rounded-full animate-orbit"
          style={{ animationDuration: '14s', animationDelay: '3s' }}
        />

        {/* Pulsing rings */}
        <div className="absolute top-20 right-[15%] w-32 h-32 rounded-full border border-indigo-500/20 animate-pulse-ring" />
        <div className="absolute bottom-32 left-[10%] w-48 h-48 rounded-full border border-violet-500/15 animate-pulse-ring" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-[8%] w-24 h-24 rounded-full border border-emerald-500/20 animate-pulse-ring" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-full text-indigo-700 dark:text-indigo-400 text-sm font-medium mb-8 animate-slide-down-fade">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          Free college app analyzer
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
          Build Your Strongest{' '}
          <span className="text-brand">
            College Application
          </span>
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Track your progress, level up your avatar, and get personalized
          recommendations to stand out in admissions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/onboarding">
            <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0 text-lg px-10 shadow-xl shadow-indigo-500/25">
              Start Building →
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="glass text-lg px-8 backdrop-blur-md">
              View Demo
            </Button>
          </Link>
        </div>

        {/* Animated stats in glass cards */}
        <div className="flex items-center justify-center gap-6 md:gap-10">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className={`glass-card rounded-2xl px-6 py-4 text-center border-t-2 ${stat.accent}`}
            >
              <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                <AnimatedNumber target={stat.value} duration={1200 + i * 300} />
                <span className="text-indigo-500">+</span>
              </p>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
