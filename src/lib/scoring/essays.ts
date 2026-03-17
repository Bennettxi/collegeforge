import { EssayData } from '@/types/profile';
import { CategoryScore, ScoreDetail, getScoreLabel } from '@/types/scoring';
import { clamp } from '@/lib/utils';

export function scoreEssays(data: EssayData): CategoryScore {
  const breakdown: ScoreDetail[] = [];

  // Personal statement progress (0-50)
  const statusMap: Record<string, number> = {
    final: 50,
    polished: 42,
    revising: 32,
    first_draft: 20,
    brainstorming: 10,
    not_started: 0,
  };
  const psScore = statusMap[data.personalStatementStatus] ?? 0;
  const statusLabels: Record<string, string> = {
    final: 'Personal statement finalized',
    polished: 'Personal statement is polished and nearly done',
    revising: 'Actively revising your personal statement',
    first_draft: 'First draft complete — keep revising!',
    brainstorming: 'Brainstorming topics — great start',
    not_started: 'Personal statement not started yet',
  };
  breakdown.push({ factor: 'Personal Statement', value: psScore, description: statusLabels[data.personalStatementStatus] });

  // Supplemental progress (0-30)
  let suppScore = 15; // neutral if none planned
  if (data.supplementalEssayCount > 0) {
    suppScore = Math.round((data.supplementalCompleted / data.supplementalEssayCount) * 30);
    breakdown.push({ factor: 'Supplemental Essays', value: suppScore, description: `${data.supplementalCompleted}/${data.supplementalEssayCount} supplemental essays completed` });
  }

  // Feedback bonus (0-15)
  let feedbackScore = 0;
  if (data.hasReceivedFeedback) {
    const sourceBonus: Record<string, number> = {
      counselor: 15,
      tutor: 15,
      teacher: 12,
      peer: 8,
      none: 5,
    };
    feedbackScore = sourceBonus[data.feedbackSource ?? 'none'] ?? 5;
    breakdown.push({ factor: 'Feedback', value: feedbackScore, description: `Received feedback from ${data.feedbackSource ?? 'someone'}` });
  } else {
    breakdown.push({ factor: 'Feedback', value: 0, description: 'Get feedback on your essays to strengthen them' });
  }

  // Draft bonus (0-5)
  let draftBonus = 0;
  if (data.personalStatementDrafts >= 3) draftBonus = 5;
  else if (data.personalStatementDrafts >= 2) draftBonus = 3;
  else if (data.personalStatementDrafts >= 1) draftBonus = 1;

  const total = clamp(psScore + suppScore + feedbackScore + draftBonus, 0, 100);
  return { category: 'essays', score: total, label: getScoreLabel(total), breakdown };
}
