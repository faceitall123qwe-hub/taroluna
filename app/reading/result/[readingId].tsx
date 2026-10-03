import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TaroCard } from '../../../src/components/ui/TaroCard';
import { getCardById } from '../../../src/data';
import { spreads } from '../../../src/data';
import { supabase, deleteReading } from '../../../src/services/supabase';
import { getCardMeaning } from '../../../src/utils/cardContent';
import { getCardName } from '../../../src/utils/cardName';
import { useStore } from '../../../src/store/useStore';
import { colors, spacing, typography, borderRadius } from '../../../src/theme';
import type { TarotCard } from '../../../src/types/cards';
import type { Reading, ReadingCard } from '../../../src/types/database';

interface ReadingWithCards extends Reading {
  reading_cards: ReadingCard[];
}

export default function ReadingResultScreen() {
  const { readingId } = useLocalSearchParams<{ readingId: string }>();
  const router = useRouter();
  const language = useStore((s) => s.language);

  const [reading, setReading] = useState<ReadingWithCards | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!readingId) {
      setIsLoading(false);
      return;
    }
    Promise.resolve(supabase
      .from('readings')
      .select('*, reading_cards(*)')
      .eq('id', readingId)
      .single())
      .then(({ data, error }) => {
        if (error) throw error;
        setReading(data as unknown as ReadingWithCards);
      })
      .catch(() => setError('Failed to load reading.'))
      .finally(() => setIsLoading(false));
  }, [readingId]);

  function handleDelete() {
    Alert.alert(
      'Delete Reading',
      'Are you sure you want to delete this reading? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!readingId) return;
            setIsDeleting(true);
            try {
              await deleteReading(readingId);
              router.back();
            } catch {
              Alert.alert('Error', 'Could not delete this reading.');
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent.gold} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !reading) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error ?? 'Reading not found.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const spreadName = spreads.find((s) => s.id === reading.spread_type)?.name ?? reading.spread_type;
  const spread = spreads.find((s) => s.id === reading.spread_type);

  const formattedDate = new Date(reading.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const sortedCards = [...reading.reading_cards].sort((a, b) => a.position - b.position);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.spreadName}>{spreadName}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        {reading.notes ? (
          <View style={styles.quoteBlock}>
            <Text style={styles.quoteText}>"{reading.notes}"</Text>
          </View>
        ) : null}

        {sortedCards.map((rc) => {
          let card: TarotCard | null = null;
          try { card = getCardById(rc.card_id); } catch { }
          if (!card) return null;

          const positionName = spread?.positions[rc.position]?.name ?? `Position ${rc.position + 1}`;
          const meaning = getCardMeaning(card, language, rc.is_reversed ? 'reversed' : 'upright');
          const cardId = card.id;

          return (
            <View key={rc.id} style={styles.cardBlock}>
              <Text style={styles.positionName}>{positionName}</Text>

              <View style={styles.cardRow}>
                <TouchableOpacity onPress={() => router.push(`/card/${cardId}` as any)} activeOpacity={0.8}>
                  <TaroCard card={card} size="md" isRevealed />
                </TouchableOpacity>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{getCardName(card, language)}</Text>
                  {rc.is_reversed && (
                    <View style={styles.reversedBadge}>
                      <Text style={styles.reversedText}>Reversed</Text>
                    </View>
                  )}
                  <Text style={styles.keywordsText}>
                    {meaning.keywords.slice(0, 3).join(' · ')}
                  </Text>
                </View>
              </View>

              <Text style={styles.meaningText}>{meaning.meaning}</Text>
            </View>
          );
        })}

        <View style={styles.deleteRow}>
          <TouchableOpacity
            onPress={handleDelete}
            disabled={isDeleting}
            style={[styles.deleteBtn, isDeleting && styles.deleteBtnDisabled]}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteBtnText}>
              {isDeleting ? 'Deleting…' : 'Delete Reading'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  backBtn: {
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  backText: {
    ...typography.bodySmall,
    color: colors.text.muted,
  },
  header: {
    marginBottom: spacing.lg,
  },
  spreadName: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.bodySmall,
    color: colors.text.muted,
  },
  quoteBlock: {
    borderLeftWidth: 2,
    borderLeftColor: colors.accent.gold,
    paddingLeft: spacing.md,
    marginBottom: spacing.lg,
  },
  quoteText: {
    ...typography.body,
    color: colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  cardBlock: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  positionName: {
    ...typography.label,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xs,
  },
  cardName: {
    ...typography.h3,
    color: colors.text.primary,
  },
  reversedBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(196, 116, 138, 0.15)',
    borderWidth: 1,
    borderColor: colors.accent.rose,
  },
  reversedText: {
    ...typography.caption,
    color: colors.accent.rose,
    letterSpacing: 0.5,
  },
  keywordsText: {
    ...typography.caption,
    color: colors.text.muted,
  },
  meaningText: {
    ...typography.bodySmall,
    color: colors.text.primary,
    lineHeight: 22,
  },
  deleteRow: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  deleteBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  deleteBtnDisabled: {
    opacity: 0.45,
  },
  deleteBtnText: {
    ...typography.button,
    color: colors.status.error,
  },
  errorText: {
    ...typography.body,
    color: colors.text.muted,
  },
});
