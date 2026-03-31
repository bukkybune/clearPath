/** @jest-environment node */
import { sampleQuestions } from './quizUtils';
import type { Question } from './quizUtils';

const BANK: Question[] = [
  { question: 'Q1', options: ['A', 'B', 'C', 'D'], answer: 0 },
  { question: 'Q2', options: ['A', 'B', 'C', 'D'], answer: 1 },
  { question: 'Q3', options: ['A', 'B', 'C', 'D'], answer: 2 },
  { question: 'Q4', options: ['A', 'B', 'C', 'D'], answer: 3 },
  { question: 'Q5', options: ['A', 'B', 'C', 'D'], answer: 0 },
];

describe('sampleQuestions', () => {
  it('returns exactly count questions when bank is larger', () => {
    const result = sampleQuestions(BANK, 3);
    expect(result).toHaveLength(3);
  });

  it('returns all questions when count >= bank length', () => {
    const result = sampleQuestions(BANK, 10);
    expect(result).toHaveLength(BANK.length);
  });

  it('returns 0 questions for an empty bank', () => {
    expect(sampleQuestions([], 3)).toHaveLength(0);
  });

  it('does not mutate the original bank', () => {
    const original = BANK.map(q => ({ ...q, options: [...q.options] }));
    sampleQuestions(BANK, 3);
    BANK.forEach((q, i) => {
      expect(q.question).toBe(original[i].question);
      expect(q.answer).toBe(original[i].answer);
    });
  });

  it('returns no duplicate questions in a single sample', () => {
    const result = sampleQuestions(BANK, 5);
    const questions = result.map(q => q.question);
    const unique = new Set(questions);
    expect(unique.size).toBe(questions.length);
  });

  it('answer index points to the correct option text after shuffle', () => {
    // Run many times to shake out any shuffle ordering issue.
    for (let i = 0; i < 50; i++) {
      const [q] = sampleQuestions(
        [{ question: 'Test', options: ['Wrong1', 'Correct', 'Wrong2', 'Wrong3'], answer: 1 }],
        1,
      );
      expect(q.options[q.answer]).toBe('Correct');
    }
  });

  it('all returned answer indices are within options bounds', () => {
    const result = sampleQuestions(BANK, 5);
    result.forEach(q => {
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.options.length);
    });
  });
});
