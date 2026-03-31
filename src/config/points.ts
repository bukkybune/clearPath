export const POINTS = {
  LESSON_COMPLETE: 100,
  GUIDE_READ: 25,
  TRANSACTION: 10,
  BUDGET_BONUS: 50,
  MILESTONE_FIRST_TRANSACTION: 20,
  MILESTONE_STREAK_7: 50,
  MILESTONE_ALL_LESSONS: 200,
} as const;

export const MILESTONE_IDS = {
  FIRST_TRANSACTION: 'first_transaction',
  STREAK_7: 'streak_7',
  ALL_LESSONS: 'all_lessons',
} as const;

export const LESSON_IDS = {
  PORTFOLIO: '3',
} as const;
