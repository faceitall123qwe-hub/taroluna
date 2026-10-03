import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Animated,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useReading } from '../../src/hooks/useReading';
import { SpreadLayout } from '../../src/components/reading/SpreadLayout';
import { Button } from '../../src/components/ui/Button';
import { TaroCard } from '../../src/components/ui/TaroCard';
import { canUserRead } from '../../src/services/supabase';
import { useStore } from '../../src/store/useStore';
import { getCardName } from '../../src/utils/cardName';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function ReadingScreen() {
  const { spreadId } = useLocalSearchParams<{ spreadId: string }>();
  const router = useRouter();
  const user = useStore((s) => s.user);

  const [gateChecked, setGateChecked] = React.useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/auth');
      return;
    }
    canUserRead(user.id)
      .then((allowed) => {
        if (!allowed) {
          router.replace('/paywall');
        } else {
          setGateChecked(true);
        }
      })
      .catch(() => {
        router.replace('/paywall');
      });
  }, []);

  if (!gateChecked) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent.gold} size="large" />
      </View>
    );
  }

  return <ReadingFlow spreadId={spreadId!} userId={user!.id} />;
}

function ReadingFlow({ spreadId, userId }: { spreadId: string; userId: string }) {
  const router = useRouter();
  const reading = useReading(spreadId);

  if (reading.step === 'intention') {
    return <IntentionStep reading={reading} />;
  }
  if (reading.step === 'selection') {
    return <SelectionStep reading={reading} />;
  }
  return (
    <ResultStep
      reading={reading}
      userId={userId}
      onNewReading={() => router.replace('/(tabs)')}
    />
  );
}

