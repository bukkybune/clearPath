import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, arrayUnion, increment } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

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

function dateStr(d: Date) {
  return d.toISOString().split('T')[0];
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [readGuides, setReadGuides] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [awardedMilestones, setAwardedMilestones] = useState<string[]>([]);
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

        // Build the Firestore update in one write
        const firestoreUpdate: Record<string, any> = {};
        if (last !== today) {
          firestoreUpdate.streak = newStreak;
          firestoreUpdate.lastActiveDate = today;
        }

        // Streak-7 milestone — check at launch using Firestore data
        let launchBonusPoints = data.points ?? 0;
        const newAwarded = [...awarded];
        if (newStreak >= 7 && !awarded.includes('streak_7')) {
          launchBonusPoints += 50;
          newAwarded.push('streak_7');
          firestoreUpdate.awardedMilestones = arrayUnion('streak_7');
          firestoreUpdate.points = increment(50);
          setAwardedMilestones(newAwarded);
        }

        setPoints(launchBonusPoints);

        if (Object.keys(firestoreUpdate).length > 0) {
          setDoc(doc(db, 'userProgress', uid), firestoreUpdate, { merge: true })
            .catch(e => console.error('Failed to update progress on launch:', e));
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [uid]);

  const markComplete = async (lessonId: string) => {
    if (completed.includes(lessonId)) return;
    setCompleted(prev => [...prev, lessonId]);
    if (uid) {
      try {
        await setDoc(
          doc(db, 'userProgress', uid),
          { completedLessons: arrayUnion(lessonId) },
          { merge: true },
        );
      } catch (e) {
        console.error('Failed to persist lesson completion:', e);
      }
    }
  };

  const markGuideRead = async (guideId: string) => {
    if (readGuides.includes(guideId)) return;
    setReadGuides(prev => [...prev, guideId]);
    if (uid) {
      try {
        await setDoc(
          doc(db, 'userProgress', uid),
          { readGuides: arrayUnion(guideId) },
          { merge: true },
        );
      } catch (e) {
        console.error('Failed to persist guide read:', e);
      }
    }
  };

  const addPoints = async (amount: number) => {
    setPoints(prev => prev + amount);
    if (uid) {
      try {
        await setDoc(
          doc(db, 'userProgress', uid),
          { points: increment(amount) },
          { merge: true },
        );
      } catch (e) {
        console.error('Failed to add points:', e);
      }
    }
  };

  const awardMilestone = async (id: string, bonusPoints: number) => {
    if (awardedMilestones.includes(id)) return;
    setAwardedMilestones(prev => [...prev, id]);
    setPoints(prev => prev + bonusPoints);
    if (uid) {
      try {
        await setDoc(
          doc(db, 'userProgress', uid),
          { awardedMilestones: arrayUnion(id), points: increment(bonusPoints) },
          { merge: true },
        );
      } catch (e) {
        console.error(`Failed to award milestone ${id}:`, e);
      }
    }
  };

  return (
    <ProgressContext.Provider value={{
      completed, readGuides, loading,
      points, streak, lastActiveDate,
      awardedMilestones,
      markComplete, markGuideRead, addPoints, awardMilestone,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextType {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider');
  return ctx;
}
