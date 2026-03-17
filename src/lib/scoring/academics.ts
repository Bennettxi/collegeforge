import { AcademicsData } from '@/types/profile';
import { CategoryScore, ScoreDetail, getScoreLabel } from '@/types/scoring';
import { clamp } from '@/lib/utils';

export function scoreAcademics(data: AcademicsData): CategoryScore {
  const breakdown: ScoreDetail[] = [];

  // GPA Score (0-50)
  let gpaScore = 0;
  if (data.gpaUnweighted !== null) {
    const gpa = data.gpaUnweighted;
    if (gpa >= 4.0) gpaScore = 50;
    else if (gpa >= 3.7) gpaScore = 42;
    else if (gpa >= 3.5) gpaScore = 35;
    else if (gpa >= 3.0) gpaScore = 20;
    else if (gpa >= 2.5) gpaScore = 10;
    else gpaScore = 5;
    breakdown.push({ factor: 'GPA', value: gpaScore, description: `Your ${gpa.toFixed(1)} GPA ${gpa >= 3.7 ? 'is very competitive' : gpa >= 3.0 ? 'is solid' : 'has room for improvement'}` });
  } else {
    breakdown.push({ factor: 'GPA', value: 0, description: 'No GPA entered yet' });
  }

  // Course Rigor (0-30)
  const rigorMap: Record<string, number> = {
    all_ap_ib: 30,
    mostly_ap: 24,
    mostly_honors: 18,
    some_honors: 10,
    standard: 4,
  };
  const rigorScore = rigorMap[data.courseRigor] ?? 4;
  breakdown.push({ factor: 'Course Rigor', value: rigorScore, description: data.courseRigor === 'all_ap_ib' ? 'Maximum course rigor' : data.courseRigor === 'standard' ? 'Consider adding honors or AP courses' : 'Good mix of challenging courses' });

  // AP Count Bonus (0-15)
  let apBonus = 0;
  if (data.apCourseCount >= 8) apBonus = 15;
  else if (data.apCourseCount >= 5) apBonus = 12;
  else if (data.apCourseCount >= 3) apBonus = 8;
  else if (data.apCourseCount >= 1) apBonus = 4;
  breakdown.push({ factor: 'AP/IB Courses', value: apBonus, description: `${data.apCourseCount} AP/IB courses taken` });

  // Class Rank Bonus (0-5)
  let rankBonus = 0;
  if (data.classRank) {
    const pct = data.classRank.rank / data.classRank.totalStudents;
    if (pct <= 0.05) rankBonus = 5;
    else if (pct <= 0.10) rankBonus = 4;
    else if (pct <= 0.25) rankBonus = 2;
    breakdown.push({ factor: 'Class Rank', value: rankBonus, description: `Top ${Math.round(pct * 100)}% of class` });
  }

  const total = clamp(gpaScore + rigorScore + apBonus + rankBonus, 0, 100);
  return { category: 'academics', score: total, label: getScoreLabel(total), breakdown };
}
