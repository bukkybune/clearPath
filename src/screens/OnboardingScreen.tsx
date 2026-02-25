import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, ScrollView, NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';

const { width: W } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '💰',
    title: 'Welcome to ClearPath',
    description: 'Your personal financial decision support platform built specifically for college students.',
    color: '#38bdf8',
  },
  {
    emoji: '📊',
    title: 'Track Your Budget',
    description: 'Log your expenses by category and visualize your spending with beautiful charts. Know exactly where your money goes.',
    color: '#34d399',
  },
  {
    emoji: '📉',
    title: 'Simulate Debt Payoff',
    description: 'See exactly how long it will take to pay off your student loans or credit cards — and how much interest you can save.',
    color: '#818cf8',
  },
  {
    emoji: '📚',
    title: 'Learn Finance Basics',
    description: 'From investing to credit scores, learn everything you need to make smart financial decisions as a student.',
    color: '#fb923c',
  },
];

interface Props { onComplete: () => void; }

export default function OnboardingScreen({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const goNext = () => {
    if (current < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: W * (current + 1), animated: true });
      setCurrent(current + 1);
    } else {
      onComplete();
    }
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / W);
    setCurrent(idx);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={styles.slide}>
            <Text style={styles.emoji}>{slide.emoji}</Text>
            <Text style={[styles.title, { color: slide.color }]}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === current && { backgroundColor: SLIDES[current].color, width: 24 }]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.btnRow}>
        {current < SLIDES.length - 1 ? (
          <>
            <TouchableOpacity onPress={onComplete} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={goNext}
              style={[styles.nextBtn, { backgroundColor: SLIDES[current].color }]}
            >
              <Text style={styles.nextText}>Next →</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={onComplete}
            style={[styles.getStartedBtn, { backgroundColor: SLIDES[current].color }]}
          >
            <Text style={styles.getStartedText}>Get Started 🚀</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  slide: {
    width: W, flex: 1, justifyContent: 'center',
    alignItems: 'center', padding: 40
  },
  emoji: { fontSize: 80, marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  description: { fontSize: 16, color: '#94a3b8', textAlign: 'center', lineHeight: 26 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 20, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#334155' },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 48 },
  skipBtn: { padding: 14 },
  skipText: { color: '#475569', fontSize: 15 },
  nextBtn: { borderRadius: 12, paddingVertical: 14, paddingHorizontal: 28 },
  nextText: { color: '#0f172a', fontWeight: 'bold', fontSize: 16 },
  getStartedBtn: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center' },
  getStartedText: { color: '#0f172a', fontWeight: 'bold', fontSize: 17 },
});