export interface AvatarLevel {
  level: number;
  name: string;
  description: string;
  minScore: number;
  glowColor: string;
  bgGradient: string;
}

export const AVATAR_LEVELS: AvatarLevel[] = [
  {
    level: 1,
    name: 'Seedling',
    description: 'Every great journey begins here',
    minScore: 0,
    glowColor: '#fbbf24',
    bgGradient: 'from-amber-50 to-orange-50',
  },
  {
    level: 2,
    name: 'Sprout',
    description: 'Growing stronger! Your roots are taking hold',
    minScore: 25,
    glowColor: '#4ade80',
    bgGradient: 'from-green-50 to-emerald-50',
  },
  {
    level: 3,
    name: 'Sapling',
    description: 'Your application is really taking shape',
    minScore: 45,
    glowColor: '#34d399',
    bgGradient: 'from-emerald-50 to-teal-50',
  },
  {
    level: 4,
    name: 'Tree',
    description: 'Impressive! Colleges will take notice',
    minScore: 65,
    glowColor: '#22d3ee',
    bgGradient: 'from-cyan-50 to-blue-50',
  },
  {
    level: 5,
    name: 'Mighty Oak',
    description: 'Outstanding! Your application stands tall',
    minScore: 85,
    glowColor: '#a78bfa',
    bgGradient: 'from-violet-50 to-purple-50',
  },
];

export function getAvatarLevel(score: number): AvatarLevel {
  for (let i = AVATAR_LEVELS.length - 1; i >= 0; i--) {
    if (score >= AVATAR_LEVELS[i].minScore) {
      return AVATAR_LEVELS[i];
    }
  }
  return AVATAR_LEVELS[0];
}
