import { Hero } from '@/components/landing/Hero';
import { FeatureCards } from '@/components/landing/FeatureCards';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { CallToAction } from '@/components/landing/CallToAction';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeatureCards />
      <HowItWorks />
      <CallToAction />
    </main>
  );
}
