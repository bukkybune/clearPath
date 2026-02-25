import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert
} from 'react-native';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export default function ProfileScreen() {
  const user = auth.currentUser;
  const [name, setName] = useState(user?.displayName || '');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [joinDate, setJoinDate] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.uid) return;
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.createdAt) {
            const d = new Date(data.createdAt);
            setJoinDate(d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
          }
          if (data.name) setName(data.name);
        }
      } catch (e) { console.error(e); }
    };
    fetchUser();
  }, []);

  const saveName = async () => {
    if (!name.trim()) { Alert.alert('Error', 'Name cannot be empty'); return; }
    setSaving(true);
    try {
      await updateProfile(user!, { displayName: name });
      await updateDoc(doc(db, 'users', user!.uid), { name });
      setEditing(false);
      Alert.alert('Success', 'Name updated successfully!');
    } catch (e) { Alert.alert('Error', 'Could not update name'); }
    finally { setSaving(false); }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await signOut(auth); } }
    ]);
  };

  const avatar = (name || user?.email || 'U')[0].toUpperCase();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatar}</Text>
        </View>
        {editing ? (
          <View style={styles.editRow}>
            <TextInput
              style={styles.nameInput} value={name}
              onChangeText={setName} autoFocus
              placeholderTextColor="#475569"
            />
            <TouchableOpacity style={styles.saveBtn} onPress={saveName} disabled={saving}>
              <Text style={styles.saveBtnText}>{saving ? '...' : 'Save'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{name || 'Student'}</Text>
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text style={styles.editBtn}>✏️ Edit</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.userEmail}>{user?.email}</Text>
        {joinDate ? <Text style={styles.joinDate}>Member since {joinDate}</Text> : null}
      </View>

      {/* Account Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>👤 Account Details</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account Type</Text>
          <Text style={styles.infoValue}>Student</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Auth Provider</Text>
          <Text style={styles.infoValue}>
            {user?.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email & Password'}
          </Text>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 About ClearPath</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Built for</Text>
          <Text style={styles.infoValue}>College Students</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Features</Text>
          <Text style={styles.infoValue}>Budget · Debt · Learn</Text>
        </View>
      </View>

      {/* Goals reminder */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎯 Your Financial Goals</Text>
        <Text style={styles.goalText}>• Build an emergency fund</Text>
        <Text style={styles.goalText}>• Pay off student loans efficiently</Text>
        <Text style={styles.goalText}>• Start investing early</Text>
        <Text style={styles.goalText}>• Maintain a good credit score</Text>
      </View>

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>🚪 Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#f1f5f9', marginBottom: 24 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#38bdf8', justifyContent: 'center',
    alignItems: 'center', marginBottom: 12
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#0f172a' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#f1f5f9' },
  editBtn: { fontSize: 14, color: '#38bdf8' },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  nameInput: {
    backgroundColor: '#1e293b', color: '#f1f5f9', borderRadius: 8,
    padding: 8, borderWidth: 1, borderColor: '#38bdf8', minWidth: 150, fontSize: 16
  },
  saveBtn: { backgroundColor: '#38bdf8', borderRadius: 8, padding: 8, paddingHorizontal: 12 },
  saveBtnText: { color: '#0f172a', fontWeight: 'bold' },
  cancelBtn: { padding: 8 },
  cancelBtnText: { color: '#94a3b8' },
  userEmail: { color: '#94a3b8', fontSize: 14, marginBottom: 4 },
  joinDate: { color: '#475569', fontSize: 12 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#38bdf8', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#334155' },
  infoLabel: { color: '#94a3b8', fontSize: 14 },
  infoValue: { color: '#f1f5f9', fontSize: 14, fontWeight: '500' },
  goalText: { color: '#94a3b8', fontSize: 14, lineHeight: 26 },
  signOutBtn: { backgroundColor: '#1e293b', borderRadius: 10, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: '#ef4444', marginBottom: 30 },
  signOutText: { color: '#ef4444', fontWeight: 'bold', fontSize: 15 },
});