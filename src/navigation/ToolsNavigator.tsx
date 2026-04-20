import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import ToolsScreen from '../screens/ToolsScreen';
import InvestmentSimulatorScreen from '../screens/InvestmentSimulatorScreen';
import DebtScreen from '../screens/DebtScreen';
import type { ToolsStackParamList } from './types';

const Stack = createNativeStackNavigator<ToolsStackParamList>();

export default function ToolsNavigator() {
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
      <Stack.Screen name="ToolsHub" component={ToolsScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="InvestmentSimulator"
        component={InvestmentSimulatorScreen}
        options={{ title: 'Investment Simulator' }}
      />
      <Stack.Screen
        name="DebtSimulator"
        component={DebtScreen}
        options={{ title: 'Debt Simulator' }}
      />
    </Stack.Navigator>
  );
}
