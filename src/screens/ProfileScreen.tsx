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

  // user.uid is the correct dep — re-fetch if the signed-in account changes.
  useEffect(() => {
    if (!user?.uid) return;
    const uid = user.uid;
    const fetchUser = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.createdAt) {
            const d = new Date(data.createdAt);
            setJoinDate(d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
          }
          if (data.name) setName(data.name);
        }
      } catch {
        // Join date is cosmetic — fail silently but log for debugging.
        console.error('Could not fetch user profile');
      }
    };
    fetchUser();
  }, [user?.uid]);

  const saveName = async () => {
    if (!name.trim()) { Alert.alert('Error', 'Name cannot be empty'); return; }
    if (!user) { Alert.alert('Error', 'You are not signed in'); return; }
    setSaving(true);
    try {
      await updateProfile(user, { displayName: name.trim() });
      await updateDoc(doc(db, 'users', user.uid), { name: name.trim() });
      setEditing(false);
      Alert.alert('Success', 'Name updated successfully!');
    } catch {
      Alert.alert('Error', 'Could not update name');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await signOut(auth); } }
    ]);
  };

  const avatar = (name || user?.email || 'U')[0].toUpperCase();
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* Avatar + Name */}
      <View style={s.avatarSection}>
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
            <Ionicons name="pencil-outline" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
        <Text style={s.userEmail}>{user?.email}</Text>
        {joinDate ? <Text style={s.joinDate}>Member since {joinDate}</Text> : null}
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
        <View style={s.levelCard}>
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

      {/* Account Details */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Account</Text>
        <View style={s.card}>
          <View style={s.row}>
            <View style={s.rowLeft}>
              <Ionicons name="mail-outline" size={18} color={colors.textSecondary} />
              <Text style={s.rowLabel}>Email</Text>
            </View>
            <Text style={s.rowValue} numberOfLines={1}>{user?.email}</Text>
          </View>
          <View style={[s.row, s.rowBorder]}>
            <View style={s.rowLeft}>
              <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
              <Text style={s.rowLabel}>Account Type</Text>
            </View>
            <Text style={s.rowValue}>Student</Text>
          </View>
          <View style={[s.row, s.rowBorder]}>
            <View style={s.rowLeft}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />
              <Text style={s.rowLabel}>Auth Provider</Text>
            </View>
            <Text style={s.rowValue}>
              {user?.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email & Password'}
            </Text>
          </View>
        </View>
      </View>

      {/* Appearance */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Appearance</Text>
        <View style={s.card}>
          <View style={s.row}>
            <View style={s.rowLeft}>
              <Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={18} color={colors.textSecondary} />
              <Text style={s.rowLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={(val) => setThemeMode(val ? 'dark' : 'light')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
          <View style={[s.row, s.rowBorder]}>
            <View style={s.rowLeft}>
              <Ionicons name="phone-portrait-outline" size={18} color={colors.textSecondary} />
              <Text style={s.rowLabel}>Use System Theme</Text>
            </View>
            <Switch
              value={themeMode === 'system'}
              onValueChange={(val) => setThemeMode(val ? 'system' : isDark ? 'dark' : 'light')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>

      {/* About */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>About</Text>
        <View style={s.card}>
          <View style={s.row}>
            <View style={s.rowLeft}>
              <Ionicons name="information-circle-outline" size={18} color={colors.textSecondary} />
              <Text style={s.rowLabel}>Version</Text>
            </View>
            <Text style={s.rowValue}>{appVersion}</Text>
          </View>
          <View style={[s.row, s.rowBorder]}>
            <View style={s.rowLeft}>
              <Ionicons name="people-outline" size={18} color={colors.textSecondary} />
              <Text style={s.rowLabel}>Built for</Text>
            </View>
            <Text style={s.rowValue}>College Students</Text>
          </View>
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
  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.primary, justifyContent: 'center',
    alignItems: 'center', marginBottom: 12
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#fff' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  userName: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  userEmail: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  joinDate: { fontSize: 12, color: colors.textTertiary, marginBottom: 16 },
  statsRow: {
    flexDirection: 'row', backgroundColor: colors.surface,
    borderRadius: 14, overflow: 'hidden', width: '100%',
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statValue: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  statLabel: { fontSize: 11, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.4 },
  statDivider: { width: 1, backgroundColor: colors.border },
  levelCard: { width: '100%', marginTop: 12 },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  levelName: { fontSize: 13, fontWeight: '700', color: colors.primary },
  levelNext: { fontSize: 11, color: colors.textTertiary },
  levelBarBg: { height: 6, backgroundColor: colors.border, borderRadius: 3 },
  levelBarFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  nameInput: {
    backgroundColor: colors.surface, color: colors.textPrimary,
    borderRadius: 8, padding: 8, borderWidth: 1,
    borderColor: colors.primary, minWidth: 150, fontSize: 16
  },
  saveBtn: { backgroundColor: colors.primary, borderRadius: 8, padding: 8, paddingHorizontal: 12 },
  saveBtnText: { color: '#fff', fontWeight: '600' },
  cancelText: { color: colors.textSecondary, fontSize: 14 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: colors.surface, borderRadius: 12, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowLabel: { fontSize: 14, color: colors.textPrimary },
  rowValue: { fontSize: 14, color: colors.textSecondary, maxWidth: 180, textAlign: 'right' },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: colors.danger
  },
  signOutText: { color: colors.danger, fontWeight: '600', fontSize: 15 },
});
