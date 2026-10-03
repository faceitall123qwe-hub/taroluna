import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TaroCard } from '../ui/TaroCard';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { getCardById } from '../../data';
import { spreads } from '../../data';
import type { ReadingWithCards } from '../../hooks/useReadings';

interface ReadingHistoryItemProps {
  reading: ReadingWithCards;
}

export function ReadingHistoryItem({ reading }: ReadingHistoryItemProps) {
  const router = useRouter();

  const spreadName =
    spreads.find((s) => s.id === reading.spread_type)?.name ?? reading.spread_type;

  const displayCards = reading.reading_cards.slice(0, 3);

  const formattedDate = new Date(reading.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  function handlePress() {
    router.push(`/reading/result/${reading.id}`);
  }

  return (
    <TouchableOpacity style={styles.row} onPress={handlePress} activeOpacity={0.75}>
      <View style={styles.info}>
        <Text style={styles.spreadName} numberOfLines={1}>{spreadName}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <View style={styles.thumbnails}>
        {displayCards.map((rc) => {
          try {
            const card = getCardById(rc.card_id);
            return (
              <TaroCard
                key={rc.id}
                card={card}
                size="sm"
                isRevealed
              />
            );
          } catch {
            return null;
          }
        })}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.md,
    gap: spacing.sm,
  },
  info: {
    flex: 1,
  },
  spreadName: {
    ...typography.bodySmall,
    color: colors.text.primary,
    marginBottom: 2,
  },
  date: {
    ...typography.caption,
    color: colors.text.muted,
  },
  thumbnails: {
    flexDirection: 'row',
    gap: 4,
  },
  chevron: {
    ...typography.h3,
    color: colors.text.muted,
    lineHeight: 22,
  },
});
