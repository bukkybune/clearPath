import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please fill in all fields'); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ClearPath</Text>
      <Text style={styles.subtitle}>Your financial journey starts here</Text>

      <TextInput
        style={styles.input} placeholder="Email" placeholderTextColor="#888"
        value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
      />
      <TextInput
        style={styles.input} placeholder="Password" placeholderTextColor="#888"
        value={password} onChangeText={setPassword} secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Log In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? <Text style={styles.linkBold}>Sign Up</Text></Text>
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
