export interface Question {
  question: string;
  options: string[];
  answer: number; // index into options[]
}

/** Fisher-Yates in-place shuffle — O(n), unbiased */
function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Shuffles a question's answer options and updates the answer index to match.
 * This ensures every attempt presents options in a different order.
 */
function shuffleOptions(q: Question): Question {
  const tagged = q.options.map((opt, i) => ({ opt, isAnswer: i === q.answer }));
  shuffleInPlace(tagged);
  return {
    question: q.question,
    options: tagged.map(t => t.opt),
    answer: tagged.findIndex(t => t.isAnswer),
  };
}

/**
 * Returns `count` randomly sampled questions from `bank`, each with shuffled options.
 * If the bank has fewer questions than `count`, returns all of them.
 */
export function sampleQuestions(bank: Question[], count: number): Question[] {
  return shuffleInPlace([...bank])
    .slice(0, Math.min(count, bank.length))
    .map(shuffleOptions);
}
