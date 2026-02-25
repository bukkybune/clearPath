import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function HomeScreen() {
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try { await signOut(auth); } catch (e) { console.error(e); }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>👋 Welcome back,</Text>
      <Text style={styles.name}>{user?.displayName || user?.email?.split('@')[0] || 'Student'}!</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💡 Financial Tip of the Day</Text>
        <Text style={styles.cardText}>
          Try the 50/30/20 rule: 50% of your income on needs, 30% on wants, and 20% on savings and debt repayment.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚀 Quick Actions</Text>
        <Text style={styles.cardText}>• Track your budget in the Budget tab</Text>
        <Text style={styles.cardText}>• Simulate debt payoff in the Debt tab</Text>
        <Text style={styles.cardText}>• Learn investing basics in the Learn tab</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Your Progress</Text>
        <Text style={styles.cardText}>Start adding your budget to see your financial overview here.</Text>
      </View>

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24 },
  greeting: { fontSize: 16, color: '#94a3b8', marginTop: 10 },
  name: { fontSize: 26, fontWeight: 'bold', color: '#f1f5f9', marginBottom: 24 },
  card: {
    backgroundColor: '#1e293b', borderRadius: 12, padding: 18,
    marginBottom: 16, borderWidth: 1, borderColor: '#334155'
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#38bdf8', marginBottom: 10 },
  cardText: { fontSize: 14, color: '#94a3b8', lineHeight: 22 },
  signOutBtn: { marginTop: 10, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
  signOutText: { color: '#ef4444', fontWeight: 'bold' },
});