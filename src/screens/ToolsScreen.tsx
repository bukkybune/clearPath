import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const TOOLS = [
  {
    id: 'investment',
    icon: 'trending-up-outline' as const,
    title: 'Investment Simulator',
    description: 'See how compound interest grows your money over time with monthly contributions.',
    variant: 'primary',
    screen: 'InvestmentSimulator',
  },
  {
    id: 'debt',
    icon: 'trending-down-outline' as const,
    title: 'Debt Payoff Simulator',
    description: 'Calculate how long it takes to pay off student loans or credit card debt.',
    variant: 'danger',
    screen: 'DebtSimulator',
  },
];

export default function ToolsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const s = styles(colors);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.subtitle}>Financial calculators to help you plan ahead.</Text>

      {TOOLS.map(tool => {
        const isDanger = tool.variant === 'danger';
        return (
          <TouchableOpacity
            key={tool.id}
            style={s.card}
            onPress={() => navigation.navigate(tool.screen)}
            activeOpacity={0.75}
          >
            <View style={[s.iconBox, { backgroundColor: isDanger ? colors.dangerLight : colors.primaryLight }]}>
              <Ionicons
                name={tool.icon}
                size={26}
                color={isDanger ? colors.danger : colors.primary}
              />
            </View>
            <View style={s.cardMeta}>
              <Text style={s.cardTitle}>{tool.title}</Text>
              <Text style={s.cardDesc}>{tool.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 20, lineHeight: 20 },
  card: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  iconBox: { width: 54, height: 54, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  cardMeta: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  cardDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
});
