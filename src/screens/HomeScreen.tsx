import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { useTheme } from '../context/ThemeContext';

const TIPS = [
  "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
  "Even saving $5/day adds up to $1,825 a year.",
  "Pay yourself first — save before you spend.",
  "Avoid lifestyle inflation as your income grows.",
  "An emergency fund of $1,000 can prevent most financial crises.",
  "Check your credit score regularly — it's free and important.",
];

interface Expense { id: string; category: string; amount: number; description: string; createdAt: string; }

export default function HomeScreen() {
  const { colors } = useTheme();
  const s = styles(colors);
  const user = auth.currentUser;
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tip] = useState(TIPS[Math.floor(Math.random() * TIPS.length)]);
  const uid = user?.uid;

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'expenses'), where('uid', '==', uid));
    return onSnapshot(q, snap => {
      setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() } as Expense)));
    });
  }, [uid]);

  const now = new Date();
  const thisMonth = expenses.filter(e => {
    const d = new Date(e.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const total = thisMonth.reduce((s, e) => s + e.amount, 0);
  const recent = [...thisMonth]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const categories = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Other'];
  const topCategory = categories.map(cat => ({
    name: cat,
    amount: thisMonth.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0)
  })).sort((a, b) => b.amount - a.amount)[0];

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Welcome back,</Text>
          <Text style={s.name}>{user?.displayName || user?.email?.split('@')[0] || 'Student'}</Text>
        </View>
        <TouchableOpacity style={s.signOutBtn} onPress={() => signOut(auth)}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>

      {/* Summary Card */}
      <View style={s.summaryCard}>
        <Text style={s.summaryLabel}>Total Spent This Month</Text>
        <Text style={s.summaryAmount}>${total.toFixed(2)}</Text>
        <View style={s.divider} />
        <View style={s.statsRow}>
          <View style={s.statItem}>
            <Text style={s.statValue}>{thisMonth.length}</Text>
            <Text style={s.statLabel}>Transactions</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={s.statValue}>{topCategory?.amount > 0 ? topCategory.name : '—'}</Text>
            <Text style={s.statLabel}>Top Category</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={s.statValue}>
              ${thisMonth.length > 0 ? (total / thisMonth.length).toFixed(0) : '0'}
            </Text>
            <Text style={s.statLabel}>Avg/Transaction</Text>
          </View>
        </View>
      </View>

      {/* Tip */}
      <View style={s.card}>
        <View style={s.cardHeader}>
          <Ionicons name="bulb-outline" size={18} color={colors.primary} />
          <Text style={s.cardTitle}>Tip of the Day</Text>
        </View>
        <Text style={s.tipText}>{tip}</Text>
      </View>

      {/* Recent Transactions */}
      <View style={s.card}>
        <View style={s.cardHeader}>
          <Ionicons name="receipt-outline" size={18} color={colors.primary} />
          <Text style={s.cardTitle}>Recent Transactions</Text>
        </View>
        {recent.length === 0 ? (
          <Text style={s.emptyText}>No expenses yet this month. Start tracking in the Budget tab.</Text>
        ) : (
          recent.map(e => (
            <View key={e.id} style={s.txRow}>
              <View style={s.txLeft}>
                <View style={s.txDot} />
                <View>
                  <Text style={s.txCat}>{e.category}</Text>
                  {e.description ? <Text style={s.txDesc}>{e.description}</Text> : null}
                </View>
              </View>
              <Text style={s.txAmt}>-${e.amount.toFixed(2)}</Text>
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
        {[
          { icon: 'wallet-outline', label: 'Track your spending', sub: 'Budget tab' },
          { icon: 'trending-down-outline', label: 'Simulate debt payoff', sub: 'Debt tab' },
          { icon: 'book-outline', label: 'Learn finance basics', sub: 'Learn tab' },
        ].map((a, i) => (
          <View key={i} style={s.actionRow}>
            <Ionicons name={a.icon as any} size={18} color={colors.textSecondary} />
            <Text style={s.actionText}>{a.label}</Text>
            <Text style={s.actionSub}>{a.sub}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 13, color: colors.textSecondary },
  name: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  signOutBtn: { padding: 8, borderRadius: 8, backgroundColor: colors.surface },
  summaryCard: {
    backgroundColor: colors.primary, borderRadius: 16,
    padding: 20, marginBottom: 16,
  },
  summaryLabel: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  summaryAmount: { fontSize: 36, fontWeight: '700', color: '#fff', marginBottom: 16 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { color: '#fff', fontWeight: '600', fontSize: 15 },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  card: {
    backgroundColor: colors.surface, borderRadius: 12,
    padding: 16, marginBottom: 14,
  },
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
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  actionText: { flex: 1, fontSize: 14, color: colors.textSecondary },
  actionSub: { fontSize: 12, color: colors.primary, fontWeight: '600' },
});