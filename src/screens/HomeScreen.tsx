import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, query, where, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { useTheme } from '../context/ThemeContext';
import { usePoints } from '../hooks/usePoints';
import { getLevelInfo } from '../utils/levelUtils';
import { TOPICS } from './LearnScreen';

const TIPS = [
  "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
  "Even saving $5/day adds up to $1,825 a year.",
  "Pay yourself first — save before you spend.",
  "Avoid lifestyle inflation as your income grows.",
  "An emergency fund of $1,000 can prevent most financial crises.",
  "Check your credit score regularly — it's free and important.",
];

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface Transaction {
  id: string;
  category: string;
  amount: number;
  description?: string;
  createdAt?: string;
  type?: 'expense' | 'income';
}

export default function HomeScreen({ navigation }: any) {
  const { colors } = useTheme();
  const s = styles(colors);
  const user = auth.currentUser;
  const uid = user?.uid;

  const { points, streak, lastActiveDate } = usePoints();
  const levelInfo = getLevelInfo(points);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [oldExpenses, setOldExpenses] = useState<Transaction[]>([]);
  const [nextLesson, setNextLesson] = useState<typeof TOPICS[0] | null | undefined>(undefined);
  const [tip] = useState(TIPS[Math.floor(Math.random() * TIPS.length)]);

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'transactions'), where('uid', '==', uid));
    return onSnapshot(q, snap => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
    });
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'expenses'), where('uid', '==', uid));
    return onSnapshot(q, snap => {
      setOldExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() as any, type: 'expense' })));
    });
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, 'userProgress', uid)).then(snap => {
      const completed: string[] = snap.exists() ? (snap.data().completedLessons ?? []) : [];
      setNextLesson(TOPICS.find(t => !completed.includes(t.id)) ?? null);
    });
  }, [uid]);

  const now = new Date();
  const filterThisMonth = (items: Transaction[]) =>
    items.filter(t => {
      if (!t.createdAt) return false;
      const d = new Date(t.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

  const allExpenses = [...transactions.filter(t => t.type === 'expense'), ...oldExpenses];
  const allIncome = transactions.filter(t => t.type === 'income');

  const monthlyExpenses = filterThisMonth(allExpenses);
  const monthlyIncome = filterThisMonth(allIncome);

  const totalExpenses = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = monthlyIncome.reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  const inTheGreen = netBalance >= 0;

  const recentExpenses = [...monthlyExpenses]
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 3);

  // Fixed Su→Sa week: determine which days of the current week are active
  const streakDots = Array.from({ length: 7 }, (_, dow) => {
    // dow: 0=Sun … 6=Sat
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay()); // start of this week (Sunday)
    sunday.setHours(0, 0, 0, 0);
    const cellDate = new Date(sunday);
    cellDate.setDate(sunday.getDate() + dow);
    if (cellDate > now) return false; // future days are always empty
    if (!lastActiveDate) return false;
    const last = new Date(lastActiveDate + 'T00:00:00');
    const diffDays = Math.round((last.getTime() - cellDate.getTime()) / 86400000);
    return diffDays >= 0 && diffDays < streak;
  });

  // Streak label
  const streakLabel =
    streak === 0 ? 'Start your streak today!' :
    streak === 1 ? "You're on a roll, keep going!" :
    streak < 7  ? `${streak} days strong — don't break it!` :
                  `${streak} day streak — incredible! 🏆`;

  const avatar = ((user?.displayName || user?.email || 'S')[0]).toUpperCase();

  const QUICK_ACTIONS = [
    { icon: 'wallet-outline' as const,      label: 'Track your spending',       sub: 'Budget', tab: 'Budget' },
    { icon: 'trending-up-outline' as const, label: 'Simulate investment growth', sub: 'Tools',  tab: 'Tools'  },
    { icon: 'book-outline' as const,        label: 'Learn finance basics',       sub: 'Learn',  tab: 'Learn'  },
  ];

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Welcome back,</Text>
          <Text style={s.name}>{user?.displayName || user?.email?.split('@')[0] || 'Student'}</Text>
        </View>
        <TouchableOpacity style={s.avatarBtn} onPress={() => navigation.navigate('Profile')}>
          <Text style={s.avatarBtnText}>{avatar}</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Balance Card */}
      <View style={s.heroCard}>
        <Text style={s.heroLabel}>Net Balance This Month</Text>
        <Text style={[s.heroAmount, { color: inTheGreen ? '#fff' : '#FCD34D' }]}>
          {inTheGreen ? '+' : ''}${Math.abs(netBalance).toFixed(2)}
        </Text>
        <Text style={s.heroSub}>
          {inTheGreen ? "You're in the green this month" : "Spending exceeds income this month"}
        </Text>
        <View style={s.heroDivider} />
        <View style={s.heroStats}>
          <View style={s.heroStat}>
            <Ionicons name="arrow-down-circle-outline" size={15} color="rgba(255,255,255,0.75)" />
            <Text style={s.heroStatLabel}>Income</Text>
            <Text style={s.heroStatValue}>${totalIncome.toFixed(0)}</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <Ionicons name="arrow-up-circle-outline" size={15} color="rgba(255,255,255,0.75)" />
            <Text style={s.heroStatLabel}>Spent</Text>
            <Text style={s.heroStatValue}>${totalExpenses.toFixed(0)}</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <Ionicons name="receipt-outline" size={15} color="rgba(255,255,255,0.75)" />
            <Text style={s.heroStatLabel}>Transactions</Text>
            <Text style={s.heroStatValue}>{monthlyExpenses.length}</Text>
          </View>
        </View>
      </View>

      {/* Streak Card */}
      <View style={s.streakCard}>
        <View style={s.streakTop}>
          <View style={s.streakLeft}>
            <Text style={s.streakFlame}>🔥</Text>
            <View>
              <Text style={s.streakCount}>{streak} <Text style={s.streakDayLabel}>day streak</Text></Text>
              <Text style={s.streakMsg}>{streakLabel}</Text>
            </View>
          </View>
          <View style={s.pointsBadge}>
            <Text style={s.pointsEmoji}>⭐</Text>
            <Text style={s.pointsValue}>{points}</Text>
            <Text style={s.pointsUnit}>pts</Text>
          </View>
        </View>
        <View style={s.dotsRow}>
          {streakDots.map((active, i) => (
            <View key={i} style={s.dotCol}>
              <View style={[s.dot, active && s.dotActive]} />
              <Text style={s.dotLabel}>{DAY_LABELS[i]}</Text>
            </View>
          ))}
        </View>
        <View style={s.levelBarBg}>
          <View style={[s.levelBarFill, { width: `${levelInfo.progress * 100}%` as any }]} />
        </View>
        <View style={s.levelLabelRow}>
          <Text style={s.levelName}>{levelInfo.level}</Text>
          {levelInfo.nextLevel ? (
            <Text style={s.levelNext}>{levelInfo.pointsToNext} pts to {levelInfo.nextLevel}</Text>
          ) : (
            <Text style={s.levelNext}>Max level 🏆</Text>
          )}
        </View>
      </View>

      {/* Continue Learning */}
      {nextLesson != null && (
        <TouchableOpacity
          style={s.learnCard}
          onPress={() => navigation.navigate('Learn')}
          activeOpacity={0.78}
        >
          <View style={s.learnIconBox}>
            <Ionicons name={nextLesson.icon as any} size={20} color={colors.primary} />
          </View>
          <View style={s.learnMeta}>
            <Text style={s.learnEyebrow}>Continue Learning</Text>
            <Text style={s.learnTitle}>{nextLesson.title}</Text>
            <Text style={s.learnSummary} numberOfLines={1}>{nextLesson.summary}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </TouchableOpacity>
      )}
      {nextLesson === null && (
        <View style={[s.learnCard, { gap: 12 }]}>
          <View style={[s.learnIconBox, { backgroundColor: colors.successLight }]}>
            <Ionicons name="trophy-outline" size={20} color={colors.success} />
          </View>
          <View style={s.learnMeta}>
            <Text style={[s.learnEyebrow, { color: colors.success }]}>All Done!</Text>
            <Text style={s.learnTitle}>All lessons completed</Text>
          </View>
        </View>
      )}

      {/* Tip of the Day */}
      <View style={s.card}>
        <View style={s.cardHeader}>
          <Ionicons name="bulb-outline" size={18} color={colors.primary} />
          <Text style={s.cardTitle}>Tip of the Day</Text>
        </View>
        <Text style={s.tipText}>{tip}</Text>
      </View>

      {/* Recent Expenses */}
      <View style={s.card}>
        <View style={s.cardHeader}>
          <Ionicons name="receipt-outline" size={18} color={colors.primary} />
          <Text style={s.cardTitle}>Recent Expenses</Text>
        </View>
        {recentExpenses.length === 0 ? (
          <Text style={s.emptyText}>No expenses yet this month. Start tracking in the Budget tab.</Text>
        ) : (
          recentExpenses.map(t => (
            <View key={t.id} style={s.txRow}>
              <View style={s.txLeft}>
                <View style={s.txDot} />
                <View>
                  <Text style={s.txCat}>{t.category}</Text>
                  {t.description ? <Text style={s.txDesc}>{t.description}</Text> : null}
                </View>
              </View>
              <Text style={s.txAmt}>-${t.amount.toFixed(2)}</Text>
            </View>
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={s.card}>
        <View style={s.cardHeader}>
          <Ionicons name="flash-outline" size={18} color={colors.primary} />
          <Text style={s.cardTitle}>Quick Actions</Text>
        </View>
        {QUICK_ACTIONS.map((a, i) => (
          <TouchableOpacity key={i} style={s.actionRow} onPress={() => navigation.navigate(a.tab)}>
            <Ionicons name={a.icon} size={18} color={colors.textSecondary} />
            <Text style={s.actionText}>{a.label}</Text>
            <Text style={s.actionSub}>{a.sub} →</Text>
          </TouchableOpacity>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 32 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 13, color: colors.textSecondary },
  name: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  avatarBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  avatarBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },

  // Hero
  heroCard: { backgroundColor: colors.primary, borderRadius: 20, padding: 22, marginBottom: 14 },
  heroLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 6 },
  heroAmount: { fontSize: 42, fontWeight: '800', letterSpacing: -1, marginBottom: 4 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 18 },
  heroDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 16 },
  heroStats: { flexDirection: 'row' },
  heroStat: { flex: 1, alignItems: 'center', gap: 3 },
  heroStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)' },
  heroStatValue: { fontSize: 15, fontWeight: '700', color: '#fff' },
  heroStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },

  // Streak Card
  streakCard: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 14,
  },
  streakTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  streakFlame: { fontSize: 36 },
  streakCount: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  streakDayLabel: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
  streakMsg: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },
  pointsBadge: {
    backgroundColor: colors.primaryLight, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 8,
    alignItems: 'center',
  },
  pointsEmoji: { fontSize: 16 },
  pointsValue: { fontSize: 18, fontWeight: '800', color: colors.primary },
  pointsUnit: { fontSize: 10, color: colors.primary, fontWeight: '600', textTransform: 'uppercase' },
  dotsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dotCol: { alignItems: 'center', gap: 4, flex: 1 },
  dot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.border,
    borderWidth: 2, borderColor: colors.border,
  },
  dotActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
    shadowColor: '#FF6B35', shadowOpacity: 0.4, shadowRadius: 4, elevation: 3,
  },
  dotLabel: { fontSize: 10, color: colors.textTertiary, fontWeight: '600' },
  levelBarBg: { height: 5, backgroundColor: colors.border, borderRadius: 3, marginTop: 14, marginBottom: 6 },
  levelBarFill: { height: 5, backgroundColor: colors.primary, borderRadius: 3 },
  levelLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  levelName: { fontSize: 11, fontWeight: '700', color: colors.primary },
  levelNext: { fontSize: 11, color: colors.textTertiary },

  // Continue Learning
  learnCard: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginBottom: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  learnIconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center',
  },
  learnMeta: { flex: 1 },
  learnEyebrow: { fontSize: 11, fontWeight: '600', color: colors.primary, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  learnTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  learnSummary: { fontSize: 12, color: colors.textSecondary },

  // Cards
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  tipText: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  emptyText: { fontSize: 13, color: colors.textTertiary, lineHeight: 20 },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  txDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  txCat: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  txDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  txAmt: { fontSize: 14, fontWeight: '600', color: colors.danger },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  actionText: { flex: 1, fontSize: 14, color: colors.textSecondary },
  actionSub: { fontSize: 12, color: colors.primary, fontWeight: '600' },
});
