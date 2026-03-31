import type { Question } from '../utils/quizUtils';

// A minimal shape for a topic/guide passed through navigation.
// We use a loose record rather than importing the full lessons type
// to keep navigation types decoupled from lesson data.
export type NavigationTopic = {
  id: string;
  title: string;
  summary: string;
  content: string;
  icon: string;
  duration: string;
  type?: 'lesson' | 'guide';
  quiz?: Question[];
  keyPoints?: string[];
};

export type HomeStackParamList = {
  HomeMain: undefined;
  Profile: undefined;
};

export type LearnStackParamList = {
  LearnHome: undefined;
  Lesson: { topic: NavigationTopic; questionBank?: Question[] };
};

export type ToolsStackParamList = {
  ToolsHub: undefined;
  InvestmentSimulator: undefined;
  DebtSimulator: undefined;
};
