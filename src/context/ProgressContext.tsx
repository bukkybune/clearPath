import React, {
  createContext, useContext, useState, useEffect,
  useRef, useCallback, useMemo,
} from 'react';
import { Alert } from 'react-native';
import { doc, getDoc, setDoc, arrayUnion, increment } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';
import { POINTS, MILESTONE_IDS } from '../config/points';

interface ProgressContextType {
  completed: string[];
  readGuides: string[];
  loading: boolean;
  points: number;
  streak: number;
  lastActiveDate: string | null;
  awardedMilestones: string[];
  markComplete: (lessonId: string) => Promise<void>;
  markGuideRead: (guideId: string) => Promise<void>;
  addPoints: (amount: number) => Promise<void>;
  awardMilestone: (id: string, bonusPoints: number) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

// Uses local date components so the day reflects the user's timezone, not UTC.
function dateStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function showWriteError(action: string) {
  Alert.alert(
    'Connection Issue',
    `Couldn't save your ${action}. Check your connection — your progress may not be recorded.`,
  );
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [readGuides, setReadGuides] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [awardedMilestones, setAwardedMilestones] = useState<string[]>([]);

  // Ref mirrors awardedMilestones state so awardMilestone always reads the
  // latest value even when called from a stale closure.
  const awardedMilestonesRef = useRef<string[]>([]);

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) { setLoading(false); return; }

    const today = dateStr(new Date());
    const yday = new Date();
    yday.setDate(yday.getDate() - 1);
    const yesterday = dateStr(yday);

    getDoc(doc(db, 'userProgress', uid))
      .then(snap => {
        const data = snap.exists() ? snap.data() : {};

        setCompleted(data.completedLessons ?? []);
        setReadGuides(data.readGuides ?? []);

        const awarded: string[] = data.awardedMilestones ?? [];
        setAwardedMilestones(awarded);
        awardedMilestonesRef.current = awarded;

        const last: string | null = data.lastActiveDate ?? null;
        let newStreak: number = data.streak ?? 0;

        if (!last) {
          newStreak = 1;
        } else if (last < yesterday) {
          newStreak = 1;
        } else if (last === yesterday) {
          newStreak = (data.streak ?? 0) + 1;
        }

        setStreak(newStreak);
        setLastActiveDate(today);

        const firestoreUpdate: Record<string, any> = {};
        if (last !== today) {
          firestoreUpdate.streak = newStreak;
          firestoreUpdate.lastActiveDate = today;
        }

        // Streak-7 milestone — evaluated at launch against Firestore data
        let launchPoints = data.points ?? 0;
        const newAwarded = [...awarded];
        if (newStreak >= 7 && !awarded.includes(MILESTONE_IDS.STREAK_7)) {
          launchPoints += POINTS.MILESTONE_STREAK_7;
          newAwarded.push(MILESTONE_IDS.STREAK_7);
          firestoreUpdate.awardedMilestones = arrayUnion(MILESTONE_IDS.STREAK_7);
          firestoreUpdate.points = increment(POINTS.MILESTONE_STREAK_7);
          setAwardedMilestones(newAwarded);
          awardedMilestonesRef.current = newAwarded;
        }

        setPoints(launchPoints);

        if (Object.keys(firestoreUpdate).length > 0) {
          setDoc(doc(db, 'userProgress', uid), firestoreUpdate, { merge: true })
            .catch(() => showWriteError('streak'));
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [uid]);

  const markComplete = useCallback(async (lessonId: string) => {
    let shouldPersist = false;
    setCompleted(prev => {
      if (prev.includes(lessonId)) return prev;
      shouldPersist = true;
      return [...prev, lessonId];
    });
    if (shouldPersist && uid) {
      try {
        await setDoc(
          doc(db, 'userProgress', uid),
          { completedLessons: arrayUnion(lessonId) },
          { merge: true },
        );
      } catch {
        showWriteError('lesson completion');
      }
    }
  }, [uid]);

  const markGuideRead = useCallback(async (guideId: string) => {
    let shouldPersist = false;
    setReadGuides(prev => {
      if (prev.includes(guideId)) return prev;
      shouldPersist = true;
      return [...prev, guideId];
    });
    if (shouldPersist && uid) {
      try {
        await setDoc(
          doc(db, 'userProgress', uid),
          { readGuides: arrayUnion(guideId) },
          { merge: true },
        );
      } catch {
        showWriteError('guide progress');
      }
    }
  }, [uid]);

  const addPoints = useCallback(async (amount: number) => {
    setPoints(prev => prev + amount);
    if (uid) {
      try {
        await setDoc(
          doc(db, 'userProgress', uid),
          { points: increment(amount) },
          { merge: true },
        );
      } catch {
        showWriteError('points');
      }
    }
  }, [uid]);

  const awardMilestone = useCallback(async (id: string, bonusPoints: number) => {
    // Check ref first — always current regardless of closure age.
    if (awardedMilestonesRef.current.includes(id)) return;
    setAwardedMilestones(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      awardedMilestonesRef.current = next;
      return next;
    });
    setPoints(prev => prev + bonusPoints);
    if (uid) {
      try {
        await setDoc(
          doc(db, 'userProgress', uid),
          { awardedMilestones: arrayUnion(id), points: increment(bonusPoints) },
          { merge: true },
        );
      } catch {
        showWriteError(`milestone reward`);
      }
    }
  }, [uid]);

  const value = useMemo(() => ({
    completed, readGuides, loading,
    points, streak, lastActiveDate,
    awardedMilestones,
    markComplete, markGuideRead, addPoints, awardMilestone,
  }), [
    completed, readGuides, loading,
    points, streak, lastActiveDate,
    awardedMilestones,
    markComplete, markGuideRead, addPoints, awardMilestone,
  ]);

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextType {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider');
  return ctx;
}
