import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 pt-20 pb-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-green-200/20 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Free college app analyzer
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
          Build Your Strongest{' '}
          <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
            College Application
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Track your progress, level up your avatar, and get personalized
          recommendations to stand out in admissions.
        </p>
        <Link href="/onboarding">
          <Button size="lg" className="text-lg px-10">
            Start Building →
          </Button>
        </Link>
      </div>
    </section>
  );
}
