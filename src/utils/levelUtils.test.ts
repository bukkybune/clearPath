/** @jest-environment node */
import { getLevelInfo } from './levelUtils';

describe('getLevelInfo', () => {
  describe('level assignment', () => {
    it('returns Beginner at 0 pts', () => {
      expect(getLevelInfo(0).level).toBe('Beginner');
    });

    it('returns Beginner at 199 pts (upper boundary)', () => {
      expect(getLevelInfo(199).level).toBe('Beginner');
    });

    it('returns Learner at 200 pts (lower boundary)', () => {
      expect(getLevelInfo(200).level).toBe('Learner');
    });

    it('returns Learner at 499 pts (upper boundary)', () => {
      expect(getLevelInfo(499).level).toBe('Learner');
    });

    it('returns Saver at 500 pts', () => {
      expect(getLevelInfo(500).level).toBe('Saver');
    });

    it('returns Investor at 1000 pts', () => {
      expect(getLevelInfo(1000).level).toBe('Investor');
    });

    it('returns Financial Pro at 2000 pts', () => {
      expect(getLevelInfo(2000).level).toBe('Financial Pro');
    });

    it('returns Financial Pro above max threshold', () => {
      expect(getLevelInfo(9999).level).toBe('Financial Pro');
    });
  });

  describe('progress bar (0–1)', () => {
    it('is 0 at the start of a level band', () => {
      expect(getLevelInfo(0).progress).toBe(0);
      expect(getLevelInfo(200).progress).toBe(0);
      expect(getLevelInfo(500).progress).toBe(0);
    });

    it('is 1 at max level', () => {
      expect(getLevelInfo(2000).progress).toBe(1);
      expect(getLevelInfo(9999).progress).toBe(1);
    });

    it('is between 0 and 1 for mid-band points', () => {
      const { progress } = getLevelInfo(350); // mid-Learner
      expect(progress).toBeGreaterThan(0);
      expect(progress).toBeLessThan(1);
    });
  });

  describe('next level & points to next', () => {
    it('shows next level name for non-max levels', () => {
      expect(getLevelInfo(0).nextLevel).toBe('Learner');
      expect(getLevelInfo(200).nextLevel).toBe('Saver');
      expect(getLevelInfo(500).nextLevel).toBe('Investor');
      expect(getLevelInfo(1000).nextLevel).toBe('Financial Pro');
    });

    it('has no next level at max', () => {
      expect(getLevelInfo(2000).nextLevel).toBe('');
      expect(getLevelInfo(2000).pointsToNext).toBe(0);
    });

    it('pointsToNext decreases as points increase within a band', () => {
      const a = getLevelInfo(100).pointsToNext;
      const b = getLevelInfo(150).pointsToNext;
      expect(b).toBeLessThan(a);
    });
  });
});
