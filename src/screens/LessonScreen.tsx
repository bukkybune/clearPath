import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { usePoints } from '../hooks/usePoints';
import { sampleQuestions } from '../utils/quizUtils';
import type { Question } from '../utils/quizUtils';
import { TOPICS } from '../data/lessons';

// ── Content renderer ─────────────────────────────────────────────────────────
// Parses the plain-text lesson content into styled sections (headers, body
// paragraphs, and bullet lists) so long content is easy to scan.
function ContentRenderer({ content, colors }: { content: string; colors: any }) {
  const blocks = content.split('\n\n').filter(b => b.trim().length > 0);
  return (
    <View>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        // A block is a section header if it's short, single-line, has no math
        // symbols, and doesn't end with a colon (which marks intro sentences).
        const isHeader =
          trimmed.length < 65 &&
          !trimmed.includes('\n') &&
          !trimmed.includes('=') &&
          !trimmed.endsWith(':');

        if (isHeader) {
          return (
            <Text
              key={i}
              style={{
                fontSize: 16, fontWeight: '700',
                color: colors.textPrimary,
                marginTop: i === 0 ? 0 : 20, marginBottom: 8,
              }}
            >
              {trimmed}
            </Text>
          );
        }

        const lines = trimmed.split('\n');
        if (lines.some(l => l.startsWith('•'))) {
          return (
            <View key={i} style={{ marginBottom: 12 }}>
              {lines.map((line, j) =>
                line.startsWith('•') ? (
                  <View key={j} style={{ flexDirection: 'row', gap: 8, marginBottom: 5, alignItems: 'flex-start' }}>
                    <Text style={{ color: colors.primary, fontSize: 15, lineHeight: 24 }}>•</Text>
                    <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 24, flex: 1 }}>
                      {line.slice(1).trim()}
                    </Text>
                  </View>
                ) : line.trim() ? (
                  <Text key={j} style={{ fontSize: 15, color: colors.textSecondary, lineHeight: 26, marginBottom: 6 }}>
                    {line.trim()}
                  </Text>
                ) : null
              )}
            </View>
          );
        }

        return (
          <Text key={i} style={{ fontSize: 15, color: colors.textSecondary, lineHeight: 26, marginBottom: 12 }}>
            {trimmed}
          </Text>
        );
      })}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function LessonScreen({ route, navigation }: any) {
  const { colors } = useTheme();
  const s = styles(colors);

  const { completed, markComplete, markGuideRead } = useProgress();
  const { addPoints, awardMilestone, awardedMilestones } = usePoints();
  const { topic, questionBank } = route.params;
  const isGuide: boolean = topic.type === 'guide';

  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Question[]>(topic.quiz ?? []);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const celebAnim = useRef(new Animated.Value(0)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const isDone: boolean = completed?.includes(topic.id) ?? false;

  useEffect(() => () => { if (navTimerRef.current) clearTimeout(navTimerRef.current); }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(1400),
      Animated.timing(toastAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => setToastMsg(null));
  };

  const score = submitted
    ? currentQuiz.filter((q, i) => answers[i] === q.answer).length
    : 0;
  const passed = submitted && score >= Math.ceil(currentQuiz.length * 2 / 3);

  // Celebration pop-in when quiz is passed
  useEffect(() => {
    if (passed) {
      Animated.spring(celebAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }
  }, [passed]);

  const handleScroll = useCallback((e: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const max = contentSize.height - layoutMeasurement.height;
    if (max <= 0) return;
    setScrollProgress(Math.min(Math.max(contentOffset.y / max, 0), 1));
  }, []);

  const handleAnswer = (qIdx: number, aIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: aIdx }));
  };

  const submitQuiz = () => {
    if (Object.keys(answers).length < currentQuiz.length) {
      Alert.alert('Incomplete', 'Please answer all questions before submitting.');
      return;
    }
    setSubmitted(true);
    const correct = currentQuiz.filter((q, i) => answers[i] === q.answer).length;
    const didPass = correct >= Math.ceil(currentQuiz.length * 2 / 3);
    if (didPass && !isDone) {
      markComplete(topic.id);
      addPoints(100);
      const allDone = completed.length + 1 === TOPICS.length;
      if (allDone && !awardedMilestones.includes('all_lessons')) {
        awardMilestone('all_lessons', 200);
        showToast('🎓 +200 pts · All lessons complete!');
      } else {
        showToast('+100 pts · Lesson complete!');
      }
    }
  };

  const retryQuiz = () => {
    const fresh = questionBank && questionBank.length > 0
      ? sampleQuestions(questionBank, currentQuiz.length)
      : currentQuiz;
    setCurrentQuiz(fresh);
    setAnswers({});
    setSubmitted(false);
    celebAnim.setValue(0);
  };

  return (
    <View style={s.container}>

      {/* Points toast */}
      {toastMsg && (
        <Animated.View style={[s.toast, {
          opacity: toastAnim,
          transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] }) }],
        }]}>
          <Ionicons name="star" size={14} color="#fff" />
          <Text style={s.toastText}>{toastMsg}</Text>
        </Animated.View>
      )}

      {/* Progress bar — scroll % during reading, answered % during quiz, full when submitted */}
      <View style={s.progressBarBg}>
        <View style={[s.progressBarFill, {
          width: submitted
            ? '100%'
            : showQuiz
              ? `${(Object.keys(answers).length / Math.max(currentQuiz.length, 1)) * 100}%` as any
              : `${scrollProgress * 100}%` as any,
        }]} />
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <View style={s.iconBox}>
            <Ionicons name={topic.icon} size={28} color={colors.primary} />
          </View>
          <Text style={s.title}>{topic.title}</Text>
          <View style={s.metaRow}>
            {isGuide && (
              <View style={s.guideBadge}>
                <Text style={s.guideBadgeText}>Guide</Text>
              </View>
            )}
            <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
            <Text style={s.meta}>{topic.duration}</Text>
            {isDone && !isGuide && (
              <>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={[s.meta, { color: colors.success }]}>Completed</Text>
              </>
            )}
          </View>
        </View>

        {!showQuiz ? (
          <>
            {/* What You'll Learn */}
            {topic.keyPoints && topic.keyPoints.length > 0 && (
              <View style={s.keyPointsCard}>
                <View style={s.keyPointsHeader}>
                  <Ionicons name="list-outline" size={15} color={colors.primary} />
                  <Text style={s.keyPointsTitle}>What You'll Learn</Text>
                </View>
                {topic.keyPoints.map((point: string, i: number) => (
                  <View key={i} style={s.keyPointRow}>
                    <View style={s.keyPointDot} />
                    <Text style={s.keyPointText}>{point}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Content */}
            <View style={s.card}>
              <ContentRenderer content={topic.content} colors={colors} />
            </View>

            {/* CTA */}
            {isGuide ? (
              <TouchableOpacity style={s.quizBtn} onPress={() => {
                markGuideRead(topic.id);
                addPoints(25);
                showToast('+25 pts · Guide read!');
                navTimerRef.current = setTimeout(() => navigation.goBack(), 1800);
              }}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={s.quizBtnText}>Done Reading</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={s.quizBtn} onPress={() => setShowQuiz(true)}>
                <Ionicons name="help-circle-outline" size={20} color="#fff" />
                <Text style={s.quizBtnText}>Take the Quiz</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <View style={s.quizHeader}>
              <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
              <Text style={s.quizTitle}>Knowledge Check</Text>
              <Text style={s.quizSubtitle}>{currentQuiz.length} questions</Text>
            </View>

            {currentQuiz.map((q, qIdx) => (
              <View key={qIdx} style={s.card}>
                <Text style={s.question}>Q{qIdx + 1}. {q.question}</Text>
                {q.options.map((opt, aIdx) => {
                  let optStyle = s.option;
                  let textStyle = s.optionText;
                  if (submitted) {
                    if (aIdx === q.answer) {
                      optStyle = { ...s.option, backgroundColor: colors.successLight, borderColor: colors.success };
                      textStyle = { ...s.optionText, color: colors.success };
                    } else if (answers[qIdx] === aIdx && aIdx !== q.answer) {
                      optStyle = { ...s.option, backgroundColor: colors.dangerLight, borderColor: colors.danger };
                      textStyle = { ...s.optionText, color: colors.danger };
                    }
                  } else if (answers[qIdx] === aIdx) {
                    optStyle = { ...s.option, backgroundColor: colors.primaryLight, borderColor: colors.primary };
                    textStyle = { ...s.optionText, color: colors.primary };
                  }
                  return (
                    <TouchableOpacity
                      key={aIdx}
                      style={optStyle}
                      onPress={() => handleAnswer(qIdx, aIdx)}
                    >
                      <Text style={textStyle}>{opt}</Text>
                      {submitted && aIdx === q.answer && (
                        <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                      )}
                      {submitted && answers[qIdx] === aIdx && aIdx !== q.answer && (
                        <Ionicons name="close-circle" size={16} color={colors.danger} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            {!submitted ? (
              <TouchableOpacity style={s.submitBtn} onPress={submitQuiz}>
                <Text style={s.submitBtnText}>Submit Answers</Text>
              </TouchableOpacity>
            ) : (
              <Animated.View
                style={[
                  s.resultCard,
                  { borderColor: passed ? colors.success : colors.warning },
                  passed && { transform: [{ scale: celebAnim }] },
                ]}
              >
                <Ionicons
                  name={passed ? 'trophy-outline' : 'refresh-outline'}
                  size={36}
                  color={passed ? colors.success : colors.warning}
                />
                <Text style={[s.resultScore, { color: passed ? colors.success : colors.warning }]}>
                  {score}/{currentQuiz.length} Correct
                </Text>
                <Text style={s.resultMsg}>
                  {passed
                    ? 'Excellent! Lesson marked as complete.'
                    : 'Good try! Review the lesson and try again with fresh questions.'}
                </Text>

                {passed && topic.id === '3' && (
                  <TouchableOpacity
                    style={s.simBtn}
                    onPress={() => navigation.getParent()?.navigate('Tools', { screen: 'InvestmentSimulator' })}
                  >
                    <Ionicons name="trending-up-outline" size={16} color="#fff" />
                    <Text style={s.simBtnText}>Try the Investment Simulator</Text>
                  </TouchableOpacity>
                )}

                {!passed && (
                  <TouchableOpacity style={s.retryBtn} onPress={retryQuiz}>
                    <Text style={s.retryBtnText}>Try Again with New Questions</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
                  <Text style={s.backBtnText}>Back to Lessons</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },

  progressBarBg: { height: 3, backgroundColor: colors.border },
  progressBarFill: { height: 3, backgroundColor: colors.primary },

  header: { alignItems: 'center', marginBottom: 20 },
  iconBox: {
    width: 64, height: 64, borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  meta: { fontSize: 13, color: colors.textTertiary },
  guideBadge: { backgroundColor: colors.primaryLight, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  guideBadgeText: { fontSize: 11, fontWeight: '600', color: colors.primary },

  keyPointsCard: { backgroundColor: colors.primaryLight, borderRadius: 12, padding: 14, marginBottom: 14 },
  keyPointsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  keyPointsTitle: { fontSize: 13, fontWeight: '700', color: colors.primary },
  keyPointRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  keyPointDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.primary, marginTop: 7 },
  keyPointText: { fontSize: 13, color: colors.primary, lineHeight: 20, flex: 1 },

  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 14 },
  contentText: { fontSize: 15, color: colors.textSecondary, lineHeight: 26 },

  quizBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: colors.primary, borderRadius: 10, padding: 14, marginBottom: 14,
  },
  quizBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  quizHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  quizTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  quizSubtitle: { fontSize: 13, color: colors.textSecondary },
  question: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 12, borderRadius: 8, borderWidth: 1,
    borderColor: colors.border, marginBottom: 8, backgroundColor: colors.surfaceSecondary,
  },
  optionText: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  submitBtn: { backgroundColor: colors.primary, borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 14 },
  submitBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  resultCard: {
    backgroundColor: colors.surface, borderRadius: 12,
    padding: 24, alignItems: 'center', borderWidth: 2, marginBottom: 14,
  },
  resultScore: { fontSize: 28, fontWeight: '700', marginVertical: 8 },
  resultMsg: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 16, lineHeight: 22 },

  simBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: colors.primary, borderRadius: 8,
    padding: 12, paddingHorizontal: 20, marginBottom: 10, width: '100%',
  },
  simBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  retryBtn: {
    backgroundColor: colors.warning, borderRadius: 8,
    padding: 12, paddingHorizontal: 24, marginBottom: 10, width: '100%', alignItems: 'center',
  },
  retryBtnText: { color: '#fff', fontWeight: '600' },

  backBtn: {
    borderWidth: 1, borderColor: colors.border,
    borderRadius: 8, padding: 12, paddingHorizontal: 24, width: '100%', alignItems: 'center',
  },
  backBtnText: { color: colors.textSecondary, fontWeight: '600' },

  toast: {
    position: 'absolute', top: 12, alignSelf: 'center', zIndex: 99,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.success, borderRadius: 20,
    paddingVertical: 8, paddingHorizontal: 16,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },
  toastText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
