'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useProfile } from '@/context/ProfileContext';
import { useColleges } from '@/context/CollegeContext';
import { useScores } from '@/hooks/useScores';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { findCollege, COLLEGE_DATABASE } from '@/lib/colleges/data';
import { calculateMatch, getTopMatches, CollegeMatch } from '@/lib/colleges/matcher';

interface Insight {
  icon: string;
  title: string;
  description: string;
  color: string;
  link?: string;
  linkLabel?: string;
}

export function InsightsCards() {
  const { profile, isLoaded: profileLoaded } = useProfile();
  const { colleges, isLoaded: collegesLoaded } = useColleges();
  const scores = useScores();

  const insights = useMemo(() => {
    if (!profileLoaded || !collegesLoaded || !scores) return [];

    const results: Insight[] = [];

    // 1. College match comparisons for saved colleges
    const collegeMatches: CollegeMatch[] = [];
    for (const college of colleges) {
      const stats = findCollege(college.name);
      if (stats) {
        collegeMatches.push(calculateMatch(profile, stats));
      }
    }

    // Best match among saved colleges
    const bestMatch = collegeMatches.sort((a, b) => b.matchScore - a.matchScore)[0];
    if (bestMatch) {
      results.push({
        icon: '🎯',
        title: `Best match: ${bestMatch.college.name}`,
        description: `You have a ${bestMatch.matchScore}% match score — ${bestMatch.matchLevel === 'safety' || bestMatch.matchLevel === 'likely' ? 'strong chance of admission' : bestMatch.matchLevel === 'match' ? 'competitive applicant' : 'a challenging but possible reach'}`,
        color: bestMatch.matchScore >= 65 ? 'border-emerald-200 dark:border-emerald-800' : bestMatch.matchScore >= 45 ? 'border-blue-200 dark:border-blue-800' : 'border-amber-200 dark:border-amber-800',
        link: '/dashboard/colleges',
        linkLabel: 'View colleges',
      });
    }

    // 2. Strongest category insight
    if (scores.categoryScores.length > 0) {
      const strongest = [...scores.categoryScores].sort((a, b) => b.score - a.score)[0];
      const weakest = [...scores.categoryScores].sort((a, b) => a.score - b.score)[0];

      if (strongest.score > 0) {
        results.push({
          icon: '💪',
          title: `${strongest.category.charAt(0).toUpperCase() + strongest.category.slice(1)} is your strongest area`,
          description: `Scoring ${strongest.score}/100 (${strongest.label}). Keep it up!`,
          color: 'border-emerald-200 dark:border-emerald-800',
        });
      }

      if (weakest.score < strongest.score) {
        results.push({
          icon: '📈',
          title: `Boost your ${weakest.category}`,
          description: `At ${weakest.score}/100, this is your biggest opportunity for improvement`,
          color: 'border-amber-200 dark:border-amber-800',
          link: '/dashboard/settings',
          linkLabel: 'Update profile',
        });
      }
    }

    // 3. College list suggestion based on score
    if (colleges.length === 0) {
      // Suggest top matches from the database
      const topMatches = getTopMatches(profile, COLLEGE_DATABASE).slice(0, 3);
      if (topMatches.length > 0) {
        const names = topMatches.map(m => m.college.name).join(', ');
        results.push({
          icon: '🏛️',
          title: 'Colleges that match your profile',
          description: `Based on your stats, consider: ${names}`,
          color: 'border-blue-200 dark:border-blue-800',
          link: '/dashboard/colleges',
          linkLabel: 'Build your list',
        });
      }
    } else {
      // Tier balance insight
      const reachCount = colleges.filter(c => c.tier === 'reach').length;
      const matchCount = colleges.filter(c => c.tier === 'match').length;
      const safetyCount = colleges.filter(c => c.tier === 'safety').length;

      if (safetyCount === 0 && colleges.length >= 2) {
        results.push({
          icon: '🛡️',
          title: 'Add some safety schools',
          description: `You have ${reachCount} reach and ${matchCount} match schools but no safeties. A balanced list includes 2-3 safety schools.`,
          color: 'border-amber-200 dark:border-amber-800',
          link: '/dashboard/colleges',
          linkLabel: 'Add colleges',
        });
      } else if (reachCount === 0 && colleges.length >= 2) {
        results.push({
          icon: '🚀',
          title: 'Consider adding reach schools',
          description: `Dream big! Adding 2-3 reach schools gives you a shot at aspirational programs.`,
          color: 'border-purple-200 dark:border-purple-800',
          link: '/dashboard/colleges',
          linkLabel: 'Add colleges',
        });
      } else if (colleges.length >= 3 && reachCount > 0 && matchCount > 0 && safetyCount > 0) {
        results.push({
          icon: '✅',
          title: 'Well-balanced college list',
          description: `Great mix: ${reachCount} reach, ${matchCount} match, ${safetyCount} safety schools`,
          color: 'border-emerald-200 dark:border-emerald-800',
        });
      }
    }

    // 4. Percentile-style insight — compare score to "average" applicant
    if (scores.total > 0) {
      // Approximate percentile (simplified model)
      let percentile: number;
      if (scores.total >= 85) percentile = 95;
      else if (scores.total >= 70) percentile = 80;
      else if (scores.total >= 50) percentile = 60;
      else if (scores.total >= 30) percentile = 35;
      else percentile = 15;

      results.push({
        icon: '📊',
        title: `Stronger than ~${percentile}% of applicants`,
        description: `Your overall score of ${scores.total}/100 puts you in the "${scores.label}" range`,
        color: percentile >= 60 ? 'border-emerald-200 dark:border-emerald-800' : 'border-amber-200 dark:border-amber-800',
      });
    }

    // 5. Upcoming deadline warning (if colleges have deadlines)
    const upcomingDeadlines = colleges
      .filter(c => c.deadline && c.applicationStatus !== 'applied' && c.applicationStatus !== 'accepted' && c.applicationStatus !== 'rejected' && c.applicationStatus !== 'committed')
      .map(c => ({ name: c.name, deadline: new Date(c.deadline + 'T00:00:00') }))
      .filter(d => d.deadline > new Date())
      .sort((a, b) => a.deadline.getTime() - b.deadline.getTime());

    if (upcomingDeadlines.length > 0) {
      const next = upcomingDeadlines[0];
      const daysLeft = Math.ceil((next.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      results.push({
        icon: daysLeft <= 7 ? '🔥' : '📅',
        title: `${next.name} deadline in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
        description: `Due ${next.deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}${upcomingDeadlines.length > 1 ? ` — ${upcomingDeadlines.length - 1} more upcoming` : ''}`,
        color: daysLeft <= 7 ? 'border-red-200 dark:border-red-800' : 'border-blue-200 dark:border-blue-800',
        link: '/dashboard/timeline',
        linkLabel: 'View timeline',
      });
    }

    return results.slice(0, 4); // Show max 4 insights
  }, [profile, profileLoaded, colleges, collegesLoaded, scores]);

  if (insights.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, i) => (
          <Card
            key={i}
            className={cn('!p-4 border-l-4', insight.color)}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{insight.icon}</span>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{insight.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{insight.description}</p>
                {insight.link && (
                  <Link
                    href={insight.link}
                    className="inline-block text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 mt-1.5 transition-colors"
                  >
                    {insight.linkLabel} →
                  </Link>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