function IntentionStep({ reading }: { reading: ReturnType<typeof useReading> }) {
  const router = useRouter();
  const shuffle1 = useRef(new Animated.Value(0)).current;
  const shuffle2 = useRef(new Animated.Value(0)).current;
  const shuffle3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shuffle1, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(shuffle2, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(shuffle3, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(shuffle1, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(shuffle2, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(shuffle3, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.delay(600),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const card1X = shuffle1.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
  const card3X = shuffle3.interpolate({ inputRange: [0, 1], outputRange: [0, 18] });
  const card2Y = shuffle2.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.spreadName}>{reading.spread.name}</Text>
        <Text style={styles.spreadDesc}>{reading.spread.description}</Text>

        {/* Shuffling animation */}
        <View style={styles.shuffleArea}>
          <Animated.View style={[styles.shuffleCard, { transform: [{ translateX: card1X }] }]}>
            <ShuffleCardBack />
          </Animated.View>
          <Animated.View style={[styles.shuffleCard, { transform: [{ translateY: card2Y }] }]}>
            <ShuffleCardBack />
          </Animated.View>
          <Animated.View style={[styles.shuffleCard, { transform: [{ translateX: card3X }] }]}>
            <ShuffleCardBack />
          </Animated.View>
        </View>

        <Text style={styles.focusHeading}>Set Your Intention</Text>
        <Text style={styles.focusBody}>
          Take a moment to breathe and focus on your question or situation.
        </Text>

        <TextInput
          style={styles.intentionInput}
          placeholder="What's on your mind? (optional)"
          placeholderTextColor={colors.text.muted}
          value={reading.intention}
          onChangeText={reading.setIntention}
          multiline
          maxLength={300}
        />

        <View style={styles.btnContainer}>
          <Button title="Shuffle the Cards" onPress={reading.startReading} size="lg" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ShuffleCardBack() {
  return (
    <View style={styles.miniCardBack}>
      <View style={styles.miniCardInner} />
    </View>
  );
}

function SelectionStep({ reading }: { reading: ReturnType<typeof useReading> }) {
  const router = useRouter();
  const { t } = useTranslation();
  const language = useStore((s) => s.language);

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.spreadName}>{reading.spread.name}</Text>
        <Text style={styles.selectionHint}>
          {reading.allRevealed
            ? 'All cards revealed'
            : `Tap card ${reading.revealedCount + 1} of ${reading.spread.cardCount}`}
        </Text>

        <View style={styles.layoutContainer}>
          <SpreadLayout
            spreadId={reading.spread.id}
            slots={reading.drawnCards.map((dc, i) => ({
              card: dc.card,
              isReversed: dc.isReversed,
              isRevealed: i < reading.revealedCount,
              positionName: dc.position.name,
              onPress: i === reading.revealedCount ? () => reading.revealCard(i) : undefined,
            }))}
          />
        </View>

        {reading.revealedCount > 0 && (
          <View style={styles.revealedNames}>
            {reading.drawnCards.slice(0, reading.revealedCount).map((dc, i) => (
              <View key={i} style={styles.revealedRow}>
                <Text style={styles.revealedPosition}>{dc.position.name}</Text>
                <Text style={styles.revealedCardName}>
                  {getCardName(dc.card, language)}
                  {dc.isReversed ? ` (${t('card.reversed', 'Reversed')})` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        {reading.allRevealed && (
          <View style={styles.btnContainer}>
            <Button title="See Your Reading" onPress={reading.showResult} size="lg" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ResultStep({
  reading,
  userId,
  onNewReading,
}: {
  reading: ReturnType<typeof useReading>;
  userId: string;
  onNewReading: () => void;
}) {
  const router = useRouter();

  const handleSave = async () => {
    await reading.saveReading(userId);
  };

  const handleShare = async () => {
    const lines = reading.drawnCards.map(
      (dc) =>
        `${dc.position.name}: ${dc.card.name}${dc.isReversed ? ' (Reversed)' : ''}`,
    );
    await Share.share({
      message: `My ${reading.spread.name} reading:\n\n${lines.join('\n')}`,
    });
  };

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.spreadName}>{reading.spread.name}</Text>

        {reading.intention.length > 0 && (
          <Text style={styles.intentionDisplay}>"{reading.intention}"</Text>
        )}

        {reading.drawnCards.map((dc, i) => (
          <CardResultBlock key={i} dc={dc} />
        ))}

        {reading.error && <Text style={styles.errorText}>{reading.error}</Text>}

        <View style={styles.resultActions}>
          {!reading.savedReadingId ? (
            <Button
              title="Save Reading"
              onPress={handleSave}
              loading={reading.isSaving}
              variant="primary"
              size="lg"
            />
          ) : (
            <Text style={styles.savedLabel}>Reading Saved</Text>
          )}
          <Button title="Share" onPress={handleShare} variant="secondary" size="lg" />
          <Button title="New Reading" onPress={onNewReading} variant="ghost" size="md" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CardResultBlock({ dc }: { dc: ReturnType<typeof useReading>['drawnCards'][number] }) {
  const { t } = useTranslation();
  const language = useStore((s) => s.language);
  const meaning = dc.isReversed ? dc.card.reversed : dc.card.upright;

  return (
    <View style={styles.resultBlock}>
      <View style={styles.resultBlockHeader}>
        <View style={styles.resultCardThumb}>
          <TaroCard card={dc.card} size="sm" isRevealed />
        </View>
        <View style={styles.resultBlockInfo}>
          <Text style={styles.resultPosition}>{dc.position.name}</Text>
          <Text style={styles.resultCardName}>{getCardName(dc.card, language)}</Text>
          <View style={[styles.orientationBadge, dc.isReversed && styles.orientationReversed]}>
            <Text style={styles.orientationText}>
              {dc.isReversed ? t('card.reversed', 'Reversed') : t('card.upright', 'Upright')}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.positionDesc}>{dc.position.description}</Text>

      <View style={styles.keywordsRow}>
        {meaning.keywords.map((kw, i) => (
          <View key={i} style={styles.keyword}>
            <Text style={styles.keywordText}>{kw}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.meaningText}>{meaning.meaning}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  backBtn: {
    marginBottom: spacing.md,
  },
  backText: {
    ...typography.bodySmall,
    color: colors.text.muted,
  },
  spreadName: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  spreadDesc: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  shuffleArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    marginBottom: spacing.xl,
    gap: 8,
  },
  shuffleCard: {
    shadowColor: colors.accent.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  miniCardBack: {
    width: 52,
    height: 88,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.card,
    borderWidth: 1.5,
    borderColor: colors.accent.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCardInner: {
    width: 28,
    height: 28,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.accent.gold,
    transform: [{ rotate: '45deg' }],
  },
  focusHeading: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  focusBody: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  intentionInput: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text.primary,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: spacing.xl,
  },
  btnContainer: {
    marginTop: spacing.sm,
  },
  selectionHint: {
    ...typography.bodySmall,
    color: colors.accent.goldLight,
    marginBottom: spacing.xl,
  },
  layoutContainer: {
    marginBottom: spacing.lg,
  },
  revealedNames: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  revealedRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  revealedPosition: {
    ...typography.label,
    color: colors.text.muted,
    textTransform: 'uppercase',
    width: 80,
  },
  revealedCardName: {
    ...typography.bodySmall,
    color: colors.text.gold,
    flex: 1,
  },
  intentionDisplay: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: spacing.lg,
  },
  resultBlock: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  resultBlockHeader: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  resultCardThumb: {
    flexShrink: 0,
  },
  resultBlockInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  resultPosition: {
    ...typography.label,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultCardName: {
    ...typography.h3,
    color: colors.text.primary,
  },
  orientationBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.goldDim,
    borderWidth: 1,
    borderColor: colors.accent.gold,
  },
  orientationReversed: {
    backgroundColor: 'rgba(196, 116, 138, 0.15)',
    borderColor: colors.accent.rose,
  },
  orientationText: {
    ...typography.caption,
    color: colors.text.gold,
    letterSpacing: 0.5,
  },
  positionDesc: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  keywordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  keyword: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.surface,
  },
  keywordText: {
    ...typography.caption,
    color: colors.accent.purpleLight,
  },
  meaningText: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 24,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.status.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  resultActions: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  savedLabel: {
    ...typography.button,
    color: colors.status.success,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
