'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/context/ProfileContext';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CourseRigor } from '@/types/profile';

export default function AcademicsPage() {
  const router = useRouter();
  const { profile, updateSection } = useProfile();
  const [gpa, setGpa] = useState(profile.academics.gpaUnweighted?.toString() ?? '');
  const [gpaScale, setGpaScale] = useState(profile.academics.gpaScale);
  const [rigor, setRigor] = useState<CourseRigor>(profile.academics.courseRigor);
  const [apCount, setApCount] = useState(profile.academics.apCourseCount.toString());
  const [honorsCount, setHonorsCount] = useState(profile.academics.honorsCount.toString());

  const handleNext = () => {
    updateSection('academics', {
      gpaUnweighted: gpa ? parseFloat(gpa) : null,
      gpaWeighted: null,
      gpaScale,
      courseRigor: rigor,
      apCourseCount: parseInt(apCount) || 0,
      honorsCount: parseInt(honorsCount) || 0,
    });
    router.push('/onboarding/testing');
  };

  return (
    <>
      <StepIndicator currentStep={0} />
      <div className="space-y-5">
        <h2 className="text-xl font-semibold text-gray-900">Academics</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Unweighted GPA"
            type="number"
            step="0.01"
            min="0"
            max="4.0"
            placeholder="e.g. 3.85"
            value={gpa}
            onChange={e => setGpa(e.target.value)}
          />
          <Select
            label="GPA Scale"
            value={gpaScale}
            onChange={e => setGpaScale(e.target.value as typeof gpaScale)}
            options={[
              { value: '4.0', label: '4.0 Scale' },
              { value: '5.0', label: '5.0 Scale' },
              { value: '100', label: '100 Scale' },
            ]}
          />
        </div>
        <Select
          label="Course Rigor"
          value={rigor}
          onChange={e => setRigor(e.target.value as CourseRigor)}
          options={[
            { value: 'standard', label: 'Mostly Standard/Regular' },
            { value: 'some_honors', label: 'Some Honors Courses' },
            { value: 'mostly_honors', label: 'Mostly Honors Courses' },
            { value: 'mostly_ap', label: 'Mostly AP/IB Courses' },
            { value: 'all_ap_ib', label: 'All AP/IB Courses' },
          ]}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="AP/IB Courses Taken"
            type="number"
            min="0"
            placeholder="e.g. 5"
            value={apCount}
            onChange={e => setApCount(e.target.value)}
          />
          <Input
            label="Honors Courses Taken"
            type="number"
            min="0"
            placeholder="e.g. 3"
            value={honorsCount}
            onChange={e => setHonorsCount(e.target.value)}
          />
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={handleNext}>Next: Test Scores →</Button>
        </div>
      </div>
    </>
  );
}
