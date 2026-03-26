import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

export const TOPICS = [
  {
    id: '1',
    icon: 'trending-up-outline',
    title: 'What is Investing?',
    summary: 'Learn the basics of growing your money over time.',
    duration: '5 min read',
    content: `Investing means putting your money to work so it can grow over time. Instead of letting money sit in a savings account, you invest it in assets like stocks, bonds, or real estate.

Key Concepts

Return: The profit you make on an investment. Returns can come from price appreciation (the asset becomes worth more) or income like dividends.

Risk: The chance that you could lose money. Higher potential returns usually come with higher risk. Understanding your personal risk tolerance is key to building a good investment strategy.

Diversification: Spreading your investments across different assets to reduce risk. The idea is that if one investment performs poorly, others may perform well and offset the loss.

Time Horizon: How long you plan to keep your money invested. Longer time horizons allow you to ride out market downturns and take advantage of compound growth.

Why Start Early?

The earlier you start investing, the more time your money has to grow through compound interest — earning returns on your returns.

Example: $1,000 invested at 7% annual return becomes approximately $7,612 in 30 years without adding a single dollar. If you wait 10 years to start, that same $1,000 only grows to about $3,870.

Where to Start as a Student

• Open a Roth IRA if you have earned income — contributions grow tax-free
• Consider low-cost index funds which automatically diversify across hundreds of companies
• Use your school's financial aid office or free resources like Investopedia to learn more
• Even investing $25/month consistently can build meaningful wealth over time`,
    quiz: [
      {
        question: 'What does diversification mean in investing?',
        options: [
          'Putting all your money in one stock',
          'Spreading investments across different assets to reduce risk',
          'Only investing in government bonds',
          'Saving money in a bank account',
        ],
        answer: 1,
      },
      {
        question: 'Why is starting to invest early beneficial?',
        options: [
          'You pay less taxes',
          'The stock market always goes up',
          'Compound interest has more time to grow your money',
          'Banks give you better rates',
        ],
        answer: 2,
      },
      {
        question: 'What is a Roth IRA best known for?',
        options: [
          'High interest savings',
          'Tax-free growth on contributions',
          'Government guaranteed returns',
          'No contribution limits',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: '2',
    icon: 'bar-chart-outline',
    title: 'Stocks vs Bonds',
    summary: 'Understand the two most common investment types.',
    duration: '4 min read',
    content: `Stocks and bonds are the two most common investment types, and they work very differently. Understanding both is essential to building a balanced portfolio.

Stocks

When you buy a stock, you are buying a small ownership stake in a company. If the company grows and becomes more valuable, your stock is worth more. If it struggles, your stock loses value.

• Average historical returns: ~7-10% per year (S&P 500)
• Higher risk — prices can be volatile day to day
• Best suited for long-term goals (5+ years away)
• Examples: Apple, Google, Amazon

Bonds

When you buy a bond, you are lending money to a company or government. They promise to pay you back with interest after a set period.

• Average returns: ~2-5% per year
• Lower risk — more predictable income
• Best for short-term goals or preserving wealth
• Examples: US Treasury bonds, corporate bonds

Finding the Right Balance

A common rule of thumb is to subtract your age from 110 to find what percentage to put in stocks. So a 20-year-old might put 90% in stocks and 10% in bonds.

As you get older and closer to needing the money, you shift more into bonds for stability. This is called asset allocation.`,
    quiz: [
      {
        question: 'When you buy a stock, what are you actually buying?',
        options: [
          'A loan to a company',
          'A small ownership stake in a company',
          'A government savings bond',
          'A certificate of deposit',
        ],
        answer: 1,
      },
      {
        question: 'Which investment type is generally considered lower risk?',
        options: ['Stocks', 'Cryptocurrency', 'Bonds', 'Real estate'],
        answer: 2,
      },
      {
        question: 'What is asset allocation?',
        options: [
          'Buying only one type of investment',
          'Distributing investments across different asset types based on goals',
          'Selling all investments when the market drops',
          'Only investing in index funds',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: '3',
    icon: 'stats-chart-outline',
    title: 'Compound Interest',
    summary: 'The most powerful force in personal finance.',
    duration: '4 min read',
    content: `Compound interest is often called the 8th wonder of the world. It is the process of earning interest on both your original money and the interest you have already earned.

How It Works

Simple interest: You earn interest only on your original amount.
Compound interest: You earn interest on your original amount AND on previous interest earned.

Example:
$1,000 at 10% simple interest for 3 years = $1,300
$1,000 at 10% compound interest for 3 years = $1,331

That difference gets dramatically larger over longer periods.

The Formula

A = P(1 + r/n)^(nt)

• A = Final amount
• P = Principal (starting amount)
• r = Annual interest rate (as a decimal)
• n = Times interest compounds per year
• t = Time in years

Real World Example

$5,000 invested at 6% interest compounded monthly for 20 years grows to $16,551 — more than tripling your money without adding anything extra.

The Key Takeaway

Time is your most powerful asset. Starting at 20 vs 30 can mean hundreds of thousands of dollars difference at retirement. Even small amounts invested consistently can grow to significant wealth through compound interest.`,
    quiz: [
      {
        question: 'What makes compound interest different from simple interest?',
        options: [
          'It has higher interest rates',
          'You earn interest on both principal and previously earned interest',
          'It is only available through banks',
          'It guarantees no losses',
        ],
        answer: 1,
      },
      {
        question: 'In the formula A = P(1 + r/n)^(nt), what does P represent?',
        options: ['The final amount', 'The interest rate', 'The principal or starting amount', 'Time in years'],
        answer: 2,
      },
      {
        question: 'What is the biggest factor that maximizes compound interest growth?',
        options: ['A high interest rate', 'Starting early and giving it more time', 'Making large one-time deposits', 'Choosing monthly compounding'],
        answer: 1,
      },
    ],
  },
  {
    id: '4',
    icon: 'shield-checkmark-outline',
    title: 'Emergency Fund',
    summary: 'Why every student needs one and how to build it.',
    duration: '3 min read',
    content: `An emergency fund is a dedicated savings buffer for unexpected expenses. It is the foundation of any solid financial plan.

Why It Matters

Without an emergency fund, a single unexpected expense — a medical bill, car repair, or lost job — often leads to credit card debt with high interest rates. This creates a cycle that can take years to escape.

With an emergency fund, you can handle these situations without derailing your financial progress.

How Much Should You Save?

Students: $500 to $1,000 to start. This covers most common emergencies.
Working adults: 3 to 6 months of living expenses.
Self-employed: 6 to 12 months due to income variability.

Where to Keep It

• High-yield savings account (HYSA): Earns significantly more interest than a regular savings account. Options include Marcus by Goldman Sachs, Ally, or SoFi.
• Keep it separate from your everyday checking account to reduce temptation to spend it.
• It should be liquid — accessible within a day or two — but not too easy to spend.

How to Build It

Start with a goal of $500. Set up an automatic transfer of even $10 or $25 per paycheck. You will not miss the small amounts, but they add up faster than you expect.

Once you have your initial fund, focus on other goals and come back to grow it over time.`,
    quiz: [
      {
        question: 'What is the recommended emergency fund size for a working adult?',
        options: ['$500', '$1,000', '3 to 6 months of living expenses', '1 year of salary'],
        answer: 2,
      },
      {
        question: 'Where is the best place to keep an emergency fund?',
        options: [
          'Invested in stocks for growth',
          'Under your mattress',
          'In a high-yield savings account',
          'In cryptocurrency',
        ],
        answer: 2,
      },
      {
        question: 'Why is an emergency fund important?',
        options: [
          'It helps you buy luxury items',
          'It prevents unexpected expenses from causing high-interest debt',
          'It replaces the need for insurance',
          'It earns the highest investment returns',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: '5',
    icon: 'card-outline',
    title: 'Credit Score Basics',
    summary: 'What it is, why it matters, and how to build it.',
    duration: '5 min read',
    content: `Your credit score is a three-digit number between 300 and 850 that represents your creditworthiness — how reliably you repay debt. Lenders use it to decide whether to give you loans and at what interest rate.

Why It Matters

A good credit score can save you tens of thousands of dollars over your lifetime through lower interest rates on mortgages, car loans, and credit cards. It can also affect your ability to rent an apartment or even get certain jobs.

What Affects Your Score

Payment history (35%): The most important factor. Paying on time, every time, is critical. Even one missed payment can significantly hurt your score.

Credit utilization (30%): How much of your available credit you are using. Keep it below 30% — ideally below 10% for the best scores.

Length of credit history (15%): Older accounts help your score. Avoid closing old credit cards even if you do not use them.

Credit mix (10%): Having different types of credit (cards, loans) helps slightly.

New inquiries (10%): Each time you apply for new credit, it can slightly lower your score temporarily.

Score Ranges

• 800 to 850: Exceptional — best rates available
• 740 to 799: Very Good
• 670 to 739: Good — most loans approved
• 580 to 669: Fair — higher rates
• Below 580: Poor — difficult to get approved

Building Credit as a Student

• Get a secured credit card — you deposit money as collateral
• Become an authorized user on a parent's card
• Use your card for small purchases and pay the full balance monthly
• Never miss a payment — set up autopay`,
    quiz: [
      {
        question: 'What is the most important factor affecting your credit score?',
        options: ['Credit utilization', 'Payment history', 'Length of credit history', 'Credit mix'],
        answer: 1,
      },
      {
        question: 'What credit utilization rate is generally recommended?',
        options: ['Below 70%', 'Below 50%', 'Below 30%', 'It does not matter'],
        answer: 2,
      },
      {
        question: 'What credit score range is considered "Exceptional"?',
        options: ['670 to 739', '740 to 799', '800 to 850', '580 to 669'],
        answer: 2,
      },
    ],
  },
  {
    id: '6',
    icon: 'school-outline',
    title: 'Student Loan Strategy',
    summary: 'Smart ways to manage and pay off student debt.',
    duration: '5 min read',
    content: `Student loans are one of the biggest financial challenges facing college graduates today. Having a clear strategy can save you thousands of dollars and years of repayment.

Types of Student Loans

Federal loans: Issued by the government. They offer lower fixed interest rates, income-driven repayment options, and access to forgiveness programs. Always exhaust federal options before considering private loans.

Private loans: Issued by banks or credit unions. They often have higher rates and fewer protections. Refinancing options exist but may cost you federal benefits.

Repayment Strategies

Avalanche method: Pay the minimum on all loans, then put extra money toward the loan with the highest interest rate. This saves the most money in interest over time.

Snowball method: Pay the minimum on all loans, then focus extra payments on the smallest balance. This builds motivation through quick wins.

Income-driven repayment (IDR): Federal plans that cap monthly payments at a percentage of your discretionary income. Good if your income is low relative to your debt.

Key Tips

• Start making interest payments while in school if possible — this prevents interest from capitalizing
• Look into Public Service Loan Forgiveness (PSLF) if you plan to work for a government or nonprofit organization
• Even $50 extra per month can shave years off your repayment and save thousands in interest
• Refinancing federal loans to private can get you a lower rate but you lose access to IDR plans and forgiveness programs`,
    quiz: [
      {
        question: 'Which repayment strategy saves the most money in interest?',
        options: ['Snowball method', 'Minimum payments only', 'Avalanche method', 'Income-driven repayment'],
        answer: 2,
      },
      {
        question: 'What is a risk of refinancing federal student loans to private loans?',
        options: [
          'Higher monthly payments',
          'You lose access to federal protections and forgiveness programs',
          'Your interest rate always increases',
          'You cannot pay them off early',
        ],
        answer: 1,
      },
      {
        question: 'What does PSLF stand for?',
        options: [
          'Private Student Loan Forgiveness',
          'Public Service Loan Forgiveness',
          'Partial Student Loan Forgiveness',
          'Primary School Loan Forgiveness',
        ],
        answer: 1,
      },
    ],
  },
];

export default function LearnScreen({ navigation }: any) {
  const { colors } = useTheme();
  const s = styles(colors);
  const uid = auth.currentUser?.uid;
  const [completed, setCompleted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    getDoc(doc(db, 'userProgress', uid))
      .then(snap => {
        if (snap.exists()) setCompleted(snap.data().completedLessons ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [uid]);

  const markComplete = async (lessonId: string) => {
    if (completed.includes(lessonId)) return;
    const updated = [...completed, lessonId];
    setCompleted(updated);
    if (uid) {
      await setDoc(doc(db, 'userProgress', uid), { completedLessons: updated }, { merge: true });
    }
  };

  if (loading) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

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
        return (
          <TouchableOpacity
            key={topic.id}
            style={[s.card, isDone && s.cardDone]}
            onPress={() => navigation.navigate('Lesson', { topic, completed, onComplete: markComplete })}
            activeOpacity={0.7}
          >
            <View style={[s.iconBox, isDone && { backgroundColor: colors.successLight }]}>
              <Ionicons name={topic.icon as any} size={20} color={isDone ? colors.success : colors.primary} />
            </View>
            <View style={s.cardMeta}>
              <Text style={s.topicTitle}>{topic.title}</Text>
              <Text style={s.topicSummary}>{topic.summary}</Text>
              <View style={s.metaRow}>
                <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                <Text style={s.duration}>{topic.duration}</Text>
                {isDone && (
                  <>
                    <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                    <Text style={[s.duration, { color: colors.success }]}>Completed</Text>
                  </>
                )}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
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
  card: { backgroundColor: colors.surface, borderRadius: 12, marginBottom: 10, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardDone: { borderLeftWidth: 3, borderLeftColor: colors.success },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  cardMeta: { flex: 1 },
  topicTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  topicSummary: { fontSize: 12, color: colors.textSecondary, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  duration: { fontSize: 11, color: colors.textTertiary },
});
