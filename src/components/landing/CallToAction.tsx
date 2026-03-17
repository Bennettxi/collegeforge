import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function CallToAction() {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-emerald-600 to-green-600">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Build Your Best Application?
        </h2>
        <p className="text-emerald-100 text-lg mb-8">
          It only takes 5 minutes to see where you stand and get your personalized action plan.
        </p>
        <Link href="/onboarding">
          <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 from-white to-white hover:from-white hover:to-white">
            Get Started Free →
          </Button>
        </Link>
      </div>
    </section>
  );
}
