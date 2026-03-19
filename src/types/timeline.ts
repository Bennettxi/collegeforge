export interface TimelineEvent {
  id: string;
  title: string;
  date: string; // ISO date string
  category: 'deadline' | 'milestone' | 'task';
  completed: boolean;
  notes?: string;
}

export const CATEGORY_CONFIG: Record<TimelineEvent['category'], { label: string; color: string; emoji: string }> = {
  deadline: { label: 'Deadline', color: 'text-red-600', emoji: '⏰' },
  milestone: { label: 'Milestone', color: 'text-emerald-600', emoji: '🏁' },
  task: { label: 'Task', color: 'text-blue-600', emoji: '📋' },
};
