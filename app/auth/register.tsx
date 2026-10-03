import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { StarBackground } from '../../src/components/ui/StarBackground';
import { Button } from '../../src/components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../src/theme';
import { signUpWithEmail, signInWithGoogle, signInWithApple } from '../../src/services/supabase';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);
  const [registered, setRegistered] = useState(false);

  const handleRegister = async () => {
    if (!displayName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signUpWithEmail(email, password, displayName);
      setRegistered(true);
    } catch (err: any) {
      setError(err?.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setSocialLoading('google');
    try {
      await signInWithGoogle();
    } catch {
      setError('Google sign in failed. Please try again.');
    } finally {
      setSocialLoading(null);
    }
  };

  const handleApple = async () => {
    setError(null);
    setSocialLoading('apple');
    try {
      await signInWithApple();
    } catch {
      setError('Apple sign in failed. Please try again.');
    } finally {
      setSocialLoading(null);
    }
  };

  if (registered) {
    return (
      <View style={styles.container}>
        <StarBackground />
        <View style={styles.fill}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
            <Text style={[styles.title, { textAlign: 'center' }]}>Check your email</Text>
            <Text style={{ ...typography.body, color: colors.text.secondary, textAlign: 'center', marginTop: spacing.md }}>
              We sent a confirmation link to {email}.{'\n'}Click it to activate your account.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StarBackground />
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{t('auth.signUp')}</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder={t('auth.displayName')}
              placeholderTextColor={colors.text.muted}
              value={displayName}
              onChangeText={setDisplayName}
              returnKeyType="next"
            />
            <TextInput
              style={styles.input}
              placeholder={t('auth.email')}
              placeholderTextColor={colors.text.muted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
            <TextInput
              style={styles.input}
              placeholder={t('auth.password')}
              placeholderTextColor={colors.text.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Button
              title={t('auth.signUp')}
              onPress={handleRegister}
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading || socialLoading != null}
            />
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.social}>
            <Button
              title={t('auth.signInWithGoogle')}
              onPress={handleGoogle}
              variant="secondary"
              size="md"
              loading={socialLoading === 'google'}
              disabled={loading || socialLoading != null}
            />
            {Platform.OS === 'ios' && (
              <>
                <View style={styles.socialGap} />
                <Button
                  title={t('auth.signInWithApple')}
                  onPress={handleApple}
                  variant="secondary"
                  size="md"
                  loading={socialLoading === 'apple'}
                  disabled={loading || socialLoading != null}
                />
              </>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.hasAccount')} </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity accessibilityRole="link">
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
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
  error: {
    ...typography.bodySmall,
    color: colors.status.error,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.subtle,
  },
  dividerText: {
    ...typography.caption,
    color: colors.text.muted,
  },
  social: {
    gap: spacing.md,
  },
  socialGap: {
    height: 0,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.text.muted,
  },
  footerLink: {
    ...typography.bodySmall,
    color: colors.accent.goldLight,
  },
});
