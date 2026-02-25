import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import BudgetScreen from '../screens/BudgetScreen';
import DebtScreen from '../screens/DebtScreen';
import LearnScreen from '../screens/LearnScreen';

const Tab = createBottomTabNavigator();

const icon = (label: string, focused: boolean) => {
  const icons: Record<string, string> = {
    Home: '🏠', Budget: '💰', Debt: '📉', Learn: '📚',
  };
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icons[label]}</Text>;
};

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => icon(route.name, focused),
        tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1e293b', height: 65, paddingBottom: 8 },
        tabBarActiveTintColor: '#38bdf8',
        tabBarInactiveTintColor: '#475569',
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#f1f5f9',
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Debt" component={DebtScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
    </Tab.Navigator>
  );
}