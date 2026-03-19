import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Home button */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
            </svg>
            Home
          </Link>
        </div>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Build Your Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Tell us about your application to get your strength score</p>
        </div>
        <Card className="p-8">
          <div className="animate-slide-up-fade">
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
}
