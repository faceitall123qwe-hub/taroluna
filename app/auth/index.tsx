import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StarBackground } from '../../src/components/ui/StarBackground';
import { Button } from '../../src/components/ui/Button';
import { colors, typography, spacing } from '../../src/theme';
import { useStore } from '../../src/store/useStore';

const TAGLINES: Record<string, string> = {
  en: 'Unlock the wisdom of the cards',
  ru: 'Раскройте мудрость карт',
  pl: 'Odkryj mądrość kart',
  uk: 'Розкрийте мудрість карт',
  de: 'Entdecke die Weisheit der Karten',
};

export default function WelcomeScreen() {
  const router = useRouter();
  const language = useStore((s) => s.language);
  const tagline = TAGLINES[language] ?? TAGLINES.en;

  return (
    <View style={styles.container}>
      <StarBackground />
      <View style={styles.content}>
        <View style={styles.logoBlock}>
          <Text style={styles.logo}>TaroLuna</Text>
          <Text style={styles.tagline}>{tagline}</Text>
        </View>

        <View style={styles.buttons}>
          <Button
            title="Sign In"
            onPress={() => router.push('/auth/login')}
            variant="primary"
            size="lg"
          />
          <View style={styles.gap} />
          <Button
            title="Create Account"
            onPress={() => router.push('/auth/register')}
            variant="secondary"
            size="lg"
          />
        </View>

        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          accessibilityRole="button"
          accessibilityLabel="Continue as Guest"
        >
          <Text style={styles.guestLink}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl * 1.5,
    paddingBottom: spacing.xxl,
  },
  logoBlock: {
    alignItems: 'center',
    gap: spacing.md,
  },
  logo: {
    ...typography.h1,
    fontSize: 48,
    color: colors.accent.gold,
    letterSpacing: 3,
  },
  tagline: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttons: {
    width: '100%',
  },
  gap: {
    height: spacing.md,
  },
  guestLink: {
    ...typography.bodySmall,
    color: colors.text.muted,
    textDecorationLine: 'underline',
  },
});
