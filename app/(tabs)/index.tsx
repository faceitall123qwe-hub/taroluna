import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StarBackground } from '../../src/components/ui/StarBackground';
import { TaroCard } from '../../src/components/ui/TaroCard';
import { SpreadSelector } from '../../src/components/reading/SpreadSelector';
import { ReadingHistoryItem } from '../../src/components/reading/ReadingHistoryItem';
import { useCardOfDay } from '../../src/hooks/useCardOfDay';
import { useReadings } from '../../src/hooks/useReadings';
import { useStore } from '../../src/store/useStore';
import { spreads } from '../../src/data';
import { colors, spacing, borderRadius, typography } from '../../src/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const profile = useStore((s) => s.profile);
  const isSubscribed = useStore((s) => s.isSubscribed);
  const readingsCount = useStore((s) => s.readingsCount);

  const { card, isReversed } = useCardOfDay();
  const [isCardRevealed, setIsCardRevealed] = useState(false);

  const { readings } = useReadings();
  const recentReadings = readings.slice(0, 3);

  const showUpgradeBanner = readingsCount >= 3 && !isSubscribed;

  if (!card) {
    return (
      <StarBackground>
        <View style={styles.header} />
      </StarBackground>
    );
  }

  const meaning = isReversed ? card.reversed.meaning : card.upright.meaning;
  const meaningPreview = meaning.length > 120 ? meaning.slice(0, 120) + '…' : meaning;

  return (
    <StarBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{(() => {
            const hour = new Date().getHours();
            const key = hour < 12 ? 'home.greeting_morning' : hour < 17 ? 'home.greeting_afternoon' : 'home.greeting_evening';
            return t(key, { name: profile?.display_name ?? '' });
          })()}</Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            style={styles.settingsBtn}
            accessibilityLabel="Settings"
            accessibilityRole="button"
          >
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        {/* Upgrade banner */}
        {showUpgradeBanner && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/paywall')}
            activeOpacity={0.8}
          >
            <Text style={styles.upgradeBannerText}>
              ✦ {t('home.upgradePrompt')}
            </Text>
          </TouchableOpacity>
        )}

        {/* Card of the Day */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.cardOfTheDay')}</Text>
          <View style={styles.cardOfDayContainer}>
            <TaroCard
              card={card}
              size="lg"
              isRevealed={isCardRevealed}
              onPress={isCardRevealed ? undefined : () => setIsCardRevealed(true)}
            />
            {!isCardRevealed && (
              <Text style={styles.tapHint}>{t('home.tapToReveal')}</Text>
            )}
            {isCardRevealed && (
              <View style={styles.cardMeaning}>
                <Text style={styles.cardName}>
                  {card.name}
                  {isReversed ? ' (Reversed)' : ''}
                </Text>
                <Text style={styles.cardMeaningText}>{meaningPreview}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Choose Your Spread */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.sectionTitlePadded]}>
            {t('home.chooseSpread')}
          </Text>
          <SpreadSelector spreads={spreads} />
        </View>

        {/* Recent Readings */}
        {recentReadings.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.sectionTitlePadded]}>
              {t('home.recentReadings')}
            </Text>
            <View style={styles.historyList}>
              {recentReadings.map((reading) => (
                <ReadingHistoryItem key={reading.id} reading={reading} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </StarBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  greeting: {
    ...typography.h2,
    color: colors.text.primary,
    flex: 1,
  },
  settingsBtn: {
    padding: spacing.sm,
  },
  settingsIcon: {
    fontSize: 22,
    color: colors.text.secondary,
  },
  upgradeBanner: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.accent.goldDim,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.gold,
    alignItems: 'center',
  },
  upgradeBannerText: {
    ...typography.bodySmall,
    color: colors.text.gold,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  sectionTitlePadded: {
    paddingHorizontal: spacing.md,
  },
  cardOfDayContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  tapHint: {
    ...typography.caption,
    color: colors.text.muted,
    letterSpacing: 1,
  },
  cardMeaning: {
    alignItems: 'center',
    gap: spacing.xs,
    maxWidth: 280,
  },
  cardName: {
    ...typography.bodySmall,
    color: colors.text.gold,
    letterSpacing: 0.6,
  },
  cardMeaningText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  historyList: {
    gap: spacing.sm,
  },
});
