import { StudentProfile } from '@/types/profile';
import { CategoryScore } from '@/types/scoring';
import { calculateScores } from '@/lib/scoring/engine';

export interface Recommendation {
  id: string;
  category: CategoryScore['category'];
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
}

export function generateRecommendations(profile: StudentProfile): Recommendation[] {
  const { categoryScores } = calculateScores(profile);
  const recs: Recommendation[] = [];

  for (const cs of categoryScores) {
    const categoryRecs = getRecsForCategory(cs, profile);
    recs.push(...categoryRecs);
  }

  recs.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return recs;
}

function getRecsForCategory(cs: CategoryScore, profile: StudentProfile): Recommendation[] {
  const recs: Recommendation[] = [];
  const { category, score } = cs;

  if (category === 'academics') {
    if (profile.academics.gpaUnweighted === null) {
      recs.push({ id: 'acad-gpa', category, priority: 'high', title: 'Enter Your GPA', description: 'Add your GPA to get an accurate academic assessment.', impact: 'Unlocks your full academic score' });
    } else if (score < 30) {
      recs.push({ id: 'acad-low', category, priority: 'high', title: 'Strengthen Your Academics', description: 'Focus on raising your GPA this semester. Consider tutoring or study groups for challenging subjects.', impact: 'Could raise your overall score by ~8 points' });
    }
    if (profile.academics.courseRigor === 'standard' || profile.academics.courseRigor === 'some_honors') {
      recs.push({ id: 'acad-rigor', category, priority: score < 50 ? 'high' : 'medium', title: 'Increase Course Rigor', description: 'Take more AP or honors courses to show colleges you challenge yourself academically.', impact: 'Could raise your academic score by 10-20 points' });
    }
  }

  if (category === 'testing') {
    if (profile.testing.testType === 'not_yet') {
      recs.push({ id: 'test-plan', category, priority: 'high', title: 'Plan Your Test Strategy', description: 'Decide whether to take the SAT, ACT, or go test-optional. Register for an upcoming test date.', impact: 'Could raise your testing score significantly' });
    } else if (profile.testing.testType !== 'test_optional' && score < 50) {
      recs.push({ id: 'test-retake', category, priority: 'medium', title: 'Consider Retaking Your Test', description: 'Many students improve their scores on a second attempt. Focus on your weakest sections.', impact: 'Could raise your testing score by 15-30 points' });
    }
  }

  if (category === 'activities') {
    if (profile.activities.activities.length === 0) {
      recs.push({ id: 'act-start', category, priority: 'high', title: 'Add Your Activities', description: 'Enter your extracurricular activities, jobs, volunteering, and other commitments.', impact: 'Unlocks your full activities score' });
    } else {
      const hasLeadership = profile.activities.activities.some(a => a.hasLeadership);
      if (!hasLeadership) {
        recs.push({ id: 'act-lead', category, priority: 'medium', title: 'Seek Leadership Roles', description: 'Try to take on officer positions, team captain roles, or start your own club or project.', impact: 'Could raise your activities score by 10-15 points' });
      }
      const categories = new Set(profile.activities.activities.map(a => a.category));
      if (categories.size < 3) {
        recs.push({ id: 'act-diverse', category, priority: 'low', title: 'Diversify Your Activities', description: 'Colleges value well-rounded students. Consider adding community service, arts, or research.', impact: 'Could raise your activities score by 5-10 points' });
      }
    }
  }

  if (category === 'essays') {
    if (profile.essays.personalStatementStatus === 'not_started') {
      recs.push({ id: 'ess-start', category, priority: 'high', title: 'Start Your Personal Statement', description: 'The personal statement is one of the most important parts of your application. Begin brainstorming topics.', impact: 'Could raise your essay score by 30+ points' });
    } else if (profile.essays.personalStatementStatus === 'first_draft' || profile.essays.personalStatementStatus === 'brainstorming') {
      recs.push({ id: 'ess-revise', category, priority: 'medium', title: 'Keep Revising Your Essay', description: 'Great essays go through many drafts. Keep refining your story and voice.', impact: 'Could raise your essay score by 10-20 points' });
    }
    if (!profile.essays.hasReceivedFeedback && profile.essays.personalStatementStatus !== 'not_started') {
      recs.push({ id: 'ess-feedback', category, priority: 'medium', title: 'Get Essay Feedback', description: 'Have a teacher, counselor, or trusted adult review your essays. Fresh eyes catch things you miss.', impact: 'Could raise your essay score by 8-15 points' });
    }
  }

  if (category === 'awards') {
    if (score < 30 && profile.awards.awards.length === 0) {
      recs.push({ id: 'awd-note', category, priority: 'low', title: 'Look for Award Opportunities', description: "Apply for competitions, scholarships, and honor societies. Don't worry if you don't have many — strong activities can compensate.", impact: 'Awards add polish to your application' });
    }
  }

  if (category === 'recommendations') {
    if (profile.recommendations.totalLetters === 0) {
      recs.push({ id: 'rec-ask', category, priority: 'high', title: 'Ask for Recommendation Letters', description: 'Most colleges require 2-3 letters. Ask teachers who know you well, ideally from core subjects.', impact: 'Essential for completing your application' });
    } else if (profile.recommendations.confirmed < profile.recommendations.totalLetters) {
      recs.push({ id: 'rec-confirm', category, priority: 'medium', title: 'Confirm Your Recommenders', description: `${profile.recommendations.totalLetters - profile.recommendations.confirmed} recommender(s) haven't confirmed yet. Follow up with them.`, impact: 'Ensures your letters arrive on time' });
    }
  }

  return recs;
}
