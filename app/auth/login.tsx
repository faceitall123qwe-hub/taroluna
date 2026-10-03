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
import { useRouter, Link } from 'expo-router';
import { StarBackground } from '../../src/components/ui/StarBackground';
import { Button } from '../../src/components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../src/theme';
import { signInWithEmail, signInWithGoogle, signInWithApple, supabase } from '../../src/services/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signInWithEmail(email, password);
    } catch {
      setError('Sign in failed. Please check your credentials and try again.');
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

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Enter your email address first.');
      return;
    }
    setError(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) throw resetError;
      setResetSent(true);
    } catch {
      setError('Could not send reset email. Please try again.');
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
          <Text style={styles.title}>{t('auth.signIn')}</Text>

          <View style={styles.form}>
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
              onSubmitEditing={handleSignIn}
            />

            {resetSent ? (
              <Text style={styles.resetSentText}>Check your email for a reset link.</Text>
            ) : (
              <TouchableOpacity onPress={handleForgotPassword} accessibilityRole="link">
                <Text style={styles.forgotLink}>{t('auth.forgotPassword')}</Text>
              </TouchableOpacity>
            )}

            {error && <Text style={styles.error}>{error}</Text>}

            <Button
              title={t('auth.signIn')}
              onPress={handleSignIn}
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
            <Text style={styles.footerText}>{t('auth.noAccount')} </Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity accessibilityRole="link">
                <Text style={styles.footerLink}>Create one</Text>
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
  forgotLink: {
    ...typography.bodySmall,
    color: colors.accent.goldLight,
    textAlign: 'right',
  },
  resetSentText: {
    ...typography.bodySmall,
    color: colors.status.success,
    textAlign: 'right',
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
