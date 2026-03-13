import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import LearnScreen from '../screens/LearnScreen';
import LessonScreen from '../screens/LessonScreen';

const Stack = createNativeStackNavigator();

export default function LearnNavigator() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="LearnHome" component={LearnScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Lesson" component={LessonScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
}