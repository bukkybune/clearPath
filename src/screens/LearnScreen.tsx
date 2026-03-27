import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';
import { sampleQuestions } from '../utils/quizUtils';
import { TOPICS, GUIDES, QUIZ_QUESTIONS_PER_ATTEMPT } from '../data/lessons';

// Re-export TOPICS so HomeScreen can still import from this file
export { TOPICS } from '../data/lessons';

export default function LearnScreen({ navigation }: any) {
  const { colors } = useTheme();
  const s = styles(colors);
  const uid = auth.currentUser?.uid;
  const [completed, setCompleted] = useState<string[]>([]);
  const [readGuides, setReadGuides] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    getDoc(doc(db, 'userProgress', uid))
      .then(snap => {
        if (snap.exists()) {
          setCompleted(snap.data().completedLessons ?? []);
          setReadGuides(snap.data().readGuides ?? []);
        }
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

  const markGuideRead = async (guideId: string) => {
    if (readGuides.includes(guideId)) return;
    const updated = [...readGuides, guideId];
    setReadGuides(updated);
    if (uid) {
      await setDoc(doc(db, 'userProgress', uid), { readGuides: updated }, { merge: true });
    }
  };

  const openLesson = (topic: typeof TOPICS[0], idx: number) => {
    const isLocked = idx > 0 && !completed.includes(TOPICS[idx - 1].id);
    if (isLocked) return;
    const questionBank = topic.quiz ?? [];
    const sampledTopic = {
      ...topic,
      quiz: sampleQuestions(questionBank, QUIZ_QUESTIONS_PER_ATTEMPT),
    };
    navigation.navigate('Lesson', {
      topic: sampledTopic,
      questionBank,
      completed,
      onComplete: markComplete,
    });
  };

  const openGuide = (guide: typeof GUIDES[0]) => {
    navigation.navigate('Lesson', {
      topic: guide,
      completed,
      onComplete: markComplete,
      onRead: markGuideRead,
    });
  };

  if (loading) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const completedCount = TOPICS.filter(t => completed.includes(t.id)).length;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* Progress Header */}
      <View style={s.progressCard}>
        <View style={s.progressHeader}>
          <Text style={s.progressTitle}>Your Progress</Text>
          <Text style={s.progressCount}>{completedCount}/{TOPICS.length} lessons completed</Text>
        </View>
        <View style={s.progressBg}>
          <View style={[s.progressFill, { width: `${(completedCount / TOPICS.length) * 100}%` as any }]} />
        </View>
      </View>

      {/* ── Learning Path ── */}
      <View style={s.sectionHeader}>
        <Ionicons name="school-outline" size={15} color={colors.primary} />
        <Text style={s.sectionTitle}>Learning Path</Text>
      </View>

      {TOPICS.map((topic, idx) => {
        const isDone = completed.includes(topic.id);
        const isLocked = idx > 0 && !completed.includes(TOPICS[idx - 1].id);
        return (
          <TouchableOpacity
            key={topic.id}
            style={[s.card, isDone && s.cardDone, isLocked && s.cardLocked]}
            onPress={() => openLesson(topic, idx)}
            activeOpacity={isLocked ? 1 : 0.7}
            disabled={isLocked}
          >
            {/* Step number badge */}
            <View style={[
              s.stepBadge,
              isDone && { backgroundColor: colors.success },
              isLocked && { backgroundColor: colors.border },
            ]}>
              {isDone
                ? <Ionicons name="checkmark" size={12} color="#fff" />
                : <Text style={s.stepNum}>{idx + 1}</Text>
              }
            </View>

            <View style={[
              s.iconBox,
              isDone && { backgroundColor: colors.successLight },
              isLocked && { backgroundColor: colors.surfaceSecondary },
            ]}>
              <Ionicons
                name={isLocked ? 'lock-closed-outline' : topic.icon as any}
                size={20}
                color={isLocked ? colors.textTertiary : isDone ? colors.success : colors.primary}
              />
            </View>

            <View style={s.cardMeta}>
              <Text style={[s.topicTitle, isLocked && { color: colors.textTertiary }]}>
                {topic.title}
              </Text>
              <Text style={[s.topicSummary, isLocked && { color: colors.textTertiary }]}>
                {isLocked ? `Complete lesson ${idx} to unlock` : topic.summary}
              </Text>
              {!isLocked && (
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
              )}
            </View>

            <Ionicons
              name={isLocked ? 'lock-closed' : 'chevron-forward'}
              size={isLocked ? 14 : 18}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        );
      })}

      {/* ── Guides & Resources ── */}
      <View style={[s.sectionHeader, { marginTop: 8 }]}>
        <Ionicons name="book-outline" size={15} color={colors.primary} />
        <Text style={s.sectionTitle}>Guides & Resources</Text>
      </View>
      <Text style={s.sectionSub}>Deep-dive reads.</Text>

      {GUIDES.map(guide => {
        const isRead = readGuides.includes(guide.id);
        return (
          <TouchableOpacity
            key={guide.id}
            style={[s.card, isRead && s.cardDone]}
            onPress={() => openGuide(guide)}
            activeOpacity={0.7}
          >
            <View style={[s.iconBox, { backgroundColor: isRead ? colors.successLight : colors.surfaceSecondary }]}>
              <Ionicons name={guide.icon as any} size={20} color={isRead ? colors.success : colors.primary} />
            </View>
            <View style={s.cardMeta}>
              <Text style={s.topicTitle}>{guide.title}</Text>
              <Text style={s.topicSummary}>{guide.summary}</Text>
              <View style={s.metaRow}>
                <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                <Text style={s.duration}>{guide.duration}</Text>
                <View style={s.guideBadge}>
                  <Text style={s.guideBadgeText}>Guide</Text>
                </View>
                {isRead && (
                  <>
                    <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                    <Text style={[s.duration, { color: colors.success }]}>Read</Text>
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
  content: { padding: 20, paddingBottom: 40 },

  progressCard: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 20 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  progressTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  progressCount: { fontSize: 13, color: colors.textSecondary },
  progressBg: { height: 6, backgroundColor: colors.border, borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionSub: { fontSize: 12, color: colors.textTertiary, marginBottom: 10 },

  card: {
    backgroundColor: colors.surface, borderRadius: 12, marginBottom: 10,
    padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  cardDone: { borderLeftWidth: 3, borderLeftColor: colors.success },
  cardLocked: { opacity: 0.55 },

  stepBadge: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
    position: 'absolute', top: 10, left: 10, zIndex: 1,
  },
  stepNum: { fontSize: 10, fontWeight: '700', color: '#fff' },

  iconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center', alignItems: 'center',
    marginLeft: 8,
  },
  cardMeta: { flex: 1 },
  topicTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  topicSummary: { fontSize: 12, color: colors.textSecondary, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  duration: { fontSize: 11, color: colors.textTertiary },

  guideBadge: {
    backgroundColor: colors.primaryLight, borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 1, marginLeft: 4,
  },
  guideBadgeText: { fontSize: 10, fontWeight: '600', color: colors.primary },
});
