import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Alert } from 'react-native';
import { auth, db } from './firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? '';

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: WEB_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID || undefined,
  });

  const handleGoogleSignIn = async () => {
    try {
      const result = await promptAsync();
      if (result?.type !== 'success') return;

      const { id_token } = result.params;
      const credential = GoogleAuthProvider.credential(id_token);
      const { user } = await signInWithCredential(auth, credential);

      // Save user to Firestore if first time
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      Alert.alert('Sign-In Failed', err.message || 'Unable to sign in with Google. Please try again.');
    }
  };

  return { request, handleGoogleSignIn };
}
