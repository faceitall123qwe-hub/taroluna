import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StarBackground } from '../../src/components/ui/StarBackground';
import { spreads } from '../../src/data/spreads';
import { useStore } from '../../src/store/useStore';
import { colors, spacing, borderRadius, typography } from '../../src/theme';
import type { Spread } from '../../src/types/cards';

export default function SpreadScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const isSubscribed = useStore((s) => s.isSubscribed);

  function handlePress(spread: Spread) {
    if (spread.isPremium && !isSubscribed) {
      router.push('/paywall');
    } else {
      router.push(`/reading/${spread.id}`);
    }
  }

  function renderItem({ item }: { item: Spread }) {
    const locked = item.isPremium && !isSubscribed;

    return (
      <TouchableOpacity
        style={[styles.card, locked && styles.cardLocked]}
        onPress={() => handlePress(item)}
        activeOpacity={0.75}
      >
        {locked && (
          <View style={styles.lockBadge}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}
        <Text style={[styles.spreadName, locked && styles.textLocked]}>
          {item.name}
        </Text>
        <Text style={styles.cardCount}>
          {item.cardCount} {t(item.cardCount === 1 ? 'spread.card' : 'spread.cards', item.cardCount === 1 ? 'card' : 'cards')}
        </Text>
        <Text
          style={[styles.description, locked && styles.textLocked]}
          numberOfLines={3}
        >
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <StarBackground>
      <View style={styles.header}>
        <Text style={styles.title}>{t('home.chooseSpread')}</Text>
      </View>
      <FlatList<Spread>
        data={spreads}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </StarBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  row: {
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    gap: spacing.xs,
  },
  cardLocked: {
    borderColor: colors.border.medium,
    opacity: 0.75,
  },
  lockBadge: {
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  lockIcon: {
    fontSize: 18,
  },
  spreadName: {
    ...typography.h3,
    color: colors.text.primary,
    fontSize: 18,
    lineHeight: 24,
  },
  cardCount: {
    ...typography.label,
    color: colors.accent.gold,
    textTransform: 'uppercase',
  },
  description: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  textLocked: {
    color: colors.text.muted,
  },
});
