import { useProgress } from '../context/ProgressContext';

export function usePoints() {
  const { loading, points, streak, lastActiveDate, awardedMilestones, addPoints, awardMilestone } = useProgress();
  return { loading, points, streak, lastActiveDate, awardedMilestones, addPoints, awardMilestone };
}
