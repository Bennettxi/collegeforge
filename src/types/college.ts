export interface College {
  id: string;
  name: string;
  tier: CollegeTier;
  deadline?: string; // ISO date
  applicationStatus: ApplicationStatus;
  notes: string;
  addedAt: string;
}

export type CollegeTier = 'reach' | 'match' | 'safety';
export type ApplicationStatus = 'researching' | 'applying' | 'applied' | 'accepted' | 'rejected' | 'waitlisted' | 'committed';

export const TIER_CONFIG: Record<CollegeTier, { label: string; color: string; bgColor: string; emoji: string }> = {
  reach: { label: 'Reach', color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-200', emoji: '🎯' },
  match: { label: 'Match', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', emoji: '✅' },
  safety: { label: 'Safety', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200', emoji: '🛡️' },
};

export const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string }> = {
  researching: { label: 'Researching', color: 'text-gray-500' },
  applying: { label: 'Applying', color: 'text-amber-600' },
  applied: { label: 'Applied', color: 'text-blue-600' },
  accepted: { label: 'Accepted!', color: 'text-emerald-600' },
  rejected: { label: 'Rejected', color: 'text-red-500' },
  waitlisted: { label: 'Waitlisted', color: 'text-orange-500' },
  committed: { label: 'Committed!', color: 'text-emerald-700' },
};
