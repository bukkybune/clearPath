import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import BudgetScreen from '../screens/BudgetScreen';
import LearnNavigator from './LearnNavigator';
import ToolsNavigator from './ToolsNavigator';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TABS: { name: string; icon: IoniconName; activeIcon: IoniconName }[] = [
  { name: 'Home',    icon: 'home-outline',      activeIcon: 'home' },
  { name: 'Budget',  icon: 'wallet-outline',    activeIcon: 'wallet' },
  { name: 'Learn',   icon: 'book-outline',      activeIcon: 'book' },
  { name: 'Tools',   icon: 'construct-outline', activeIcon: 'construct' },
  { name: 'Profile', icon: 'person-outline',    activeIcon: 'person' },
];

const SCREENS: Record<string, React.ComponentType<any>> = {
  Home:    HomeScreen,
  Budget:  BudgetScreen,
  Learn:   LearnNavigator,
  Tools:   ToolsNavigator,
  Profile: ProfileScreen,
};

export default function AppNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tab = TABS.find(t => t.name === route.name)!;
        return {
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? tab.activeIcon : tab.icon} size={size} color={color} />
          ),
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.tabBarBorder,
            borderTopWidth: 1,
            height: 65,
            paddingBottom: 10,
            paddingTop: 6,
            elevation: 0,
          },
          tabBarBackground: () => null,
          tabBarActiveTintColor: colors.tabActive,
          tabBarInactiveTintColor: colors.tabInactive,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        };
      }}
    >
      {TABS.map(tab => (
        <Tab.Screen key={tab.name} name={tab.name} component={SCREENS[tab.name]} />
      ))}
    </Tab.Navigator>
  );
}
