import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Constants from 'expo-constants';
import { StarBackground } from '../../src/components/ui/StarBackground';
import { Button } from '../../src/components/ui/Button';
import { LanguagePicker } from '../../src/components/ui/LanguagePicker';
import { NotificationToggle } from '../../src/components/profile/NotificationToggle';
import { useAuth } from '../../src/hooks/useAuth';
import { usePurchases } from '../../src/hooks/usePurchases';
import { useStore } from '../../src/store/useStore';
import { colors, spacing, borderRadius, typography } from '../../src/theme';
import i18n from '../../src/i18n';
import { useTranslation } from 'react-i18next';

const LANGUAGE_LABELS: Record<string, { flag: string; name: string }> = {
  ru: { flag: '🇷🇺', name: 'Русский' },
  uk: { flag: '🇺🇦', name: 'Українська' },
  pl: { flag: '🇵🇱', name: 'Polski' },
  en: { flag: '🇬🇧', name: 'English' },
};

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, profile, signOut, isLoading } = useAuth();
  const { restore, isPurchasing } = usePurchases();
  const isSubscribed = useStore((s) => s.isSubscribed);
  const readingsCount = useStore((s) => s.readingsCount);
  const language = useStore((s) => s.language);

  const [langPickerVisible, setLangPickerVisible] = useState(false);

  const displayName = profile?.display_name ?? user?.email?.split('@')[0] ?? 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const currentLang = LANGUAGE_LABELS[language] ?? LANGUAGE_LABELS['en'];
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/auth');
        },
      },
    ]);
  }

  return (
    <StarBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>{t('profile.title')}</Text>

        {/* User info */}
        <View style={styles.section}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>{avatarLetter}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.displayName}>{displayName}</Text>
              {user?.email && (
                <Text style={styles.email}>{user.email}</Text>
              )}
              <Text style={styles.readingsCount}>
                {t('profile.readingsCount', { count: readingsCount })}
              </Text>
            </View>
          </View>
        </View>

        {/* Subscription */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('profile.subscription').toUpperCase()}</Text>
          {isSubscribed ? (
            <View style={styles.card}>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>TaroLuna Premium</Text>
              </View>
              <Text style={styles.activeLabel}>Active</Text>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.freeAccount}>Free Account</Text>
              <View style={styles.upgradeBtn}>
                <Button
                  title="Upgrade to Premium"
                  onPress={() => router.push('/paywall')}
                  variant="primary"
                  size="sm"
                />
              </View>
            </View>
          )}
          <TouchableOpacity
            style={styles.textBtn}
            onPress={restore}
            disabled={isPurchasing}
          >
            <Text style={styles.textBtnLabel}>
              {isPurchasing ? 'Restoring…' : 'Restore Purchases'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('settings.title', 'SETTINGS')}</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.settingsRow}
              onPress={() => setLangPickerVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.settingsRowFlag}>{currentLang.flag}</Text>
              <Text style={styles.settingsRowLabel}>{t('profile.language')}</Text>
              <Text style={styles.settingsRowValue}>{currentLang.name}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <NotificationToggle />
          </View>
        </View>

        {/* Sign out */}
        <View style={styles.section}>
          <Button
            title={t('profile.signOut')}
            onPress={handleSignOut}
            variant="ghost"
            size="md"
            loading={isLoading}
          />
        </View>

        <Text style={styles.version}>{t('profile.version', { version: appVersion })}</Text>
      </ScrollView>

      <LanguagePicker
        visible={langPickerVisible}
        onClose={() => setLangPickerVisible(false)}
      />
    </StarBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  screenTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.text.muted,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    gap: spacing.sm,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    ...typography.h2,
    color: colors.accent.gold,
    lineHeight: 32,
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  displayName: {
    ...typography.body,
    color: colors.text.primary,
  },
  email: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  readingsCount: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  premiumBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.status.success,
    borderRadius: borderRadius.sm,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  premiumBadgeText: {
    ...typography.label,
    color: '#fff',
  },
  activeLabel: {
    ...typography.bodySmall,
    color: colors.status.success,
  },
  freeAccount: {
    ...typography.body,
    color: colors.text.secondary,
  },
  upgradeBtn: {
    alignSelf: 'flex-start',
  },
  textBtn: {
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  textBtnLabel: {
    ...typography.bodySmall,
    color: colors.text.muted,
    textDecorationLine: 'underline',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: spacing.xs,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingsRowFlag: {
    fontSize: 20,
  },
  settingsRowLabel: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  settingsRowValue: {
    ...typography.bodySmall,
    color: colors.text.muted,
  },
  chevron: {
    ...typography.h3,
    color: colors.text.muted,
    lineHeight: 22,
  },
  version: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
