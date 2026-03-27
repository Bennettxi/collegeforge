export type DocumentCategory = 'transcript' | 'test_scores' | 'recommendation' | 'essay' | 'resume' | 'financial' | 'other';
export type DocumentStatus = 'draft' | 'in_progress' | 'complete' | 'submitted';

export interface Document {
  id: string;
  name: string;
  category: DocumentCategory;
  status: DocumentStatus;
  notes: string;
  college?: string; // optional: which college this is for
  addedAt: string;
  updatedAt: string;
}

export const DOCUMENT_CATEGORIES: Record<DocumentCategory, { label: string; emoji: string }> = {
  transcript: { label: 'Transcript', emoji: '📄' },
  test_scores: { label: 'Test Scores', emoji: '📊' },
  recommendation: { label: 'Recommendation', emoji: '✉️' },
  essay: { label: 'Essay', emoji: '📝' },
  resume: { label: 'Resume', emoji: '📋' },
  financial: { label: 'Financial Aid', emoji: '💰' },
  other: { label: 'Other', emoji: '📁' },
};

export const DOCUMENT_STATUSES: Record<DocumentStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  complete: { label: 'Complete', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
};
