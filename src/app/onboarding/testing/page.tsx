'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/context/ProfileContext';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

type TestType = 'sat' | 'act' | 'both' | 'test_optional' | 'not_yet';

export default function TestingPage() {
  const router = useRouter();
  const { profile, updateSection } = useProfile();
  const [testType, setTestType] = useState<TestType>(profile.testing.testType);
  const [satScore, setSatScore] = useState(profile.testing.satScore?.toString() ?? '');
  const [actScore, setActScore] = useState(profile.testing.actScore?.toString() ?? '');

  const handleNext = () => {
    updateSection('testing', {
      testType,
      satScore: satScore ? parseInt(satScore) : null,
      actScore: actScore ? parseInt(actScore) : null,
      apScores: profile.testing.apScores || [],
    });
    router.push('/onboarding/activities');
  };

  const showSat = testType === 'sat' || testType === 'both';
  const showAct = testType === 'act' || testType === 'both';

  return (
    <>
      <StepIndicator currentStep={1} />
      <div className="space-y-5">
        <h2 className="text-xl font-semibold text-gray-900">Test Scores</h2>
        <Select
          label="Test Strategy"
          value={testType}
          onChange={e => setTestType(e.target.value as TestType)}
          options={[
            { value: 'not_yet', label: "Haven't taken a test yet" },
            { value: 'sat', label: 'SAT' },
            { value: 'act', label: 'ACT' },
            { value: 'both', label: 'Both SAT & ACT' },
            { value: 'test_optional', label: 'Going Test-Optional' },
          ]}
        />
        {showSat && (
          <Input
            label="SAT Score"
            type="number"
            min="400"
            max="1600"
            placeholder="e.g. 1450"
            value={satScore}
            onChange={e => setSatScore(e.target.value)}
          />
        )}
        {showAct && (
          <Input
            label="ACT Score"
            type="number"
            min="1"
            max="36"
            placeholder="e.g. 32"
            value={actScore}
            onChange={e => setActScore(e.target.value)}
          />
        )}
        <div className="flex justify-between pt-4">
          <Button variant="secondary" onClick={() => router.push('/onboarding')}>
            ← Back
          </Button>
          <Button onClick={handleNext}>Next: Activities →</Button>
        </div>
      </div>
    </>
  );
}
