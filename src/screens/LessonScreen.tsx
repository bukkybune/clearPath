import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function LessonScreen({ route, navigation }: any) {
  const { colors } = useTheme();
  const s = styles(colors);
  const { topic, completed, onComplete } = route.params;
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const isDone = completed.includes(topic.id);

  const handleAnswer = (qIdx: number, aIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: aIdx }));
  };

  const submitQuiz = () => {
    if (Object.keys(answers).length < topic.quiz.length) {
      Alert.alert('Incomplete', 'Please answer all questions before submitting.');
      return;
    }
    setSubmitted(true);
    const correct = topic.quiz.filter((q: any, i: number) => answers[i] === q.answer).length;
    const passed = correct >= Math.ceil(topic.quiz.length * 0.67);
    if (passed && !isDone) {
      onComplete(topic.id);
    }
  };

  const score = submitted
    ? topic.quiz.filter((q: any, i: number) => answers[i] === q.answer).length
    : 0;
  const passed = score >= Math.ceil(topic.quiz.length * 0.67);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.iconBox}>
          <Ionicons name={topic.icon} size={28} color={colors.primary} />
        </View>
        <Text style={s.title}>{topic.title}</Text>
        <View style={s.metaRow}>
          <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
          <Text style={s.meta}>{topic.duration}</Text>
          {isDone && (
            <>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={[s.meta, { color: colors.success }]}>Completed</Text>
            </>
          )}
        </View>
      </View>

      {/* Content */}
      {!showQuiz ? (
        <>
          <View style={s.card}>
            <Text style={s.content_text}>{topic.content}</Text>
          </View>
          <TouchableOpacity style={s.quizBtn} onPress={() => setShowQuiz(true)}>
            <Ionicons name="help-circle-outline" size={20} color="#fff" />
            <Text style={s.quizBtnText}>Take the Quiz</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={s.quizHeader}>
            <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
            <Text style={s.quizTitle}>Knowledge Check</Text>
          </View>

          {topic.quiz.map((q: any, qIdx: number) => (
            <View key={qIdx} style={s.card}>
              <Text style={s.question}>Q{qIdx + 1}. {q.question}</Text>
              {q.options.map((opt: string, aIdx: number) => {
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
                  <TouchableOpacity key={aIdx} style={optStyle} onPress={() => handleAnswer(qIdx, aIdx)}>
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
            <View style={[s.resultCard, { borderColor: passed ? colors.success : colors.warning }]}>
              <Ionicons
                name={passed ? 'trophy-outline' : 'refresh-outline'}
                size={32}
                color={passed ? colors.success : colors.warning}
              />
              <Text style={[s.resultScore, { color: passed ? colors.success : colors.warning }]}>
                {score}/{topic.quiz.length} Correct
              </Text>
              <Text style={s.resultMsg}>
                {passed ? 'Great job! Lesson marked as complete.' : 'Good try! Review the lesson and try again.'}
              </Text>
              {!passed && (
                <TouchableOpacity style={s.retryBtn} onPress={() => {
                  setAnswers({});
                  setSubmitted(false);
                }}>
                  <Text style={s.retryBtnText}>Try Again</Text>
                </TouchableOpacity>
              )}
              {passed && topic.id === '3' && (
                <TouchableOpacity
                  style={s.simBtn}
                  onPress={() => navigation.getParent()?.navigate('Tools', { screen: 'InvestmentSimulator' })}
                >
                  <Ionicons name="trending-up-outline" size={16} color="#fff" />
                  <Text style={s.simBtnText}>Try the Investment Simulator</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
                <Text style={s.backBtnText}>Back to Lessons</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 20 },
  iconBox: { width: 64, height: 64, borderRadius: 16, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  meta: { fontSize: 13, color: colors.textTertiary },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 14 },
  content_text: { fontSize: 15, color: colors.textSecondary, lineHeight: 26 },
  quizBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: 10, padding: 14, marginBottom: 14 },
  quizBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  quizHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  quizTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  question: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginBottom: 8, backgroundColor: colors.surfaceSecondary },
  optionText: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  submitBtn: { backgroundColor: colors.primary, borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 14 },
  submitBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  resultCard: { backgroundColor: colors.surface, borderRadius: 12, padding: 24, alignItems: 'center', borderWidth: 2, marginBottom: 14 },
  resultScore: { fontSize: 28, fontWeight: '700', marginVertical: 8 },
  resultMsg: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  retryBtn: { backgroundColor: colors.warning, borderRadius: 8, padding: 12, paddingHorizontal: 24, marginBottom: 10 },
  retryBtnText: { color: '#fff', fontWeight: '600' },
  backBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, paddingHorizontal: 24 },
  backBtnText: { color: colors.textSecondary, fontWeight: '600' },
  simBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: 8, padding: 12, paddingHorizontal: 20, marginBottom: 10 },
  simBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});