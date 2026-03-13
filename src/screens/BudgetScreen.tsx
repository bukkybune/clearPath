import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, Dimensions
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';
import { useTheme } from '../context/ThemeContext';

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Other'];
const W = Dimensions.get('window').width;

interface Expense { id: string; category: string; amount: number; description: string; }

export default function BudgetScreen() {
  const { colors } = useTheme();
  const s = styles(colors);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [showForm, setShowForm] = useState(false);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'expenses'), where('uid', '==', uid));
    return onSnapshot(q, snap => {
      setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() } as Expense)));
    });
  }, [uid]);

  const addExpense = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Error', 'Please enter a valid amount'); return;
    }
    try {
      await addDoc(collection(db, 'expenses'), {
        uid, category, amount: Number(amount),
        description, createdAt: new Date().toISOString()
      });
      setAmount(''); setDescription(''); setShowForm(false);
    } catch (e) { Alert.alert('Error', 'Could not save expense'); }
  };

  const deleteExpense = async (id: string) => {
    Alert.alert('Delete', 'Remove this expense?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await deleteDoc(doc(db, 'expenses', id)); }
        catch (e) { Alert.alert('Error', 'Could not delete expense'); }
      }}
    ]);
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const budgetNum = Number(budget) || 0;
  const remaining = budgetNum - total;
  const progress = budgetNum > 0 ? Math.min(total / budgetNum, 1) : 0;

  const chartData = CATEGORIES.map((cat, i) => ({
    name: cat,
    amount: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
    color: colors.chart[i],
    legendFontColor: colors.textSecondary,
    legendFontSize: 12,
  })).filter(d => d.amount > 0);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* Summary Card */}
      <View style={s.summaryCard}>
        <View style={s.summaryRow}>
          <View>
            <Text style={s.summaryLabel}>Total Spent</Text>
            <Text style={s.summaryAmount}>${total.toFixed(2)}</Text>
          </View>
          <View style={s.summaryRight}>
            <Text style={s.summaryLabel}>Remaining</Text>
            <Text style={[s.summaryAmount, { color: remaining >= 0 ? colors.success : colors.danger }]}>
              ${remaining.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        {budgetNum > 0 && (
          <View style={s.progressSection}>
            <View style={s.progressBg}>
              <View style={[s.progressFill, {
                width: `${progress * 100}%` as any,
                backgroundColor: progress > 0.9 ? colors.danger : progress > 0.7 ? colors.warning : colors.success
              }]} />
            </View>
            <Text style={s.progressLabel}>{Math.round(progress * 100)}% of budget used</Text>
          </View>
        )}

        {/* Budget Input */}
        <View style={s.budgetInputRow}>
          <Ionicons name="calculator-outline" size={16} color={colors.textSecondary} />
          <TextInput
            style={s.budgetInput}
            placeholder="Set monthly budget"
            placeholderTextColor={colors.textTertiary}
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Pie Chart */}
      {chartData.length > 0 && (
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Ionicons name="pie-chart-outline" size={18} color={colors.primary} />
            <Text style={s.cardTitle}>Spending Breakdown</Text>
          </View>
          <PieChart
            data={chartData}
            width={W - 72}
            height={180}
            chartConfig={{ color: (o = 1) => `rgba(255,255,255,${o})` }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
          />
        </View>
      )}

      {/* Add Expense Button */}
      <TouchableOpacity style={s.addBtn} onPress={() => setShowForm(!showForm)}>
        <Ionicons name={showForm ? 'close' : 'add'} size={20} color="#fff" />
        <Text style={s.addBtnText}>{showForm ? 'Cancel' : 'Add Expense'}</Text>
      </TouchableOpacity>

      {/* Add Expense Form */}
      {showForm && (
        <View style={s.card}>
          <Text style={s.cardTitle}>New Expense</Text>
          <Text style={s.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catRow}>
            {CATEGORIES.map((cat, i) => (
              <TouchableOpacity
                key={cat}
                style={[s.catBtn, category === cat && { backgroundColor: colors.chart[i], borderColor: colors.chart[i] }]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[s.catText, category === cat && { color: '#fff' }]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TextInput
            style={s.input} placeholder="Amount" placeholderTextColor={colors.textTertiary}
            value={amount} onChangeText={setAmount} keyboardType="numeric"
          />
          <TextInput
            style={s.input} placeholder="Description (optional)" placeholderTextColor={colors.textTertiary}
            value={description} onChangeText={setDescription}
          />
          <TouchableOpacity style={s.saveBtn} onPress={addExpense}>
            <Text style={s.saveBtnText}>Save Expense</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Expense List */}
      {expenses.length > 0 && (
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Ionicons name="list-outline" size={18} color={colors.primary} />
            <Text style={s.cardTitle}>All Expenses</Text>
          </View>
          {expenses.map(e => (
            <View key={e.id} style={s.expenseRow}>
              <View style={s.expenseLeft}>
                <View style={[s.expenseDot, { backgroundColor: colors.chart[CATEGORIES.indexOf(e.category)] }]} />
                <View>
                  <Text style={s.expenseCat}>{e.category}</Text>
                  {e.description ? <Text style={s.expenseDesc}>{e.description}</Text> : null}
                </View>
              </View>
              <View style={s.expenseRight}>
                <Text style={s.expenseAmt}>${e.amount.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => deleteExpense(e.id)} style={s.deleteBtn}>
                  <Ionicons name="trash-outline" size={16} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  summaryCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  summaryRight: { alignItems: 'flex-end' },
  summaryLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  summaryAmount: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  progressSection: { marginBottom: 16 },
  progressBg: { height: 6, backgroundColor: colors.border, borderRadius: 3, marginBottom: 6 },
  progressFill: { height: 6, borderRadius: 3 },
  progressLabel: { fontSize: 12, color: colors.textSecondary },
  budgetInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  budgetInput: { flex: 1, color: colors.textPrimary, fontSize: 14 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  label: { fontSize: 12, color: colors.textSecondary, marginBottom: 8 },
  catRow: { marginBottom: 14 },
  catBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  catText: { color: colors.textSecondary, fontSize: 13 },
  input: { backgroundColor: colors.surfaceSecondary, color: colors.textPrimary, borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 14 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: 10, padding: 14, marginBottom: 14 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  saveBtn: { backgroundColor: colors.success, borderRadius: 8, padding: 13, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '600' },
  expenseRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  expenseLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  expenseDot: { width: 10, height: 10, borderRadius: 5 },
  expenseCat: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  expenseDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  expenseRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  expenseAmt: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  deleteBtn: { padding: 4 },
});