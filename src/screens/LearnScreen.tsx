import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const TOPICS = [
  {
    id: '1',
    icon: 'trending-up-outline',
    title: 'What is Investing?',
    summary: 'Learn the basics of growing your money over time.',
    content: `Investing means putting your money to work so it can grow over time. Instead of letting money sit in a savings account, you invest it in assets like stocks, bonds, or real estate.

Key concepts:
• Return: The profit you make on an investment
• Risk: The chance that you could lose money
• Diversification: Spreading investments to reduce risk

Why start early?
The earlier you start investing, the more time your money has to grow through compound interest — earning returns on your returns.

Example: $1,000 invested at 7% annual return becomes ~$7,612 in 30 years without adding a single dollar.`,
  },
  {
    id: '2',
    icon: 'bar-chart-outline',
    title: 'Stocks vs Bonds',
    summary: 'Understand the two most common investment types.',
    content: `Stocks and bonds are the two most common investment types, and they work very differently.

Stocks:
• Represent ownership in a company
• Higher potential returns (avg ~7-10%/year historically)
• Higher risk — prices can drop significantly
• Best for long-term goals (5+ years away)

Bonds:
• You lend money to a company or government
• Lower but more predictable returns (~2-5%)
• Lower risk than stocks
• Best for short-term goals or stability

A common beginner strategy is to hold a mix of both based on your age and risk tolerance.`,
  },
  {
    id: '3',
    icon: 'stats-chart-outline',
    title: 'Compound Interest',
    summary: 'The most powerful force in personal finance.',
    content: `Compound interest is often called the 8th wonder of the world — and for good reason.

How it works:
You earn interest not just on your original money, but also on the interest you have already earned. This creates a snowball effect over time.

Formula: A = P(1 + r/n)^(nt)
• P = Principal (starting amount)
• r = Annual interest rate
• n = Times compounded per year
• t = Time in years

Example:
$5,000 at 6% interest compounded monthly for 20 years = $16,551

The key takeaway: Time is your biggest asset. Starting at 20 vs 30 can mean hundreds of thousands of dollars difference at retirement.`,
  },
  {
    id: '4',
    icon: 'shield-checkmark-outline',
    title: 'Emergency Fund',
    summary: 'Why every student needs one and how to build it.',
    content: `An emergency fund is money set aside for unexpected expenses — a medical bill, car repair, or sudden job loss.

Why it matters:
Without an emergency fund, unexpected costs often go on a credit card, leading to high-interest debt that is hard to escape.

How much should you save?
• Students: At least $500–$1,000 to start
• Working adults: 3–6 months of living expenses

Where to keep it:
• High-yield savings account (earns more interest than regular savings)
• Keep it separate from your spending money
• Should be easy to access but not too easy to spend

Building it:
Start small — even $25/month adds up. Automate transfers so you do not have to think about it.`,
  },
  {
    id: '5',
    icon: 'card-outline',
    title: 'Credit Score Basics',
    summary: 'What it is, why it matters, and how to build it.',
    content: `Your credit score is a number (300–850) that tells lenders how trustworthy you are with money. A higher score means better loan terms and lower interest rates.

What affects your score:
• Payment history (35%) — Pay on time, every time
• Credit utilization (30%) — Keep usage below 30% of your limit
• Length of credit history (15%) — Older accounts help
• Credit mix (10%) — Having different types of credit
• New inquiries (10%) — Do not apply for too many cards at once

Score ranges:
• 800–850: Exceptional
• 740–799: Very Good
• 670–739: Good
• 580–669: Fair
• Below 580: Poor`,
  },
  {
    id: '6',
    icon: 'school-outline',
    title: 'Student Loan Strategy',
    summary: 'Smart ways to manage and pay off student debt.',
    content: `Student loans are one of the biggest financial burdens for college graduates. Having a strategy makes a huge difference.

Types of loans:
• Federal loans — Lower rates, more protections, income-driven repayment options
• Private loans — Higher rates, less flexibility

Repayment strategies:
• Avalanche method: Pay highest interest rate first (saves most money)
• Snowball method: Pay smallest balance first (best for motivation)
• Income-driven repayment: Payments capped at % of your income

Tips:
• Make interest payments while in school if you can
• Look into Public Service Loan Forgiveness (PSLF)
• Even $50 extra per month can save thousands over the loan life`,
  },
];

export default function LearnScreen() {
  const { colors } = useTheme();
  const s = styles(colors);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);

  const toggle = (id: string) => setExpanded(expanded === id ? null : id);
  const markDone = (id: string) => {
    if (!completed.includes(id)) setCompleted([...completed, id]);
    setExpanded(null);
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Progress Header */}
      <View style={s.progressCard}>
        <View style={s.progressHeader}>
          <Text style={s.progressTitle}>Your Progress</Text>
          <Text style={s.progressCount}>{completed.length}/{TOPICS.length} completed</Text>
        </View>
        <View style={s.progressBg}>
          <View style={[s.progressFill, { width: `${(completed.length / TOPICS.length) * 100}%` as any }]} />
        </View>
      </View>

      {/* Topics */}
      {TOPICS.map(topic => {
        const isDone = completed.includes(topic.id);
        const isOpen = expanded === topic.id;
        return (
          <View key={topic.id} style={[s.card, isDone && s.cardDone]}>
            <TouchableOpacity style={s.cardHeader} onPress={() => toggle(topic.id)}>
              <View style={[s.iconBox, isDone && { backgroundColor: colors.successLight }]}>
                <Ionicons
                  name={topic.icon as any}
                  size={20}
                  color={isDone ? colors.success : colors.primary}
                />
              </View>
              <View style={s.cardMeta}>
                <Text style={s.topicTitle}>{topic.title}</Text>
                <Text style={s.topicSummary}>{topic.summary}</Text>
              </View>
              <View style={s.cardRight}>
                {isDone && <Ionicons name="checkmark-circle" size={18} color={colors.success} />}
                <Ionicons
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={colors.textTertiary}
                />
              </View>
            </TouchableOpacity>

            {isOpen && (
              <View style={s.expandedContent}>
                <View style={s.divider} />
                <Text style={s.contentText}>{topic.content}</Text>
                {!isDone && (
                  <TouchableOpacity style={s.doneBtn} onPress={() => markDone(topic.id)}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={s.doneBtnText}>Mark as Complete</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  progressCard: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 14 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  progressTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  progressCount: { fontSize: 13, color: colors.textSecondary },
  progressBg: { height: 6, backgroundColor: colors.border, borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  card: { backgroundColor: colors.surface, borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  cardDone: { borderLeftWidth: 3, borderLeftColor: colors.success },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  cardMeta: { flex: 1 },
  cardRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  topicTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  topicSummary: { fontSize: 12, color: colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 14 },
  expandedContent: { paddingHorizontal: 16, paddingBottom: 16 },
  contentText: { color: colors.textSecondary, fontSize: 14, lineHeight: 24, marginBottom: 16 },
  doneBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.success, borderRadius: 8, padding: 12 },
  doneBtnText: { color: '#fff', fontWeight: '600' },
});