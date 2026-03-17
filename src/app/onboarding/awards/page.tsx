'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/context/ProfileContext';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Award, AwardLevel } from '@/types/profile';

function createEmptyAward(): Award {
  return { id: crypto.randomUUID(), name: '', level: 'school', category: '' };
}

export default function AwardsPage() {
  const router = useRouter();
  const { profile, updateSection } = useProfile();
  const [awards, setAwards] = useState<Award[]>(
    profile.awards.awards.length > 0 ? profile.awards.awards : []
  );

  const updateAward = (id: string, field: keyof Award, value: string) => {
    setAwards(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const addAward = () => setAwards(prev => [...prev, createEmptyAward()]);
  const removeAward = (id: string) => setAwards(prev => prev.filter(a => a.id !== id));

  const handleNext = () => {
    const validAwards = awards.filter(a => a.name.trim() !== '');
    updateSection('awards', { awards: validAwards });
    router.push('/onboarding/recommendations');
  };

  return (
    <>
      <StepIndicator currentStep={4} />
      <div className="space-y-5">
        <h2 className="text-xl font-semibold text-gray-900">Awards & Honors</h2>
        <p className="text-sm text-gray-500">Add any awards, competitions, or honors you have received. It is okay to skip this if you do not have any.</p>

        {awards.map((award, i) => (
          <div key={award.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Award {i + 1}</span>
              <button
                type="button"
                onClick={() => removeAward(award.id)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
            <Input
              label="Award Name"
              placeholder="e.g. National Merit Semifinalist"
              value={award.name}
              onChange={e => updateAward(award.id, 'name', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Level"
                value={award.level}
                onChange={e => updateAward(award.id, 'level', e.target.value as AwardLevel)}
                options={[
                  { value: 'school', label: 'School' },
                  { value: 'regional', label: 'Regional' },
                  { value: 'state', label: 'State' },
                  { value: 'national', label: 'National' },
                  { value: 'international', label: 'International' },
                ]}
              />
              <Input
                label="Category"
                placeholder="e.g. STEM, Humanities"
                value={award.category}
                onChange={e => updateAward(award.id, 'category', e.target.value)}
              />
            </div>
          </div>
        ))}

        <Button variant="secondary" onClick={addAward} className="w-full">
          + Add Award
        </Button>

        <div className="flex justify-between pt-4">
          <Button variant="secondary" onClick={() => router.push('/onboarding/essays')}>
            ← Back
          </Button>
          <Button onClick={handleNext}>Next: Recommendations →</Button>
        </div>
      </div>
    </>
  );
}
