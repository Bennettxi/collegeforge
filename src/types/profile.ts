export interface StudentProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  academics: AcademicsData;
  testing: TestingData;
  activities: ActivityData;
  essays: EssayData;
  awards: AwardData;
  recommendations: RecommendationData;
}

export interface AcademicsData {
  gpaUnweighted: number | null;
  gpaWeighted: number | null;
  gpaScale: '4.0' | '5.0' | '100';
  courseRigor: CourseRigor;
  apCourseCount: number;
  honorsCount: number;
  classRank?: ClassRank;
}

export type CourseRigor = 'standard' | 'some_honors' | 'mostly_honors' | 'mostly_ap' | 'all_ap_ib';

export interface ClassRank {
  rank: number;
  totalStudents: number;
}

export interface TestingData {
  testType: 'sat' | 'act' | 'both' | 'test_optional' | 'not_yet';
  satScore?: number | null;
  actScore?: number | null;
  apScores?: APScore[];
}

export interface APScore {
  subject: string;
  score: 1 | 2 | 3 | 4 | 5;
}

export interface ActivityData {
  activities: Activity[];
}

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  role: string;
  yearsInvolved: number;
  hoursPerWeek: number;
  hasLeadership: boolean;
  description: string;
}

export type ActivityCategory =
  | 'academic'
  | 'arts'
  | 'athletics'
  | 'community_service'
  | 'work_experience'
  | 'entrepreneurship'
  | 'research'
  | 'other';

export interface EssayData {
  personalStatementStatus: EssayStatus;
  personalStatementDrafts: number;
  supplementalEssayCount: number;
  supplementalCompleted: number;
  hasReceivedFeedback: boolean;
  feedbackSource?: 'teacher' | 'counselor' | 'tutor' | 'peer' | 'none';
}

export type EssayStatus =
  | 'not_started'
  | 'brainstorming'
  | 'first_draft'
  | 'revising'
  | 'polished'
  | 'final';

export interface AwardData {
  awards: Award[];
}

export interface Award {
  id: string;
  name: string;
  level: AwardLevel;
  category: string;
}

export type AwardLevel = 'school' | 'regional' | 'state' | 'national' | 'international';

export interface RecommendationData {
  totalLetters: number;
  confirmed: number;
  submitted: number;
  recommenderTypes: RecommenderType[];
}

export type RecommenderType =
  | 'core_teacher'
  | 'elective_teacher'
  | 'counselor'
  | 'coach'
  | 'employer'
  | 'mentor'
  | 'other';

export function createEmptyProfile(): StudentProfile {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    academics: {
      gpaUnweighted: null,
      gpaWeighted: null,
      gpaScale: '4.0',
      courseRigor: 'standard',
      apCourseCount: 0,
      honorsCount: 0,
    },
    testing: {
      testType: 'not_yet',
      apScores: [],
    },
    activities: {
      activities: [],
    },
    essays: {
      personalStatementStatus: 'not_started',
      personalStatementDrafts: 0,
      supplementalEssayCount: 0,
      supplementalCompleted: 0,
      hasReceivedFeedback: false,
    },
    awards: {
      awards: [],
    },
    recommendations: {
      totalLetters: 0,
      confirmed: 0,
      submitted: 0,
      recommenderTypes: [],
    },
  };
}
