'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/context/ProfileContext';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { EssayStatus } from '@/types/profile';

export default function EssaysPage() {
  const router = useRouter();
  const { profile, updateSection } = useProfile();
  const [status, setStatus] = useState<EssayStatus>(profile.essays.personalStatementStatus);
  const [drafts, setDrafts] = useState(profile.essays.personalStatementDrafts.toString());
  const [suppCount, setSuppCount] = useState(profile.essays.supplementalEssayCount.toString());
  const [suppDone, setSuppDone] = useState(profile.essays.supplementalCompleted.toString());
  const [hasFeedback, setHasFeedback] = useState(profile.essays.hasReceivedFeedback);
  const [feedbackSource, setFeedbackSource] = useState(profile.essays.feedbackSource ?? 'none');

  const handleNext = () => {
    const planned = parseInt(suppCount) || 0;
    const completed = Math.min(parseInt(suppDone) || 0, planned);
    updateSection('essays', {
      personalStatementStatus: status,
      personalStatementDrafts: parseInt(drafts) || 0,
      supplementalEssayCount: planned,
      supplementalCompleted: completed,
      hasReceivedFeedback: hasFeedback,
      feedbackSource: hasFeedback ? feedbackSource as 'teacher' | 'counselor' | 'tutor' | 'peer' | 'none' : undefined,
    });
    router.push('/onboarding/awards');
  };

  return (
    <>
      <StepIndicator currentStep={3} />
      <div className="space-y-5">
        <h2 className="text-xl font-semibold text-gray-900">Essays</h2>
        <Select
          label="Personal Statement Status"
          value={status}
          onChange={e => setStatus(e.target.value as EssayStatus)}
          options={[
            { value: 'not_started', label: 'Not Started' },
            { value: 'brainstorming', label: 'Brainstorming Topics' },
            { value: 'first_draft', label: 'First Draft Done' },
            { value: 'revising', label: 'Revising' },
            { value: 'polished', label: 'Polished / Nearly Done' },
            { value: 'final', label: 'Final Version Complete' },
          ]}
        />
        <Input
          label="Number of Drafts Written"
          type="number"
          min="0"
          placeholder="e.g. 3"
          value={drafts}
          onChange={e => setDrafts(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Supplemental Essays Planned"
            type="number"
            min="0"
            placeholder="e.g. 8"
            value={suppCount}
            onChange={e => setSuppCount(e.target.value)}
          />
          <Input
            label="Supplementals Completed"
            type="number"
            min="0"
            placeholder="e.g. 3"
            value={suppDone}
            onChange={e => setSuppDone(e.target.value)}
          />
        </div>
        <Toggle
          label="Received feedback on essays"
          checked={hasFeedback}
          onChange={setHasFeedback}
        />
        {hasFeedback && (
          <Select
            label="Feedback Source"
            value={feedbackSource}
            onChange={e => setFeedbackSource(e.target.value as typeof feedbackSource)}
            options={[
              { value: 'teacher', label: 'Teacher' },
              { value: 'counselor', label: 'School Counselor' },
              { value: 'tutor', label: 'Private Tutor / Consultant' },
              { value: 'peer', label: 'Peer / Friend' },
              { value: 'none', label: 'Other' },
            ]}
          />
        )}
        <div className="flex justify-between pt-4">
          <Button variant="secondary" onClick={() => router.push('/onboarding/activities')}>
            ← Back
          </Button>
          <Button onClick={handleNext}>Next: Awards →</Button>
        </div>
      </div>
    </>
  );
}
