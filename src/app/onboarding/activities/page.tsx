'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/context/ProfileContext';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { Activity, ActivityCategory } from '@/types/profile';

const CATEGORY_OPTIONS = [
  { value: 'academic', label: 'Academic (Debate, Science Olympiad, etc.)' },
  { value: 'arts', label: 'Arts (Music, Theater, Visual Arts)' },
  { value: 'athletics', label: 'Athletics (Sports Teams)' },
  { value: 'community_service', label: 'Community Service / Volunteering' },
  { value: 'work_experience', label: 'Work Experience / Internships' },
  { value: 'entrepreneurship', label: 'Entrepreneurship' },
  { value: 'research', label: 'Research' },
  { value: 'other', label: 'Other' },
];

function createEmptyActivity(): Activity {
  return {
    id: crypto.randomUUID(),
    name: '',
    category: 'other',
    role: '',
    yearsInvolved: 1,
    hoursPerWeek: 2,
    hasLeadership: false,
    description: '',
  };
}

export default function ActivitiesPage() {
  const router = useRouter();
  const { profile, updateSection } = useProfile();
  const [activities, setActivities] = useState<Activity[]>(
    profile.activities.activities.length > 0
      ? profile.activities.activities
      : [createEmptyActivity()]
  );

  const updateActivity = (id: string, field: keyof Activity, value: Activity[keyof Activity]) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const addActivity = () => setActivities(prev => [...prev, createEmptyActivity()]);
  const removeActivity = (id: string) => setActivities(prev => prev.filter(a => a.id !== id));

  const handleNext = () => {
    const validActivities = activities.filter(a => a.name.trim() !== '');
    updateSection('activities', { activities: validActivities });
    router.push('/onboarding/essays');
  };

  return (
    <>
      <StepIndicator currentStep={2} />
      <div className="space-y-5">
        <h2 className="text-xl font-semibold text-gray-900">Extracurricular Activities</h2>
        <p className="text-sm text-gray-500">Add your clubs, sports, jobs, volunteering, and other activities.</p>

        {activities.map((activity, i) => (
          <div key={activity.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Activity {i + 1}</span>
              {activities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeActivity(activity.id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Activity Name"
                placeholder="e.g. Debate Team"
                value={activity.name}
                onChange={e => updateActivity(activity.id, 'name', e.target.value)}
              />
              <Input
                label="Your Role"
                placeholder="e.g. Captain"
                value={activity.role}
                onChange={e => updateActivity(activity.id, 'role', e.target.value)}
              />
            </div>
            <Select
              label="Category"
              value={activity.category}
              onChange={e => updateActivity(activity.id, 'category', e.target.value as ActivityCategory)}
              options={CATEGORY_OPTIONS}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Years Involved"
                type="number"
                min="1"
                max="4"
                value={activity.yearsInvolved.toString()}
                onChange={e => updateActivity(activity.id, 'yearsInvolved', parseInt(e.target.value) || 1)}
              />
              <Input
                label="Hours per Week"
                type="number"
                min="0"
                max="40"
                value={activity.hoursPerWeek.toString()}
                onChange={e => updateActivity(activity.id, 'hoursPerWeek', parseInt(e.target.value) || 0)}
              />
            </div>
            <Toggle
              label="Leadership position"
              checked={activity.hasLeadership}
              onChange={checked => updateActivity(activity.id, 'hasLeadership', checked)}
            />
          </div>
        ))}

        <Button variant="secondary" onClick={addActivity} className="w-full">
          + Add Another Activity
        </Button>

        <div className="flex justify-between pt-4">
          <Button variant="secondary" onClick={() => router.push('/onboarding/testing')}>
            ← Back
          </Button>
          <Button onClick={handleNext}>Next: Essays →</Button>
        </div>
      </div>
    </>
  );
}
