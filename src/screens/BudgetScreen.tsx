import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, Dimensions
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, onSnapshot, query, where, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';
import { useTheme } from '../context/ThemeContext';
import { usePoints } from '../hooks/usePoints';

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Financial Aid', 'Family Support', 'Side Hustle', 'Other'];
const W = Dimensions.get('window').width;

type Tab = 'expenses' | 'income';
interface Transaction {
  id: string;
  category: string;
  amount: number;
  description: string;
  type: 'expense' | 'income';
  createdAt?: string;
}

const getYearMonth = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const getMonthLabel = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
};

const currentYM = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export default function BudgetScreen() {
  const { colors } = useTheme();
  const s = styles(colors);
  const { addPoints, awardMilestone, awardedMilestones } = usePoints();
  const uid = auth.currentUser?.uid;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [oldExpenses, setOldExpenses] = useState<Transaction[]>([]);
  const [transactionsLoaded, setTransactionsLoaded] = useState(false);
  const [oldExpensesLoaded, setOldExpensesLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('expenses');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(currentYM);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [categoryLimits, setCategoryLimits] = useState<Record<string, number>>({});
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [catLimitInputs, setCatLimitInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'transactions'), where('uid', '==', uid));
    return onSnapshot(q, snap => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
      setTransactionsLoaded(true);
    });
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'expenses'), where('uid', '==', uid));
    return onSnapshot(q, snap => {
      setOldExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() as any, type: 'expense' })));
      setOldExpensesLoaded(true);
    });
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, 'budgets', uid)).then(snap => {
      if (!snap.exists()) return;
      const data = snap.data();
      const budget = data.monthlyBudget ?? 0;
      setMonthlyBudget(budget);
      setBudgetInput(budget > 0 ? String(budget) : '');
      const limits: Record<string, number> = data.categoryLimits ?? {};
      setCategoryLimits(limits);
      const inputs: Record<string, string> = {};
      CATEGORIES.forEach(cat => { inputs[cat] = limits[cat] ? String(limits[cat]) : ''; });
      setCatLimitInputs(inputs);
    });
  }, [uid]);

  // Award +50 pts once per month when expenses stay under the monthly budget
  useEffect(() => {
    if (!uid || monthlyBudget <= 0 || !transactionsLoaded || !oldExpensesLoaded) return;
    const thisMonth = currentYM();
    const thisMonthExpenses = [...transactions.filter(t => t.type === 'expense'), ...oldExpenses]
      .filter(t => getYearMonth(t.createdAt) === thisMonth);
    const total = thisMonthExpenses.reduce((s, t) => s + t.amount, 0);
    if (total >= monthlyBudget) return;

    getDoc(doc(db, 'userProgress', uid)).then(snap => {
      const lastBonus = snap.exists() ? snap.data().budgetBonusMonth : null;
      if (lastBonus === thisMonth) return;
      addPoints(50);
      setDoc(doc(db, 'userProgress', uid), { budgetBonusMonth: thisMonth }, { merge: true })
        .catch(e => console.error('Failed to save budget bonus month:', e));
    });
  }, [monthlyBudget, transactions.length, oldExpenses.length, transactionsLoaded, oldExpensesLoaded]);

  const allExpenses = [
    ...transactions.filter(t => t.type === 'expense'),
    ...oldExpenses,
  ];
  const allIncome = transactions.filter(t => t.type === 'income');

  const filteredExpenses = allExpenses.filter(t => getYearMonth(t.createdAt) === selectedMonth);
  const filteredIncome = allIncome.filter(t => getYearMonth(t.createdAt) === selectedMonth);

  const totalExpenses = filteredExpenses.reduce((s, t) => s + t.amount, 0);
  const totalIncome = filteredIncome.reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const currentCategories = activeTab === 'expenses' ? CATEGORIES : INCOME_CATEGORIES;
  const displayList = activeTab === 'expenses' ? filteredExpenses : filteredIncome;
  const displayCategories = activeTab === 'expenses' ? CATEGORIES : INCOME_CATEGORIES;

  const changeMonth = (delta: number) => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const saveBudgetSettings = async () => {
    const limits: Record<string, number> = {};
    CATEGORIES.forEach(cat => {
      const val = Number(catLimitInputs[cat]);
      if (!isNaN(val) && val > 0) limits[cat] = val;
    });
    const budget = Number(budgetInput);
    const cleanBudget = !isNaN(budget) && budget > 0 ? budget : 0;
    setMonthlyBudget(cleanBudget);
    setCategoryLimits(limits);
    if (uid) {
      await setDoc(doc(db, 'budgets', uid), { monthlyBudget: cleanBudget, categoryLimits: limits }, { merge: true });
    }
    setShowBudgetSettings(false);
  };

  const doAddTransaction = async () => {
    try {
      await addDoc(collection(db, 'transactions'), {
        uid, category, amount: Number(amount),
        description, type: activeTab === 'expenses' ? 'expense' : 'income',
        createdAt: new Date().toISOString(),
      });
      const isFirst = transactions.length === 0 && oldExpenses.length === 0
        && !awardedMilestones.includes('first_transaction');
      if (isFirst) {
        awardMilestone('first_transaction', 20);
      } else {
        addPoints(10);
      }
      setAmount(''); setDescription(''); setShowForm(false);
    } catch (e) { Alert.alert('Error', 'Could not save transaction'); }
  };

  const addTransaction = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Error', 'Please enter a valid amount'); return;
    }
    if (activeTab === 'expenses') {
      const limit = categoryLimits[category];
      if (limit > 0) {
        const catTotal = filteredExpenses
          .filter(e => e.category === category)
          .reduce((s, e) => s + e.amount, 0);
        if (catTotal + Number(amount) > limit) {
          Alert.alert(
            'Category Limit Alert',
            `Adding $${Number(amount).toFixed(2)} will exceed your ${category} limit of $${limit.toFixed(2)}.\nCurrent spend: $${catTotal.toFixed(2)}`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Add Anyway', onPress: doAddTransaction },
            ]
          );
          return;
        }
      }
    }
    await doAddTransaction();
  };

  const deleteTransaction = async (id: string, isOld = false) => {
    Alert.alert('Delete', 'Remove this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await deleteDoc(doc(db, isOld ? 'expenses' : 'transactions', id)); }
        catch (e) { Alert.alert('Error', 'Could not delete'); }
      }},
    ]);
  };

  const chartData = CATEGORIES.map((cat, i) => ({
    name: cat,
    amount: filteredExpenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
    color: colors.chart[i],
    legendFontColor: colors.textSecondary,
    legendFontSize: 12,
  })).filter(d => d.amount > 0);

  const budgetPct = monthlyBudget > 0 ? Math.min(totalExpenses / monthlyBudget, 1) : 0;
  const activeCategoryLimits = CATEGORIES.filter(cat => categoryLimits[cat] > 0);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* Month Selector */}
      <View style={s.monthRow}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={s.monthBtn}>
          <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={s.monthLabel}>{getMonthLabel(selectedMonth)}</Text>
        <TouchableOpacity
          onPress={() => changeMonth(1)}
          style={s.monthBtn}
          disabled={selectedMonth >= currentYM()}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={selectedMonth >= currentYM() ? colors.border : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={s.summaryRow}>
        <View style={[s.summaryCard, { borderLeftColor: colors.success }]}>
          <Text style={s.summaryLabel}>Income</Text>
          <Text style={[s.summaryAmount, { color: colors.success }]}>${totalIncome.toFixed(2)}</Text>
        </View>
        <View style={[s.summaryCard, { borderLeftColor: colors.danger }]}>
          <Text style={s.summaryLabel}>Expenses</Text>
          <Text style={[s.summaryAmount, { color: colors.danger }]}>${totalExpenses.toFixed(2)}</Text>
        </View>
      </View>

      {/* Balance Card */}
      <View style={s.balanceCard}>
        <Text style={s.balanceLabel}>Net Balance</Text>
        <Text style={[s.balanceAmount, { color: balance >= 0 ? colors.success : colors.danger }]}>
          {balance >= 0 ? '+' : ''}${balance.toFixed(2)}
        </Text>
        {totalIncome > 0 && (
          <View style={s.progressSection}>
            <View style={s.progressBg}>
              <View style={[s.progressFill, {
                width: `${Math.min((totalExpenses / totalIncome) * 100, 100)}%` as any,
                backgroundColor: totalExpenses / totalIncome > 0.9 ? colors.danger :
                  totalExpenses / totalIncome > 0.7 ? colors.warning : colors.success,
              }]} />
            </View>
            <Text style={s.progressLabel}>
              {Math.round((totalExpenses / totalIncome) * 100)}% of income spent
            </Text>
          </View>
        )}
        {monthlyBudget > 0 && (
          <View style={[s.progressSection, { marginTop: 10 }]}>
            <View style={s.progressBg}>
              <View style={[s.progressFill, {
                width: `${budgetPct * 100}%` as any,
                backgroundColor: budgetPct >= 1 ? colors.danger : budgetPct > 0.8 ? colors.warning : colors.primary,
              }]} />
            </View>
            <Text style={s.progressLabel}>
              ${totalExpenses.toFixed(2)} / ${monthlyBudget.toFixed(2)} monthly budget
            </Text>
          </View>
        )}
      </View>

      {/* Budget Settings Toggle */}
      <TouchableOpacity style={s.settingsToggle} onPress={() => setShowBudgetSettings(!showBudgetSettings)}>
        <Ionicons name="settings-outline" size={16} color={colors.primary} />
        <Text style={s.settingsToggleText}>Budget Settings</Text>
        <Ionicons name={showBudgetSettings ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Budget Settings Form */}
      {showBudgetSettings && (
        <View style={s.card}>
          <Text style={s.sectionTitle}>Budget Settings</Text>
          <Text style={s.label}>Monthly Budget</Text>
          <TextInput
            style={s.input}
            placeholder="e.g. 1500"
            placeholderTextColor={colors.textTertiary}
            value={budgetInput}
            onChangeText={setBudgetInput}
            keyboardType="numeric"
          />
          <Text style={s.label}>Category Limits (optional)</Text>
          {CATEGORIES.map(cat => (
            <View key={cat} style={s.catLimitRow}>
              <Text style={s.catLimitLabel}>{cat}</Text>
              <TextInput
                style={s.catLimitInput}
                placeholder="No limit"
                placeholderTextColor={colors.textTertiary}
                value={catLimitInputs[cat] ?? ''}
                onChangeText={val => setCatLimitInputs(prev => ({ ...prev, [cat]: val }))}
                keyboardType="numeric"
              />
            </View>
          ))}
          <View style={s.settingsBtns}>
            <TouchableOpacity style={s.cancelBtn} onPress={() => setShowBudgetSettings(false)}>
              <Text style={s.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.saveBtn, { flex: 1 }]} onPress={saveBudgetSettings}>
              <Text style={s.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Tab Toggle */}
      <View style={s.tabRow}>
        <TouchableOpacity
          style={[s.tab, activeTab === 'expenses' && s.tabActive]}
          onPress={() => { setActiveTab('expenses'); setCategory(CATEGORIES[0]); setShowForm(false); }}
        >
          <Ionicons name="arrow-up-circle-outline" size={16} color={activeTab === 'expenses' ? '#fff' : colors.textSecondary} />
          <Text style={[s.tabText, activeTab === 'expenses' && s.tabTextActive]}>Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.tab, activeTab === 'income' && { ...s.tabActive, backgroundColor: colors.success }]}
          onPress={() => { setActiveTab('income'); setCategory(INCOME_CATEGORIES[0]); setShowForm(false); }}
        >
          <Ionicons name="arrow-down-circle-outline" size={16} color={activeTab === 'income' ? '#fff' : colors.textSecondary} />
          <Text style={[s.tabText, activeTab === 'income' && s.tabTextActive]}>Income</Text>
        </TouchableOpacity>
      </View>

      {/* Pie Chart (expenses only) */}
      {activeTab === 'expenses' && chartData.length > 0 && (
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

      {/* Category Limit Progress (expenses only) */}
      {activeTab === 'expenses' && activeCategoryLimits.length > 0 && (
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Ionicons name="bar-chart-outline" size={18} color={colors.primary} />
            <Text style={s.cardTitle}>Category Limits</Text>
          </View>
          {activeCategoryLimits.map(cat => {
            const spent = filteredExpenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
            const limit = categoryLimits[cat];
            const pct = Math.min(spent / limit, 1);
            return (
              <View key={cat} style={s.catProgressRow}>
                <View style={s.catProgressHeader}>
                  <Text style={s.catProgressLabel}>{cat}</Text>
                  <Text style={[s.catProgressAmt, { color: pct >= 1 ? colors.danger : colors.textSecondary }]}>
                    ${spent.toFixed(0)} / ${limit}
                  </Text>
                </View>
                <View style={s.progressBg}>
                  <View style={[s.progressFill, {
                    width: `${pct * 100}%` as any,
                    backgroundColor: pct >= 1 ? colors.danger : pct > 0.8 ? colors.warning : colors.chart[CATEGORIES.indexOf(cat) % colors.chart.length],
                  }]} />
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Add Button */}
      <TouchableOpacity
        style={[s.addBtn, activeTab === 'income' && { backgroundColor: colors.success }]}
        onPress={() => setShowForm(!showForm)}
      >
        <Ionicons name={showForm ? 'close' : 'add'} size={20} color="#fff" />
        <Text style={s.addBtnText}>{showForm ? 'Cancel' : `Add ${activeTab === 'expenses' ? 'Expense' : 'Income'}`}</Text>
      </TouchableOpacity>

      {/* Form */}
      {showForm && (
        <View style={s.card}>
          <Text style={s.sectionTitle}>New {activeTab === 'expenses' ? 'Expense' : 'Income'}</Text>
          <Text style={s.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catRow}>
            {currentCategories.map((cat, i) => (
              <TouchableOpacity
                key={cat}
                style={[s.catBtn, category === cat && { backgroundColor: colors.chart[i % colors.chart.length], borderColor: colors.chart[i % colors.chart.length] }]}
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
          <TouchableOpacity
            style={[s.saveBtn, activeTab === 'income' && { backgroundColor: colors.success }]}
            onPress={addTransaction}
          >
            <Text style={s.saveBtnText}>Save {activeTab === 'expenses' ? 'Expense' : 'Income'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Transaction List */}
      {displayList.length > 0 && (
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Ionicons name="list-outline" size={18} color={colors.primary} />
            <Text style={s.cardTitle}>{activeTab === 'expenses' ? 'All Expenses' : 'All Income'}</Text>
          </View>
          {displayList.map(t => (
            <View key={t.id} style={s.txRow}>
              <View style={s.txLeft}>
                <View style={[s.txDot, { backgroundColor: colors.chart[displayCategories.indexOf(t.category) % colors.chart.length] || colors.primary }]} />
                <View>
                  <Text style={s.txCat}>{t.category}</Text>
                  {t.description ? <Text style={s.txDesc}>{t.description}</Text> : null}
                </View>
              </View>
              <View style={s.txRight}>
                <Text style={[s.txAmt, { color: activeTab === 'income' ? colors.success : colors.danger }]}>
                  {activeTab === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </Text>
                <TouchableOpacity onPress={() => deleteTransaction(t.id, oldExpenses.some(e => e.id === t.id))} style={s.deleteBtn}>
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
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16, gap: 16 },
  monthBtn: { padding: 4 },
  monthLabel: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  summaryCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderLeftWidth: 3 },
  summaryLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  summaryAmount: { fontSize: 20, fontWeight: '700' },
  balanceCard: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 14 },
  balanceLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  balanceAmount: { fontSize: 28, fontWeight: '700', marginBottom: 12 },
  progressSection: { gap: 6 },
  progressBg: { height: 6, backgroundColor: colors.border, borderRadius: 3 },
  progressFill: { height: 6, borderRadius: 3 },
  progressLabel: { fontSize: 12, color: colors.textSecondary },
  settingsToggle: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surface, borderRadius: 10, padding: 12, marginBottom: 14 },
  settingsToggleText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  catLimitRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  catLimitLabel: { fontSize: 14, color: colors.textPrimary, flex: 1 },
  catLimitInput: { backgroundColor: colors.surfaceSecondary, color: colors.textPrimary, borderRadius: 8, padding: 8, fontSize: 14, width: 100, textAlign: 'right' },
  settingsBtns: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, alignItems: 'center' },
  cancelBtnText: { color: colors.textSecondary, fontWeight: '600' },
  catProgressRow: { marginBottom: 12 },
  catProgressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  catProgressLabel: { fontSize: 13, color: colors.textPrimary, fontWeight: '500' },
  catProgressAmt: { fontSize: 12 },
  tabRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.textSecondary, fontWeight: '600', fontSize: 14 },
  tabTextActive: { color: '#fff' },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 },
  label: { fontSize: 12, color: colors.textSecondary, marginBottom: 8 },
  catRow: { marginBottom: 14 },
  catBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  catText: { color: colors.textSecondary, fontSize: 13 },
  input: { backgroundColor: colors.surfaceSecondary, color: colors.textPrimary, borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 14 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: 10, padding: 14, marginBottom: 14 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  saveBtn: { backgroundColor: colors.primary, borderRadius: 8, padding: 13, alignItems: 'center', marginTop: 4 },
  saveBtnText: { color: '#fff', fontWeight: '600' },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  txDot: { width: 10, height: 10, borderRadius: 5 },
  txCat: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  txDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  txRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  txAmt: { fontSize: 14, fontWeight: '600' },
  deleteBtn: { padding: 4 },
});
