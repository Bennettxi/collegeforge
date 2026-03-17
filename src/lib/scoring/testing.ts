import { TestingData } from '@/types/profile';
import { CategoryScore, ScoreDetail, getScoreLabel } from '@/types/scoring';
import { clamp } from '@/lib/utils';

function mapSatScore(sat: number): number {
  if (sat >= 1550) return 98;
  if (sat >= 1500) return 92;
  if (sat >= 1400) return 80;
  if (sat >= 1300) return 65;
  if (sat >= 1200) return 50;
  if (sat >= 1100) return 35;
  return 20;
}

function mapActScore(act: number): number {
  if (act >= 35) return 98;
  if (act >= 33) return 90;
  if (act >= 30) return 78;
  if (act >= 27) return 65;
  if (act >= 24) return 50;
  if (act >= 21) return 35;
  return 20;
}

export function scoreTesting(data: TestingData): CategoryScore {
  const breakdown: ScoreDetail[] = [];

  if (data.testType === 'test_optional') {
    breakdown.push({ factor: 'Test Strategy', value: 50, description: 'Going test-optional — a valid strategy for many schools' });
    return { category: 'testing', score: 50, label: getScoreLabel(50), breakdown };
  }

  if (data.testType === 'not_yet') {
    breakdown.push({ factor: 'Test Status', value: 20, description: 'No test taken yet — plan to take the SAT or ACT soon' });
    return { category: 'testing', score: 20, label: getScoreLabel(20), breakdown };
  }

  let baseScore = 0;

  if ((data.testType === 'sat' || data.testType === 'both') && data.satScore) {
    const satMapped = mapSatScore(data.satScore);
    breakdown.push({ factor: 'SAT Score', value: satMapped, description: `${data.satScore} SAT${data.satScore >= 1400 ? ' — very competitive' : data.satScore >= 1200 ? ' — solid score' : ' — consider retaking'}` });
    baseScore = Math.max(baseScore, satMapped);
  }

  if ((data.testType === 'act' || data.testType === 'both') && data.actScore) {
    const actMapped = mapActScore(data.actScore);
    breakdown.push({ factor: 'ACT Score', value: actMapped, description: `${data.actScore} ACT${data.actScore >= 30 ? ' — very competitive' : data.actScore >= 24 ? ' — solid score' : ' — consider retaking'}` });
    baseScore = Math.max(baseScore, actMapped);
  }

  // AP Exam bonus (up to 10)
  let apBonus = 0;
  if (data.apScores && data.apScores.length > 0) {
    for (const ap of data.apScores) {
      if (ap.score === 5) apBonus += 3;
      else if (ap.score === 4) apBonus += 1.5;
    }
    apBonus = Math.min(apBonus, 10);
    breakdown.push({ factor: 'AP Exams', value: apBonus, description: `${data.apScores.length} AP exam(s) reported` });
  }

  if (baseScore === 0) {
    breakdown.push({ factor: 'Test Scores', value: 0, description: 'Enter your test scores to see your rating' });
  }

  const total = clamp(baseScore + apBonus, 0, 100);
  return { category: 'testing', score: total, label: getScoreLabel(total), breakdown };
}
