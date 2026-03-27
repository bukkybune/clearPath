import { useProgress } from '../context/ProgressContext';

export function usePoints() {
  const { points, streak, lastActiveDate, awardedMilestones, addPoints, awardMilestone } = useProgress();
  return { points, streak, lastActiveDate, awardedMilestones, addPoints, awardMilestone };
}
