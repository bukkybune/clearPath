import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Dimensions
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

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

  const years = result ? Math.floor(result.months / 12) : 0;
  const months = result ? result.months % 12 : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Debt Payoff Simulator</Text>

      {/* Sim Type Toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, simType === 'student' && styles.toggleActive]}
          onPress={() => { setSimType('student'); setResult(null); setRate('5.5'); }}
        >
          <Text style={[styles.toggleText, simType === 'student' && styles.toggleTextActive]}>🎓 Student Loan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, simType === 'credit' && styles.toggleActive]}
          onPress={() => { setSimType('credit'); setResult(null); setRate('20'); }}
        >
          <Text style={[styles.toggleText, simType === 'credit' && styles.toggleTextActive]}>💳 Credit Card</Text>
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {simType === 'student' ? '🎓 Student Loan Details' : '💳 Credit Card Details'}
        </Text>
        <Text style={styles.label}>Loan Balance ($)</Text>
        <TextInput
          style={styles.input} placeholder={simType === 'student' ? 'e.g. 30000' : 'e.g. 5000'}
          placeholderTextColor="#475569" value={principal} onChangeText={setPrincipal} keyboardType="numeric"
        />
        <Text style={styles.label}>Annual Interest Rate (%)</Text>
        <TextInput
          style={styles.input} placeholder={simType === 'student' ? 'e.g. 5.5' : 'e.g. 20'}
          placeholderTextColor="#475569" value={rate} onChangeText={setRate} keyboardType="numeric"
        />
        <Text style={styles.label}>Monthly Payment ($)</Text>
        <TextInput
          style={styles.input} placeholder="e.g. 300"
          placeholderTextColor="#475569" value={payment} onChangeText={setPayment} keyboardType="numeric"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.simBtn} onPress={simulate}>
          <Text style={styles.simBtnText}>Calculate Payoff</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {result && (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 Payoff Summary</Text>
            <View style={styles.resultsGrid}>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Payoff Time</Text>
                <Text style={styles.resultValue}>{years}y {months}mo</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Total Interest</Text>
                <Text style={[styles.resultValue, { color: '#ef4444' }]}>${result.totalInterest.toFixed(2)}</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Total Paid</Text>
                <Text style={[styles.resultValue, { color: '#38bdf8' }]}>${result.totalPaid.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📉 Balance Over Time</Text>
            <LineChart
              data={{ labels: result.chartLabels, datasets: [{ data: result.chartData }] }}
              width={W - 80}
              height={200}
              chartConfig={{
                backgroundColor: '#1e293b',
                backgroundGradientFrom: '#1e293b',
                backgroundGradientTo: '#1e293b',
                decimalPlaces: 0,
                color: (o = 1) => `rgba(56, 189, 248, ${o})`,
                labelColor: (o = 1) => `rgba(148, 163, 184, ${o})`,
                propsForDots: { r: '4', strokeWidth: '2', stroke: '#38bdf8' },
              }}
              bezier
              style={{ borderRadius: 8 }}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>💡 Tips</Text>
            {simType === 'student' ? (
              <>
                <Text style={styles.tip}>• Even $50 extra/month can save thousands in interest</Text>
                <Text style={styles.tip}>• Consider income-driven repayment plans if payments are too high</Text>
                <Text style={styles.tip}>• Look into loan forgiveness programs if you work in public service</Text>
              </>
            ) : (
              <>
                <Text style={styles.tip}>• Always pay more than the minimum to avoid debt traps</Text>
                <Text style={styles.tip}>• Consider the avalanche method: pay highest interest first</Text>
                <Text style={styles.tip}>• A balance transfer to a lower rate card could save money</Text>
              </>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#f1f5f9', marginBottom: 16 },
  toggleRow: { flexDirection: 'row', marginBottom: 16, gap: 10 },
  toggleBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
  toggleActive: { backgroundColor: '#38bdf8', borderColor: '#38bdf8' },
  toggleText: { color: '#94a3b8', fontWeight: 'bold' },
  toggleTextActive: { color: '#0f172a' },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#38bdf8', marginBottom: 12 },
  label: { color: '#94a3b8', fontSize: 13, marginBottom: 6 },
  input: { backgroundColor: '#0f172a', color: '#f1f5f9', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  error: { color: '#ef4444', fontSize: 13, marginBottom: 10 },
  simBtn: { backgroundColor: '#818cf8', borderRadius: 8, padding: 13, alignItems: 'center' },
  simBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  resultsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  resultItem: { alignItems: 'center', flex: 1 },
  resultLabel: { color: '#94a3b8', fontSize: 12, marginBottom: 4 },
  resultValue: { fontSize: 16, fontWeight: 'bold', color: '#34d399' },
  tip: { color: '#94a3b8', fontSize: 13, lineHeight: 22 },
});