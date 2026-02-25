import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, Dimensions
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { collection, addDoc, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Other'];
const COLORS = ['#38bdf8', '#818cf8', '#34d399', '#fb923c', '#f472b6', '#a78bfa'];
const W = Dimensions.get('window').width;

interface Expense { id: string; category: string; amount: number; description: string; }

export default function BudgetScreen() {
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
    const unsub = onSnapshot(q, snap => {
      setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() } as Expense)));
    });
    return unsub;
  }, [uid]);

  const addExpense = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Error', 'Please enter a valid amount'); return;
    }
    try {
      await addDoc(collection(db, 'expenses'), {
        uid, category, amount: Number(amount), description, createdAt: new Date().toISOString()
      });
      setAmount(''); setDescription(''); setShowForm(false);
    } catch (e) { Alert.alert('Error', 'Could not save expense'); }
  };

  const deleteExpense = async (id: string) => {
    try { await deleteDoc(doc(db, 'expenses', id)); }
    catch (e) { Alert.alert('Error', 'Could not delete expense'); }
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const budgetNum = Number(budget) || 0;
  const remaining = budgetNum - total;

  const chartData = CATEGORIES.map((cat, i) => ({
    name: cat,
    amount: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
    color: COLORS[i],
    legendFontColor: '#94a3b8',
    legendFontSize: 12,
  })).filter(d => d.amount > 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Budget Tracker</Text>

      {/* Budget Input */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💵 Set Monthly Budget</Text>
        <TextInput
          style={styles.input} placeholder="Enter budget amount" placeholderTextColor="#475569"
          value={budget} onChangeText={setBudget} keyboardType="numeric"
        />
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={[styles.summaryValue, { color: '#ef4444' }]}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Remaining</Text>
            <Text style={[styles.summaryValue, { color: remaining >= 0 ? '#34d399' : '#ef4444' }]}>
              ${remaining.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Pie Chart */}
      {chartData.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Spending Breakdown</Text>
          <PieChart
            data={chartData}
            width={W - 48}
            height={200}
            chartConfig={{ color: (o = 1) => `rgba(255,255,255,${o})` }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
          />
        </View>
      )}

      {/* Add Expense */}
      <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
        <Text style={styles.addBtnText}>{showForm ? '✕ Cancel' : '+ Add Expense'}</Text>
      </TouchableOpacity>

      {showForm && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>New Expense</Text>
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
            {CATEGORIES.map((cat, i) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catBtn, category === cat && { backgroundColor: COLORS[i] }]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.catText, category === cat && { color: '#0f172a' }]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TextInput
            style={styles.input} placeholder="Amount" placeholderTextColor="#475569"
            value={amount} onChangeText={setAmount} keyboardType="numeric"
          />
          <TextInput
            style={styles.input} placeholder="Description (optional)" placeholderTextColor="#475569"
            value={description} onChangeText={setDescription}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={addExpense}>
            <Text style={styles.saveBtnText}>Save Expense</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Expense List */}
      {expenses.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Recent Expenses</Text>
          {expenses.map(e => (
            <View key={e.id} style={styles.expenseRow}>
              <View>
                <Text style={styles.expenseCat}>{e.category}</Text>
                {e.description ? <Text style={styles.expenseDesc}>{e.description}</Text> : null}
              </View>
              <View style={styles.expenseRight}>
                <Text style={styles.expenseAmt}>${e.amount.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => deleteExpense(e.id)}>
                  <Text style={styles.deleteBtn}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#f1f5f9', marginBottom: 16 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#38bdf8', marginBottom: 12 },
  input: { backgroundColor: '#0f172a', color: '#f1f5f9', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  label: { color: '#94a3b8', fontSize: 13, marginBottom: 8 },
  catRow: { marginBottom: 12 },
  catBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#334155', marginRight: 8 },
  catText: { color: '#94a3b8', fontSize: 13 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  summaryItem: { alignItems: 'center' },
  summaryLabel: { color: '#94a3b8', fontSize: 12 },
  summaryValue: { fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  addBtn: { backgroundColor: '#38bdf8', borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 16 },
  addBtnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 15 },
  saveBtn: { backgroundColor: '#34d399', borderRadius: 8, padding: 12, alignItems: 'center' },
  saveBtnText: { color: '#0f172a', fontWeight: 'bold' },
  expenseRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#334155' },
  expenseCat: { color: '#f1f5f9', fontWeight: 'bold' },
  expenseDesc: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  expenseRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  expenseAmt: { color: '#38bdf8', fontWeight: 'bold' },
  deleteBtn: { color: '#ef4444', fontSize: 16 },
});