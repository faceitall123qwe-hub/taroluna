import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StarBackground } from '../../src/components/ui/StarBackground';
import { Button } from '../../src/components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../src/theme';
import { supabase } from '../../src/services/supabase';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleReset = async () => {
    if (!password || !confirm) { setError('Fill in both fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      setDone(true);
      setTimeout(() => router.replace('/auth/login'), 2000);
    } catch (e: any) {
      setError(e?.message ?? 'Could not update password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <StarBackground>
        <View style={styles.center}>
          <Text style={styles.title}>Password updated!</Text>
          <Text style={styles.sub}>Redirecting to login…</Text>
        </View>
      </StarBackground>
    );
  }

  return (
    <View style={styles.container}>
      <StarBackground />
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Set New Password</Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="New password"
              placeholderTextColor={colors.text.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="next"
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor={colors.text.muted}
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleReset}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <Button title="Update Password" onPress={handleReset} variant="primary" size="lg" loading={loading} disabled={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  fill: { ...StyleSheet.absoluteFillObject },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxxl, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  title: { ...typography.h2, color: colors.text.primary, marginBottom: spacing.xl },
  sub: { ...typography.body, color: colors.text.secondary, marginTop: spacing.md },
  form: { gap: spacing.md },
  input: {
    ...typography.body,
    color: colors.text.primary,
    borderWidth: 1.5,
    borderColor: colors.border.gold,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 6,
    fontSize: 17,
    backgroundColor: colors.background.card,
  },
  error: { ...typography.bodySmall, color: colors.status.error },
});
