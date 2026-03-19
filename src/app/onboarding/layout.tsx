import { Card } from '@/components/ui/Card';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
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
