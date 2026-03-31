import React, { useEffect, useState } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { onAuthStateChanged, User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { auth } from './src/firebase/firebaseConfig';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { ProgressProvider } from './src/context/ProgressContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';

function RootNavigator() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { isDark, colors } = useTheme();

  useEffect(() => {
    const init = async () => {
      try {
        const seen = await AsyncStorage.getItem('onboarding_complete');
        if (!seen) setShowOnboarding(true);
      } catch (e) { console.error(e); }

      const unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      });
      return unsub;
    };
    init();
  }, []);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={completeOnboarding} />;
  }

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      {user ? <ProgressProvider><AppNavigator /></ProgressProvider> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
