import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) { Alert.alert('Error', 'Please fill in all fields'); return; }
    if (password.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', user.uid), {
        name, email, createdAt: new Date().toISOString(),
      });
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join ClearPath and take control of your finances</Text>

      <TextInput
        style={styles.input} placeholder="Full Name" placeholderTextColor="#888"
        value={name} onChangeText={setName}
      />
      <TextInput
        style={styles.input} placeholder="Email" placeholderTextColor="#888"
        value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
      />
      <TextInput
        style={styles.input} placeholder="Password (min 6 characters)" placeholderTextColor="#888"
        value={password} onChangeText={setPassword} secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create Account</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? <Text style={styles.linkBold}>Log In</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#38bdf8', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 40 },
  input: {
    backgroundColor: '#1e293b', color: '#f1f5f9', borderRadius: 10,
    padding: 14, marginBottom: 16, fontSize: 15, borderWidth: 1, borderColor: '#334155'
  },
  btn: { backgroundColor: '#38bdf8', borderRadius: 10, padding: 15, alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#94a3b8', textAlign: 'center', fontSize: 14 },
  linkBold: { color: '#38bdf8', fontWeight: 'bold' },
});