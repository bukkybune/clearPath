import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated
} from 'react-native';

const TOPICS = [
  {
    id: '1',
    emoji: '📈',
    title: 'What is Investing?',
    summary: 'Learn the basics of growing your money over time.',
    content: `Investing means putting your money to work so it can grow over time. Instead of letting money sit in a savings account, you invest it in assets like stocks, bonds, or real estate.

Key concepts:
• Return: The profit you make on an investment
• Risk: The chance that you could lose money
• Diversification: Spreading investments to reduce risk

Why start early?
The earlier you start investing, the more time your money has to grow through compound interest — earning returns on your returns.

Example: $1,000 invested at 7% annual return becomes ~$7,612 in 30 years without adding a single dollar!`,
  },
  {
    id: '2',
    emoji: '🏦',
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
    emoji: '💹',
    title: 'Compound Interest',
    summary: 'The most powerful force in personal finance.',
    content: `Compound interest is often called the 8th wonder of the world — and for good reason.

How it works:
You earn interest not just on your original money, but also on the interest you've already earned. This creates a snowball effect over time.

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
    emoji: '🎯',
    title: 'Emergency Fund',
    summary: 'Why every student needs one and how to build it.',
    content: `An emergency fund is money set aside for unexpected expenses — a medical bill, car repair, or sudden job loss.

Why it matters:
Without an emergency fund, unexpected costs often go on a credit card, leading to high-interest debt that's hard to escape.

How much should you save?
• Students: At least $500–$1,000 to start
• Working adults: 3–6 months of living expenses

Where to keep it:
• High-yield savings account (earns more interest than regular savings)
• Keep it separate from your spending money
• Should be easy to access but not too easy to spend

Building it:
Start small — even $25/month adds up. Automate transfers so you don't have to think about it.`,
  },
  {
    id: '5',
    emoji: '💳',
    title: 'Credit Score Basics',
    summary: 'What it is, why it matters, and how to build it.',
    content: `Your credit score is a number (300–850) that tells lenders how trustworthy you are with money. A higher score means better loan terms and lower interest rates.

What affects your score:
• Payment history (35%) — Pay on time, every time
• Credit utilization (30%) — Keep usage below 30% of your limit
• Length of credit history (15%) — Older accounts help
• Credit mix (10%) — Having different types of credit
• New inquiries (10%) — Don't apply for too many cards at once

Score ranges:
• 800–850: Exceptional
• 740–799: Very Good
• 670–739: Good
• 580–669: Fair
• Below 580: Poor

As a student, a secured credit card or becoming an authorized user on a parent's account are great ways to start building credit.`,
  },
  {
    id: '6',
    emoji: '🎓',
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
• Look into Public Service Loan Forgiveness (PSLF) if entering public service
• Refinancing can lower your rate but loses federal protections
• Even $50 extra per month can save thousands over the loan life`,
  },
];

export default function LearnScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);

  const toggle = (id: string) => setExpanded(expanded === id ? null : id);
  const markDone = (id: string) => {
    if (!completed.includes(id)) setCompleted([...completed, id]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Financial Learning Hub</Text>
      <Text style={styles.subtitle}>
        {completed.length}/{TOPICS.length} topics completed
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${(completed.length / TOPICS.length) * 100}%` as any }]} />
      </View>

      {TOPICS.map(topic => (
        <View key={topic.id} style={[styles.card, completed.includes(topic.id) && styles.cardDone]}>
          <TouchableOpacity style={styles.cardHeader} onPress={() => toggle(topic.id)}>
            <View style={styles.cardLeft}>
              <Text style={styles.emoji}>{topic.emoji}</Text>
              <View>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicSummary}>{topic.summary}</Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              {completed.includes(topic.id) && <Text style={styles.checkmark}>✅</Text>}
              <Text style={styles.arrow}>{expanded === topic.id ? '▲' : '▼'}</Text>
            </View>
          </TouchableOpacity>

          {expanded === topic.id && (
            <View style={styles.expandedContent}>
              <View style={styles.divider} />
              <Text style={styles.contentText}>{topic.content}</Text>
              {!completed.includes(topic.id) && (
                <TouchableOpacity style={styles.doneBtn} onPress={() => markDone(topic.id)}>
                  <Text style={styles.doneBtnText}>✓ Mark as Complete</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#f1f5f9', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#94a3b8', marginBottom: 12 },
  progressBg: { height: 8, backgroundColor: '#1e293b', borderRadius: 4, marginBottom: 20 },
  progressFill: { height: 8, backgroundColor: '#38bdf8', borderRadius: 4 },
  card: {
    backgroundColor: '#1e293b', borderRadius: 12, marginBottom: 12,
    borderWidth: 1, borderColor: '#334155', overflow: 'hidden'
  },
  cardDone: { borderColor: '#34d399' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  cardRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  emoji: { fontSize: 28 },
  topicTitle: { fontSize: 15, fontWeight: 'bold', color: '#f1f5f9', marginBottom: 2 },
  topicSummary: { fontSize: 12, color: '#94a3b8', maxWidth: 220 },
  checkmark: { fontSize: 16 },
  arrow: { color: '#475569', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#334155', marginBottom: 16 },
  expandedContent: { paddingHorizontal: 16, paddingBottom: 16 },
  contentText: { color: '#cbd5e1', fontSize: 14, lineHeight: 24 },
  doneBtn: {
    backgroundColor: '#34d399', borderRadius: 8, padding: 12,
    alignItems: 'center', marginTop: 16
  },
  doneBtnText: { color: '#0f172a', fontWeight: 'bold' },
});