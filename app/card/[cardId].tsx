import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TaroCard } from '../../src/components/ui/TaroCard';
import { getCardById } from '../../src/data';
import { getCardMeaning } from '../../src/utils/cardContent';
import { getCardName } from '../../src/utils/cardName';
import { useStore } from '../../src/store/useStore';
import { colors, spacing, typography, borderRadius } from '../../src/theme';
import type { TarotCard, CardMeaning } from '../../src/types/cards';

const TOTAL_CARDS = 78;

export default function CardDetailScreen() {
  const { cardId } = useLocalSearchParams<{ cardId: string }>();
  const router = useRouter();
  const language = useStore((s) => s.language);

  const id = parseInt(cardId ?? '1', 10);
  let card: TarotCard | null = null;
  try {
    card = getCardById(id);
  } catch {
    card = null;
  }

  if (!card) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={styles.errorText}>Card not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return <CardDetail card={card} language={language} currentId={id} onBack={() => router.back()} onNavigate={(nextId) => router.replace(`/card/${nextId}`)} />;
}

function CardDetail({
  card,
  language,
  currentId,
  onBack,
  onNavigate,
}: {
  card: TarotCard;
  language: string;
  currentId: number;
  onBack: () => void;
  onNavigate: (id: number) => void;
}) {
  const [activeTab, setActiveTab] = useState<'upright' | 'reversed'>('upright');

  const prevId = currentId > 1 ? currentId - 1 : null;
  const nextId = currentId < TOTAL_CARDS ? currentId + 1 : null;

  let prevCard: TarotCard | null = null;
  let nextCard: TarotCard | null = null;
  try { if (prevId !== null) prevCard = getCardById(prevId); } catch { }
  try { if (nextId !== null) nextCard = getCardById(nextId); } catch { }

  const meaning: CardMeaning = getCardMeaning(card, language, activeTab);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.cardContainer}>
          <TaroCard card={card} size="lg" isRevealed />
        </View>

        <Text style={styles.cardName}>{getCardName(card, language)}</Text>

        <View style={styles.pillsRow}>
          <Pill label={card.arcana === 'major' ? 'Major Arcana' : 'Minor Arcana'} />
          {card.suit && <Pill label={capitalize(card.suit)} />}
          {card.element && <Pill label={card.element} />}
          {card.zodiac && <Pill label={card.zodiac} />}
          {card.planet && !card.zodiac && <Pill label={card.planet} />}
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('upright')}>
            <Text style={[styles.tabText, activeTab === 'upright' && styles.tabTextActive]}>
              Upright
            </Text>
            {activeTab === 'upright' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('reversed')}>
            <Text style={[styles.tabText, activeTab === 'reversed' && styles.tabTextActive]}>
              Reversed
            </Text>
            {activeTab === 'reversed' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.keywordsRow}>
            {meaning.keywords.map((kw, i) => (
              <View key={i} style={styles.keywordPill}>
                <Text style={styles.keywordText}>{kw}</Text>
              </View>
            ))}
          </View>
        </View>

        <MeaningSection label="Meaning" text={meaning.meaning} />
        <MeaningSection label="Love" text={meaning.love} />
        <MeaningSection label="Career" text={meaning.career} />
        <MeaningSection label="Health" text={meaning.health} />

        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navBtn, !prevCard && styles.navBtnDisabled]}
            onPress={() => prevCard && onNavigate(prevId!)}
            disabled={!prevCard}
          >
            <Text style={[styles.navArrow, !prevCard && styles.navArrowDisabled]}>←</Text>
            <Text style={[styles.navLabel, !prevCard && styles.navArrowDisabled]} numberOfLines={1}>
              {prevCard ? prevCard.name : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navBtn, styles.navBtnRight, !nextCard && styles.navBtnDisabled]}
            onPress={() => nextCard && onNavigate(nextId!)}
            disabled={!nextCard}
          >
            <Text style={[styles.navLabel, !nextCard && styles.navArrowDisabled]} numberOfLines={1}>
              {nextCard ? nextCard.name : ''}
            </Text>
            <Text style={[styles.navArrow, !nextCard && styles.navArrowDisabled]}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

function MeaningSection({ label, text }: { label: string; text: string }) {
  return (
    <View style={styles.meaningSection}>
      <Text style={styles.meaningLabel}>{label}</Text>
      <Text style={styles.meaningText}>{text}</Text>
    </View>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
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
  errorText: {
    ...typography.body,
    color: colors.text.muted,
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
  cardContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardName: {
    ...typography.h1,
    color: colors.text.gold,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  pillText: {
    ...typography.caption,
    color: colors.text.secondary,
    letterSpacing: 0.5,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
    marginBottom: spacing.lg,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: spacing.sm,
    position: 'relative',
  },
  tabText: {
    ...typography.button,
    color: colors.text.muted,
  },
  tabTextActive: {
    color: colors.text.gold,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: -1,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: colors.accent.gold,
    borderRadius: borderRadius.full,
  },
  section: {
    marginBottom: spacing.md,
  },
  keywordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  keywordPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.accent.gold,
    backgroundColor: colors.accent.goldDim,
  },
  keywordText: {
    ...typography.caption,
    color: colors.text.gold,
  },
  meaningSection: {
    marginBottom: spacing.lg,
  },
  meaningLabel: {
    ...typography.label,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
  },
  meaningText: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 24,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  navBtnRight: {
    justifyContent: 'flex-end',
  },
  navBtnDisabled: {
    opacity: 0,
  },
  navArrow: {
    ...typography.h3,
    color: colors.text.gold,
    lineHeight: 22,
  },
  navArrowDisabled: {
    color: colors.text.muted,
  },
  navLabel: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    flex: 1,
  },
});
