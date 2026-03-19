'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/context/ProfileContext';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RecommenderType } from '@/types/profile';

const RECOMMENDER_OPTIONS: { value: RecommenderType; label: string }[] = [
  { value: 'core_teacher', label: 'Core Subject Teacher (Math, Science, English, History)' },
  { value: 'elective_teacher', label: 'Elective Teacher (Art, Music, PE)' },
  { value: 'counselor', label: 'School Counselor' },
  { value: 'coach', label: 'Coach' },
  { value: 'employer', label: 'Employer / Supervisor' },
  { value: 'mentor', label: 'Mentor' },
  { value: 'other', label: 'Other' },
];

export default function RecommendationsPage() {
  const router = useRouter();
  const { profile, updateSection } = useProfile();
  const [total, setTotal] = useState(profile.recommendations.totalLetters.toString());
  const [confirmed, setConfirmed] = useState(profile.recommendations.confirmed.toString());
  const [submitted, setSubmitted] = useState(profile.recommendations.submitted.toString());
  const [types, setTypes] = useState<RecommenderType[]>(profile.recommendations.recommenderTypes);

  const toggleType = (type: RecommenderType) => {
    setTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const handleFinish = () => {
    const totalLetters = parseInt(total) || 0;
    const confirmedVal = Math.min(parseInt(confirmed) || 0, totalLetters);
    const submittedVal = Math.min(parseInt(submitted) || 0, confirmedVal);
    updateSection('recommendations', {
      totalLetters,
      confirmed: confirmedVal,
      submitted: submittedVal,
      recommenderTypes: types,
    });
    router.push('/dashboard');
  };

  return (
    <>
      <StepIndicator currentStep={5} />
      <div className="space-y-5">
        <h2 className="text-xl font-semibold text-gray-900">Recommendation Letters</h2>
        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Total Planned"
            type="number"
            min="0"
            placeholder="e.g. 3"
            value={total}
            onChange={e => setTotal(e.target.value)}
          />
          <Input
            label="Confirmed"
            type="number"
            min="0"
            placeholder="e.g. 2"
            value={confirmed}
            onChange={e => setConfirmed(e.target.value)}
          />
          <Input
            label="Submitted"
            type="number"
            min="0"
            placeholder="e.g. 0"
            value={submitted}
            onChange={e => setSubmitted(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Recommender Types</label>
          <div className="space-y-2">
            {RECOMMENDER_OPTIONS.map(opt => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={types.includes(opt.value)}
                  onChange={() => toggleType(opt.value)}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-between pt-4">
          <Button variant="secondary" onClick={() => router.push('/onboarding/awards')}>
            ← Back
          </Button>
          <Button onClick={handleFinish}>See My Results →</Button>
        </div>
      </div>
    </>
  );
}
