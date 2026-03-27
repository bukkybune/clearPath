export interface LevelInfo {
  level: string;
  nextLevel: string;
  pointsToNext: number;
  progress: number; // 0–1 within the current level band
}

const LEVELS = [
  { name: 'Beginner',      min: 0,    max: 199  },
  { name: 'Learner',       min: 200,  max: 499  },
  { name: 'Saver',         min: 500,  max: 999  },
  { name: 'Investor',      min: 1000, max: 1999 },
  { name: 'Financial Pro', min: 2000, max: Infinity },
];

export function getLevelInfo(points: number): LevelInfo {
  const idx = LEVELS.findIndex(l => points <= l.max);
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1];

  if (!next) {
    return { level: current.name, nextLevel: '', pointsToNext: 0, progress: 1 };
  }

  const range = next.min - current.min;
  const earned = points - current.min;

  return {
    level: current.name,
    nextLevel: next.name,
    pointsToNext: next.min - points,
    progress: Math.min(Math.max(earned / range, 0), 1),
  };
}
