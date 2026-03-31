import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

/**
 * Subscribes to Firebase auth state changes.
 * Always reflects the current authenticated user, even after
 * token refresh or sign-out — unlike reading auth.currentUser directly,
 * which can be null on the first render before Firebase restores the session.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return { user, uid: user?.uid ?? null };
}
