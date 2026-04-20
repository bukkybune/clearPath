import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert, Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { useTheme } from '../context/ThemeContext';
import { usePoints } from '../hooks/usePoints';
import { useAuth } from '../hooks/useAuth';
import { getLevelInfo } from '../utils/levelUtils';
import type { AppColors } from '../theme/colors';
import Constants from 'expo-constants';

export default function ProfileScreen() {
  const { colors, themeMode, setThemeMode, isDark } = useTheme();
  const s = useMemo(() => styles(colors), [colors]);
  const { points, streak } = usePoints();
  const { user } = useAuth();
  const levelInfo = getLevelInfo(points);

  const [name, setName] = useState(user?.displayName || '');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [joinDate, setJoinDate] = useState('');

  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;
    const uid = user.uid;
    getDoc(doc(db, 'users', uid)).then(snap => {
      if (cancelled || !snap.exists()) return;
      const data = snap.data();
      if (data.createdAt) {
        const d = new Date(data.createdAt);
        setJoinDate(d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
      }
      if (data.name) setName(data.name);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [user?.uid]);

  const saveName = async () => {
    if (!name.trim()) { Alert.alert('Error', 'Name cannot be empty'); return; }
    if (!user) {
      Alert.alert('Session expired', 'Please sign in again.');
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await updateProfile(user, { displayName: name.trim() });
      await updateDoc(doc(db, 'users', user.uid), { name: name.trim() });
      setEditing(false);
      Alert.alert('Saved', 'Your name has been updated.');
    } catch {
      Alert.alert('Error', 'Could not update name. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
          } catch {
            Alert.alert('Error', 'Could not sign out. Please try again.');
          }
        },
      },
    ]);
  };

  const avatar = (name || user?.email || 'U')[0].toUpperCase();
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* Profile Header */}
      <View style={s.profileCard}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{avatar}</Text>
        </View>

        {editing ? (
          <View style={s.editRow}>
            <TextInput
              style={s.nameInput} value={name}
              onChangeText={setName} autoFocus
              placeholderTextColor={colors.textTertiary}
            />
            <TouchableOpacity style={s.saveBtn} onPress={saveName} disabled={saving}>
              <Text style={s.saveBtnText}>{saving ? '...' : 'Save'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditing(false)}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={s.nameRow} onPress={() => setEditing(true)}>
            <Text style={s.userName}>{name || 'Student'}</Text>
            <Ionicons name="pencil-outline" size={15} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        <Text style={s.userEmail}>{user?.email}</Text>
        {joinDate ? <Text style={s.joinDate}>Member since {joinDate}</Text> : null}
      </View>

      {/* Progress */}
      <Text style={s.sectionTitle}>Your Progress</Text>
      <View style={s.card}>
        <View style={s.statsRow}>
          <View style={s.statBox}>
            <Text style={s.statValue}>🔥 {streak}</Text>
            <Text style={s.statLabel}>Day Streak</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statBox}>
            <Text style={s.statValue}>⭐ {points}</Text>
            <Text style={s.statLabel}>Total Points</Text>
          </View>
        </View>
        <View style={s.levelSection}>
          <View style={s.levelRow}>
            <Text style={s.levelName}>{levelInfo.level}</Text>
            {levelInfo.nextLevel ? (
              <Text style={s.levelNext}>{levelInfo.pointsToNext} pts to {levelInfo.nextLevel}</Text>
            ) : (
              <Text style={s.levelNext}>Max level reached 🏆</Text>
            )}
          </View>
          <View style={s.levelBarBg}>
            <View style={[s.levelBarFill, { width: `${levelInfo.progress * 100}%` as any }]} />
          </View>
        </View>
      </View>

      {/* Preferences */}
      <Text style={s.sectionTitle}>Preferences</Text>
      <View style={s.card}>
        <View style={s.row}>
          <View style={s.rowLeft}>
            <Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={18} color={colors.textSecondary} />
            <Text style={s.rowLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={val => setThemeMode(val ? 'dark' : 'light')}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
            accessibilityLabel="Dark mode"
            accessibilityRole="switch"
          />
        </View>
        <View style={[s.row, s.rowBorder]}>
          <View style={s.rowLeft}>
            <Ionicons name="phone-portrait-outline" size={18} color={colors.textSecondary} />
            <Text style={s.rowLabel}>Use System Theme</Text>
          </View>
          <Switch
            value={themeMode === 'system'}
            onValueChange={val => setThemeMode(val ? 'system' : isDark ? 'dark' : 'light')}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
            accessibilityLabel="Use system theme"
            accessibilityRole="switch"
          />
        </View>
      </View>

      {/* About */}
      <Text style={s.sectionTitle}>About</Text>
      <View style={s.card}>
        <View style={s.row}>
          <View style={s.rowLeft}>
            <Ionicons name="information-circle-outline" size={18} color={colors.textSecondary} />
            <Text style={s.rowLabel}>App Version</Text>
          </View>
          <Text style={s.rowValue}>{appVersion}</Text>
        </View>
        <View style={[s.row, s.rowBorder]}>
          <View style={s.rowLeft}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.textSecondary} />
            <Text style={s.rowLabel}>Your data is private</Text>
          </View>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
        </View>
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={s.signOutBtn} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={18} color={colors.danger} />
        <Text style={s.signOutText}>Sign Out</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },

  profileCard: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 16, padding: 24, marginBottom: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.primary, justifyContent: 'center',
    alignItems: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#fff' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  userName: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  userEmail: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  joinDate: { fontSize: 12, color: colors.textTertiary },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  nameInput: {
    backgroundColor: colors.surfaceSecondary, color: colors.textPrimary,
    borderRadius: 8, padding: 8, borderWidth: 1,
    borderColor: colors.primary, minWidth: 150, fontSize: 16,
  },
  saveBtn: { backgroundColor: colors.primary, borderRadius: 8, padding: 8, paddingHorizontal: 14 },
  saveBtnText: { color: '#fff', fontWeight: '600' },
  cancelText: { color: colors.textSecondary, fontSize: 14 },

  sectionTitle: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: colors.surface, borderRadius: 12, overflow: 'hidden', marginBottom: 24 },

  statsRow: { flexDirection: 'row' },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statValue: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  statLabel: { fontSize: 11, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.4 },
  statDivider: { width: 1, backgroundColor: colors.border },
  levelSection: { borderTopWidth: 1, borderTopColor: colors.border, padding: 14 },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  levelName: { fontSize: 13, fontWeight: '700', color: colors.primary },
  levelNext: { fontSize: 11, color: colors.textTertiary },
  levelBarBg: { height: 6, backgroundColor: colors.border, borderRadius: 3 },
  levelBarFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },

  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowLabel: { fontSize: 14, color: colors.textPrimary },
  rowValue: { fontSize: 14, color: colors.textSecondary },

  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: colors.danger,
  },
  signOutText: { color: colors.danger, fontWeight: '600', fontSize: 15 },
});
