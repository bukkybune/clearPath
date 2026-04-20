import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import type { AppColors } from '../theme/colors';

const TOOLS = [
  {
    id: 'investment',
    icon: 'trending-up-outline' as const,
    title: 'Investment Simulator',
    description: 'See how compound interest grows your money over time with monthly contributions.',
    variant: 'primary',
    screen: 'InvestmentSimulator',
    tag: 'Growth',
  },
  {
    id: 'debt',
    icon: 'trending-down-outline' as const,
    title: 'Debt Payoff Simulator',
    description: 'Calculate how long it takes to pay off student loans or credit card debt.',
    variant: 'danger',
    screen: 'DebtSimulator',
    tag: 'Payoff',
  },
];

const TIPS = [
  { icon: 'bulb-outline' as const, text: 'Starting to invest early — even $25/month — can build serious wealth by retirement.' },
  { icon: 'calculator-outline' as const, text: 'Paying just $50 extra per month on a student loan can save thousands in interest.' },
  { icon: 'stats-chart-outline' as const, text: 'Compound interest works both ways — it grows your savings and your debt.' },
];

export default function ToolsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const s = useMemo(() => styles(colors), [colors]);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Financial Tools</Text>
        <Text style={s.headerSub}>Run scenarios before making real decisions.</Text>
      </View>

      {/* Tool Cards */}
      <View style={s.sectionHeader}>
        <Ionicons name="construct-outline" size={15} color={colors.primary} />
        <Text style={s.sectionTitle}>Calculators</Text>
      </View>

      {TOOLS.map(tool => {
        const isDanger = tool.variant === 'danger';
        const accent = isDanger ? colors.danger : colors.primary;
        const bg = isDanger ? colors.dangerLight : colors.primaryLight;
        return (
          <TouchableOpacity
            key={tool.id}
            style={s.card}
            onPress={() => navigation.navigate(tool.screen)}
            activeOpacity={0.75}
          >
            <View style={[s.iconBox, { backgroundColor: bg }]}>
              <Ionicons name={tool.icon} size={26} color={accent} />
            </View>
            <View style={s.cardMeta}>
              <View style={s.cardTitleRow}>
                <Text style={s.cardTitle}>{tool.title}</Text>
                <View style={[s.tag, { backgroundColor: bg }]}>
                  <Text style={[s.tagText, { color: accent }]}>{tool.tag}</Text>
                </View>
              </View>
              <Text style={s.cardDesc}>{tool.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        );
      })}

      {/* Did You Know */}
      <View style={[s.sectionHeader, { marginTop: 8 }]}>
        <Ionicons name="information-circle-outline" size={15} color={colors.primary} />
        <Text style={s.sectionTitle}>Did You Know?</Text>
      </View>

      <View style={s.tipsCard}>
        {TIPS.map((tip, i) => (
          <View key={i} style={[s.tipRow, i > 0 && s.tipBorder]}>
            <View style={s.tipIcon}>
              <Ionicons name={tip.icon} size={18} color={colors.primary} />
            </View>
            <Text style={s.tipText}>{tip.text}</Text>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },

  header: { marginBottom: 24 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  headerSub: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 },

  card: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  iconBox: { width: 54, height: 54, borderRadius: 14, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  cardMeta: { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, flexShrink: 1 },
  tag: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2, flexShrink: 0 },
  tagText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  cardDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },

  tipsCard: { backgroundColor: colors.surface, borderRadius: 14, overflow: 'hidden' },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14 },
  tipBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  tipIcon: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  tipText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, flex: 1 },
});
