import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

const TIPS = [
  "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
  "Even saving $5/day adds up to $1,825 a year!",
  "Pay yourself first — save before you spend.",
  "Avoid lifestyle inflation as your income grows.",
  "An emergency fund of $1,000 can prevent most financial crises.",
  "Check your credit score regularly — it's free and important.",
];

interface Expense { id: string; category: string; amount: number; description: string; createdAt: string; }

export default function HomeScreen() {
  const user = auth.currentUser;
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tip] = useState(TIPS[Math.floor(Math.random() * TIPS.length)]);
  const uid = user?.uid;

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'expenses'), where('uid', '==', uid));
    const unsub = onSnapshot(q, snap => {
      setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() } as Expense)));
    });
    return unsub;
  }, [uid]);

  // Filter to current month
  const now = new Date();
  const thisMonth = expenses.filter(e => {
    const d = new Date(e.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const total = thisMonth.reduce((s, e) => s + e.amount, 0);
  const recent = [...thisMonth].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);

  // Category breakdown
  const categories = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Other'];
  const colors = ['#38bdf8', '#818cf8', '#34d399', '#fb923c', '#f472b6', '#a78bfa'];
  const topCategory = categories.map((cat, i) => ({
    name: cat, color: colors[i],
    amount: thisMonth.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0)
  })).sort((a, b) => b.amount - a.amount)[0];

  const handleSignOut = async () => {
    try { await signOut(auth); } catch (e) { console.error(e); }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>👋 Welcome back,</Text>
          <Text style={styles.name}>{user?.displayName || user?.email?.split('@')[0] || 'Student'}!</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Monthly Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Spent This Month</Text>
        <Text style={styles.summaryAmount}>${total.toFixed(2)}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{thisMonth.length}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {topCategory?.amount > 0 ? topCategory.name : '—'}
            </Text>
            <Text style={styles.statLabel}>Top Category</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              ${thisMonth.length > 0 ? (total / thisMonth.length).toFixed(0) : '0'}
            </Text>
            <Text style={styles.statLabel}>Avg/Transaction</Text>
          </View>
        </View>
      </View>

      {/* Tip of the day */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💡 Tip of the Day</Text>
        <Text style={styles.tipText}>{tip}</Text>
      </View>

      {/* Recent Transactions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🧾 Recent Transactions</Text>
        {recent.length === 0 ? (
          <Text style={styles.emptyText}>No expenses yet this month. Start tracking in the Budget tab!</Text>
        ) : (
          recent.map(e => (
            <View key={e.id} style={styles.txRow}>
              <View>
                <Text style={styles.txCat}>{e.category}</Text>
                {e.description ? <Text style={styles.txDesc}>{e.description}</Text> : null}
              </View>
              <Text style={styles.txAmt}>${e.amount.toFixed(2)}</Text>
            </View>
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚀 Quick Actions</Text>
        <Text style={styles.actionText}>💰 Track your spending → Budget tab</Text>
        <Text style={styles.actionText}>📉 Simulate debt payoff → Debt tab</Text>
        <Text style={styles.actionText}>📚 Learn finance basics → Learn tab</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  greeting: { fontSize: 14, color: '#94a3b8' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#f1f5f9' },
  signOutBtn: { padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  signOutText: { color: '#ef4444', fontSize: 13, fontWeight: 'bold' },
  summaryCard: {
    backgroundColor: '#1e3a5f', borderRadius: 16, padding: 20,
    marginBottom: 16, borderWidth: 1, borderColor: '#38bdf8'
  },
  summaryLabel: { color: '#94a3b8', fontSize: 13, marginBottom: 4 },
  summaryAmount: { fontSize: 36, fontWeight: 'bold', color: '#38bdf8', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { color: '#f1f5f9', fontWeight: 'bold', fontSize: 15 },
  statLabel: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: '#334155' },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#38bdf8', marginBottom: 12 },
  tipText: { color: '#cbd5e1', fontSize: 14, lineHeight: 22 },
  emptyText: { color: '#475569', fontSize: 13, lineHeight: 20 },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#334155' },
  txCat: { color: '#f1f5f9', fontWeight: 'bold', fontSize: 14 },
  txDesc: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  txAmt: { color: '#38bdf8', fontWeight: 'bold' },
  actionText: { color: '#94a3b8', fontSize: 14, lineHeight: 26 },
});