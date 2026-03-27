import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

interface ProgressContextType {
  completed: string[];
  readGuides: string[];
  loading: boolean;
  markComplete: (lessonId: string) => Promise<void>;
  markGuideRead: (guideId: string) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [readGuides, setReadGuides] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    getDoc(doc(db, 'userProgress', uid))
      .then(snap => {
        if (snap.exists()) {
          setCompleted(snap.data().completedLessons ?? []);
          setReadGuides(snap.data().readGuides ?? []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [uid]);

  const markComplete = async (lessonId: string) => {
    if (completed.includes(lessonId)) return;
    setCompleted(prev => [...prev, lessonId]); // optimistic
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
    setReadGuides(prev => [...prev, guideId]); // optimistic
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

  return (
    <ProgressContext.Provider value={{ completed, readGuides, loading, markComplete, markGuideRead }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextType {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider');
  return ctx;
}
