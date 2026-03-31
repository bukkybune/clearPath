import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface State {
  hasError: boolean;
  message: string;
}

interface Props {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production you would send this to Sentry / Crashlytics:
    // Sentry.captureException(error, { extra: info });
    console.error('[ErrorBoundary]', error, info);
  }

  reset = () => this.setState({ hasError: false, message: '' });

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>⚠️</Text>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.body}>
          An unexpected error occurred. Please try restarting the app.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={this.reset}>
          <Text style={styles.btnText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#0F172A',
  },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F1F5F9',
    marginBottom: 10,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  btn: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 32,
  },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
