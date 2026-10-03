import { useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useStore } from '../../store/useStore';
import type { Spread } from '../../types/cards';

interface SpreadSelectorProps {
  spreads: Spread[];
}

const SPREAD_ICONS: Record<string, string> = {
  card_of_the_day: '☀️',
  three_card: '⏳',
  mind_body_spirit: '🔺',
  celtic_cross: '✚',
  yes_no: '✦',
  shadow_self: '🌑',
  career_path: '💼',
  relationship_dynamics: '♥',
  monthly_forecast: '🌙',
};

export function SpreadSelector({ spreads }: SpreadSelectorProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const isSubscribed = useStore((s) => s.isSubscribed);

  function handlePress(spread: Spread) {
    const isLocked = spread.isPremium && !isSubscribed;
    if (isLocked) {
      router.push('/paywall');
    } else {
      router.push(`/reading/${spread.id}`);
    }
  }

  const featured = spreads.find((s) => s.id === 'card_of_the_day');
  const rest = spreads.filter((s) => s.id !== 'card_of_the_day');

  return (
    <View style={styles.container}>
      {featured && (
        <TouchableOpacity
          style={styles.featuredCard}
          onPress={() => handlePress(featured)}
          activeOpacity={0.8}
        >
          <View style={styles.featuredLeft}>
            <Text style={styles.featuredIcon}>{SPREAD_ICONS[featured.id]}</Text>
            <View>
              <Text style={styles.featuredBadge}>{t('reading.freeLabel', 'FREE DAILY')}</Text>
              <Text style={styles.featuredName}>{t(`reading.spreads.${featured.id}`, featured.name)}</Text>
              <Text style={styles.featuredDesc}>{t(`reading.spreadDescriptions.${featured.id}`, featured.description)}</Text>
            </View>
          </View>
          <Text style={styles.featuredArrow}>›</Text>
        </TouchableOpacity>
      )}

      <View style={styles.grid}>
        {rest.map((spread) => {
          const isLocked = spread.isPremium && !isSubscribed;
          return (
            <TouchableOpacity
              key={spread.id}
              style={[styles.gridCard, isLocked && styles.gridCardLocked]}
              onPress={() => handlePress(spread)}
              activeOpacity={0.75}
            >
              <Text style={styles.gridIcon}>{SPREAD_ICONS[spread.id] ?? '✦'}</Text>
              <Text style={styles.gridName} numberOfLines={2}>
                {t(`reading.spreads.${spread.id}`, spread.name)}
              </Text>
              <Text style={styles.gridCount}>
                {spread.cardCount} {t(spread.cardCount === 1 ? 'spread.card' : 'spread.cards', spread.cardCount === 1 ? 'card' : 'cards')}
              </Text>
              {isLocked && (
                <View style={styles.lockBadge}>
                  <Text style={styles.lockText}>PRO</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  featuredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.accent.purpleLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.xs,
  },
  featuredLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featuredIcon: {
    fontSize: 32,
  },
  featuredBadge: {
    ...typography.caption,
    color: colors.accent.gold,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  featuredName: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: 2,
  },
  featuredDesc: {
    ...typography.caption,
    color: colors.text.muted,
    maxWidth: 220,
  },
  featuredArrow: {
    fontSize: 28,
    color: colors.accent.purpleLight,
    marginLeft: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridCard: {
    width: '47.5%',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    minHeight: 100,
    justifyContent: 'center',
  },
  gridCardLocked: {
    opacity: 0.75,
  },
  gridIcon: {
    fontSize: 22,
    marginBottom: spacing.xs,
  },
  gridName: {
    ...typography.bodySmall,
    color: colors.text.primary,
    marginBottom: 2,
  },
  gridCount: {
    ...typography.caption,
    color: colors.text.muted,
  },
  lockBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.background.surface,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.accent.rose,
  },
  lockText: {
    ...typography.caption,
    color: colors.accent.rose,
    fontSize: 9,
    letterSpacing: 1,
  },
});
