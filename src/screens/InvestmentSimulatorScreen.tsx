import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';

const W = Dimensions.get('window').width;

export default function InvestmentSimulatorScreen() {
  const { colors } = useTheme();
  const s = styles(colors);

  const [principal, setPrincipal] = useState('1000');
  const [monthly, setMonthly] = useState('100');
  const [rate, setRate] = useState('7');
  const [simYears, setSimYears] = useState('10');

  const simResult = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const PMT = parseFloat(monthly) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const Y = Math.min(Math.max(Math.floor(parseFloat(simYears) || 1), 1), 50);

    const yearlyValues: number[] = [];
    for (let y = 0; y <= Y; y++) {
      const n = y * 12;
      const value =
        r === 0
          ? P + PMT * n
          : P * Math.pow(1 + r, n) + (PMT * (Math.pow(1 + r, n) - 1)) / r;
      yearlyValues.push(Math.round(value));
    }

    const finalValue = yearlyValues[Y];
    const totalContributed = P + PMT * Y * 12;
    const totalInterest = finalValue - totalContributed;
    const step = Math.max(1, Math.ceil(Y / 6));
    const labels = yearlyValues.map((_, i) => (i % step === 0 || i === Y ? `Y${i}` : ''));

    return { yearlyValues, labels, finalValue, totalContributed, totalInterest };
  }, [principal, monthly, rate, simYears]);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* Inputs */}
      <View style={s.card}>
        <Text style={s.sectionTitle}>Your Investment</Text>
        <View style={s.inputGrid}>
          <View style={s.inputCell}>
            <Text style={s.label}>Initial Amount ($)</Text>
            <TextInput
              style={s.input} value={principal} onChangeText={setPrincipal}
              keyboardType="numeric" placeholderTextColor={colors.textTertiary} placeholder="1000"
            />
          </View>
          <View style={s.inputCell}>
            <Text style={s.label}>Monthly ($)</Text>
            <TextInput
              style={s.input} value={monthly} onChangeText={setMonthly}
              keyboardType="numeric" placeholderTextColor={colors.textTertiary} placeholder="100"
            />
          </View>
          <View style={s.inputCell}>
            <Text style={s.label}>Annual Return (%)</Text>
            <TextInput
              style={s.input} value={rate} onChangeText={setRate}
              keyboardType="numeric" placeholderTextColor={colors.textTertiary} placeholder="7"
            />
          </View>
          <View style={s.inputCell}>
            <Text style={s.label}>Years (max 50)</Text>
            <TextInput
              style={s.input} value={simYears} onChangeText={setSimYears}
              keyboardType="numeric" placeholderTextColor={colors.textTertiary} placeholder="10"
            />
          </View>
        </View>
      </View>

      {/* Results */}
      <View style={s.resultRow}>
        <View style={s.resultItem}>
          <Text style={s.resultLabel}>Final Value</Text>
          <Text style={[s.resultValue, { color: colors.primary }]}>
            ${simResult.finalValue.toLocaleString()}
          </Text>
        </View>
        <View style={s.resultDivider} />
        <View style={s.resultItem}>
          <Text style={s.resultLabel}>Contributed</Text>
          <Text style={s.resultValue}>
            ${Math.round(simResult.totalContributed).toLocaleString()}
          </Text>
        </View>
        <View style={s.resultDivider} />
        <View style={s.resultItem}>
          <Text style={s.resultLabel}>Interest Earned</Text>
          <Text style={[s.resultValue, { color: colors.success }]}>
            ${Math.round(simResult.totalInterest).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Chart */}
      <View style={s.card}>
        <LineChart
          data={{ labels: simResult.labels, datasets: [{ data: simResult.yearlyValues }] }}
          width={W - 72}
          height={220}
          chartConfig={{
            backgroundColor: colors.surface,
            backgroundGradientFrom: colors.surface,
            backgroundGradientTo: colors.surface,
            decimalPlaces: 0,
            color: (opacity = 1) =>
              `rgba(${colors.primary === '#2563EB' ? '37,99,235' : '59,130,246'},${opacity})`,
            labelColor: () => colors.textTertiary,
            propsForDots: { r: '3', strokeWidth: '2', stroke: colors.primary },
            propsForBackgroundLines: { stroke: colors.border },
          }}
          formatYLabel={v => {
            const n = Number(v);
            if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
            if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
            return `$${n}`;
          }}
          bezier
          style={s.chart}
          withInnerLines
          withOuterLines={false}
        />
      </View>

      {/* Explainer */}
      <View style={s.card}>
        <Text style={s.explainerTitle}>How it works</Text>
        <Text style={s.explainerText}>
          This calculator uses compound interest with monthly contributions. Your money earns
          returns on both the principal and all previously earned interest — that's the power of
          compounding.{'\n\n'}
          The S&P 500 has historically returned ~7% annually after inflation. Your actual returns
          will vary.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 14 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 14 },
  inputGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  inputCell: { width: '47%' },
  label: { fontSize: 11, color: colors.textSecondary, marginBottom: 5 },
  input: {
    backgroundColor: colors.surfaceSecondary, color: colors.textPrimary,
    borderRadius: 8, padding: 10, fontSize: 14,
  },
  resultRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 14,
  },
  resultItem: { flex: 1, alignItems: 'center' },
  resultLabel: { fontSize: 11, color: colors.textSecondary, marginBottom: 4 },
  resultValue: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  resultDivider: { width: 1, height: 40, backgroundColor: colors.border },
  chart: { borderRadius: 8, marginLeft: -16 },
  explainerTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
  explainerText: { fontSize: 13, color: colors.textSecondary, lineHeight: 22 },
});
