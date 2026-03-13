import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Dimensions
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const W = Dimensions.get('window').width;

type SimType = 'student' | 'credit';

interface PayoffResult {
  months: number;
  totalInterest: number;
  totalPaid: number;
  chartLabels: string[];
  chartData: number[];
}

function calcPayoff(principal: number, annualRate: number, monthlyPayment: number): PayoffResult {
  let balance = principal;
  const monthlyRate = annualRate / 100 / 12;
  let months = 0;
  let totalInterest = 0;
  const chartData: number[] = [balance];
  const chartLabels: string[] = ['0'];

  while (balance > 0 && months < 600) {
    const interest = balance * monthlyRate;
    totalInterest += interest;
    balance = balance + interest - monthlyPayment;
    if (balance < 0) balance = 0;
    months++;
    if (months % 12 === 0 || balance === 0) {
      chartLabels.push(`${months}mo`);
      chartData.push(Math.round(balance));
    }
  }
  return { months, totalInterest, totalPaid: principal + totalInterest, chartLabels, chartData };
}

export default function DebtScreen() {
  const { colors } = useTheme();
  const s = styles(colors);
  const [simType, setSimType] = useState<SimType>('student');
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [payment, setPayment] = useState('');
  const [result, setResult] = useState<PayoffResult | null>(null);
  const [error, setError] = useState('');

  const simulate = () => {
    const p = Number(principal), r = Number(rate), m = Number(payment);
    if (!p || !r || !m) { setError('Please fill in all fields'); return; }
    const minPayment = p * (r / 100 / 12);
    if (m <= minPayment) {
      setError(`Monthly payment must be greater than $${minPayment.toFixed(2)} to cover interest`);
      return;
    }
    setError('');
    setResult(calcPayoff(p, r, m));
  };

  const switchType = (type: SimType) => {
    setSimType(type);
    setResult(null);
    setError('');
    setRate(type === 'student' ? '5.5' : '20');
  };

  const years = result ? Math.floor(result.months / 12) : 0;
  const months = result ? result.months % 12 : 0;

  const TIPS = {
    student: [
      'Even $50 extra/month can save thousands in interest.',
      'Look into income-driven repayment plans if payments are too high.',
      'Public Service Loan Forgiveness may apply if you work in public service.',
    ],
    credit: [
      'Always pay more than the minimum to avoid debt traps.',
      'Consider the avalanche method: pay highest interest rate first.',
      'A balance transfer to a lower rate card could save money.',
    ],
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* Toggle */}
      <View style={s.toggleRow}>
        <TouchableOpacity
          style={[s.toggleBtn, simType === 'student' && s.toggleActive]}
          onPress={() => switchType('student')}
        >
          <Ionicons name="school-outline" size={16} color={simType === 'student' ? '#fff' : colors.textSecondary} />
          <Text style={[s.toggleText, simType === 'student' && s.toggleTextActive]}>Student Loan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.toggleBtn, simType === 'credit' && s.toggleActive]}
          onPress={() => switchType('credit')}
        >
          <Ionicons name="card-outline" size={16} color={simType === 'credit' ? '#fff' : colors.textSecondary} />
          <Text style={[s.toggleText, simType === 'credit' && s.toggleTextActive]}>Credit Card</Text>
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <View style={s.card}>
        <Text style={s.cardTitle}>{simType === 'student' ? 'Student Loan Details' : 'Credit Card Details'}</Text>

        <Text style={s.label}>Loan Balance ($)</Text>
        <TextInput
          style={s.input}
          placeholder={simType === 'student' ? 'e.g. 30000' : 'e.g. 5000'}
          placeholderTextColor={colors.textTertiary}
          value={principal} onChangeText={setPrincipal} keyboardType="numeric"
        />
        <Text style={s.label}>Annual Interest Rate (%)</Text>
        <TextInput
          style={s.input}
          placeholder={simType === 'student' ? 'e.g. 5.5' : 'e.g. 20'}
          placeholderTextColor={colors.textTertiary}
          value={rate} onChangeText={setRate} keyboardType="numeric"
        />
        <Text style={s.label}>Monthly Payment ($)</Text>
        <TextInput
          style={s.input} placeholder="e.g. 300"
          placeholderTextColor={colors.textTertiary}
          value={payment} onChangeText={setPayment} keyboardType="numeric"
        />
        {error ? (
          <View style={s.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
            <Text style={s.errorText}>{error}</Text>
          </View>
        ) : null}
        <TouchableOpacity style={s.calcBtn} onPress={simulate}>
          <Text style={s.calcBtnText}>Calculate Payoff</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {result && (
        <>
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Ionicons name="bar-chart-outline" size={18} color={colors.primary} />
              <Text style={s.cardTitle}>Payoff Summary</Text>
            </View>
            <View style={s.resultsGrid}>
              <View style={s.resultItem}>
                <Text style={s.resultLabel}>Payoff Time</Text>
                <Text style={[s.resultValue, { color: colors.primary }]}>{years}y {months}mo</Text>
              </View>
              <View style={s.resultDivider} />
              <View style={s.resultItem}>
                <Text style={s.resultLabel}>Total Interest</Text>
                <Text style={[s.resultValue, { color: colors.danger }]}>${result.totalInterest.toFixed(2)}</Text>
              </View>
              <View style={s.resultDivider} />
              <View style={s.resultItem}>
                <Text style={s.resultLabel}>Total Paid</Text>
                <Text style={[s.resultValue, { color: colors.success }]}>${result.totalPaid.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <View style={s.card}>
            <View style={s.cardHeader}>
              <Ionicons name="trending-down-outline" size={18} color={colors.primary} />
              <Text style={s.cardTitle}>Balance Over Time</Text>
            </View>
            <LineChart
              data={{ labels: result.chartLabels, datasets: [{ data: result.chartData }] }}
              width={W - 80}
              height={200}
              chartConfig={{
                backgroundColor: colors.surface,
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
                decimalPlaces: 0,
                color: (o = 1) => `rgba(59, 130, 246, ${o})`,
                labelColor: (o = 1) => `rgba(148, 163, 184, ${o})`,
                propsForDots: { r: '4', strokeWidth: '2', stroke: colors.primary },
              }}
              bezier
              style={{ borderRadius: 8 }}
            />
          </View>

          <View style={s.card}>
            <View style={s.cardHeader}>
              <Ionicons name="bulb-outline" size={18} color={colors.primary} />
              <Text style={s.cardTitle}>Tips</Text>
            </View>
            {TIPS[simType].map((tip, i) => (
              <View key={i} style={s.tipRow}>
                <View style={s.tipDot} />
                <Text style={s.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  toggleRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  toggleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  toggleText: { color: colors.textSecondary, fontWeight: '600', fontSize: 14 },
  toggleTextActive: { color: '#fff' },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 },
  label: { fontSize: 12, color: colors.textSecondary, marginBottom: 6 },
  input: { backgroundColor: colors.surfaceSecondary, color: colors.textPrimary, borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 14 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.dangerLight, padding: 10, borderRadius: 8, marginBottom: 10 },
  errorText: { color: colors.danger, fontSize: 13, flex: 1 },
  calcBtn: { backgroundColor: colors.primary, borderRadius: 8, padding: 13, alignItems: 'center' },
  calcBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  resultsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  resultItem: { alignItems: 'center', flex: 1 },
  resultLabel: { color: colors.textSecondary, fontSize: 12, marginBottom: 4 },
  resultValue: { fontSize: 16, fontWeight: '700' },
  resultDivider: { width: 1, backgroundColor: colors.border },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  tipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginTop: 6 },
  tipText: { color: colors.textSecondary, fontSize: 14, lineHeight: 22, flex: 1 },
});