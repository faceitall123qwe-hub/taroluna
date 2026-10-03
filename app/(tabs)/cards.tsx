import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { StarBackground } from '../../src/components/ui/StarBackground';
import { allCards } from '../../src/data';
import { getCardName } from '../../src/utils/cardName';
import { getCardMeaning } from '../../src/utils/cardContent';
import { useStore } from '../../src/store/useStore';
import { colors, spacing, typography, borderRadius } from '../../src/theme';
import type { TarotCard } from '../../src/types/cards';

const SUIT_PREFIX: Record<string, string> = {
  major: 'ar', wands: 'wa', cups: 'cu', swords: 'sw', pentacles: 'pe',
};

function getImageUri(imageFile: string): string {
  const parts = imageFile.replace('.jpg', '').split('-');
  const prefix = SUIT_PREFIX[parts[0]] ?? 'ar';
  const num = parts[1] ?? '00';
  return `https://www.sacred-texts.com/tarot/pkt/img/${prefix}${num}.jpg`;
}

const FILTER_OPTIONS = ['all', 'major', 'wands', 'cups', 'swords', 'pentacles'] as const;

export default function CardsScreen() {
  const language = useStore((s) => s.language);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<TarotCard | null>(null);

  const filtered = allCards.filter((c) => {
    if (filter !== 'all') {
      if (filter === 'major' && c.arcana !== 'major') return false;
      if (filter !== 'major' && c.suit !== filter) return false;
    }
    if (search) {
      const name = getCardName(c, language).toLowerCase();
      if (!name.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <StarBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Text style={styles.title}>Tarot Cards</Text>

        <TextInput
          style={styles.search}
          placeholder="Search cards..."
          placeholderTextColor={colors.text.muted}
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterRow}
        >
          {FILTER_OPTIONS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={filtered}
          keyExtractor={(c) => String(c.id)}
          numColumns={3}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <CardGridItem card={item} language={language} onPress={() => setSelected(item)} />
          )}
        />

        {selected && (
          <CardDetailModal card={selected} language={language} onClose={() => setSelected(null)} />
        )}
      </SafeAreaView>
    </StarBackground>
  );
}

function CardGridItem({ card, language, onPress }: { card: TarotCard; language: string; onPress: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <TouchableOpacity style={styles.gridItem} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.gridCard}>
        {!loaded && !error && (
          <ActivityIndicator color={colors.accent.gold} size="small" style={styles.gridLoader} />
        )}
        {error ? (
          <View style={styles.gridError}>
            <Text style={styles.gridErrorIcon}>✦</Text>
          </View>
        ) : (
          <Image
            source={{ uri: getImageUri(card.imageFile) }}
            style={styles.gridImage}
            resizeMode="cover"
            onLoad={() => setLoaded(true)}
            onError={() => { setError(true); setLoaded(true); }}
          />
        )}
      </View>
      <Text style={styles.gridName} numberOfLines={2}>{getCardName(card, language)}</Text>
    </TouchableOpacity>
  );
}

function CardDetailModal({ card, language, onClose }: { card: TarotCard; language: string; onClose: () => void }) {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const name = getCardName(card, language);

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={styles.modal}>
        <ScrollView contentContainerStyle={styles.modalScroll}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕  Close</Text>
          </TouchableOpacity>

          <View style={styles.modalImageWrap}>
            {!loaded && <ActivityIndicator color={colors.accent.gold} style={{ position: 'absolute' }} />}
            <Image
              source={{ uri: getImageUri(card.imageFile) }}
              style={styles.modalImage}
              resizeMode="contain"
              onLoad={() => setLoaded(true)}
            />
          </View>

          <Text style={styles.modalName}>{name}</Text>
          {card.arcana === 'major' && (
            <Text style={styles.modalArcana}>Major Arcana · {card.number}</Text>
          )}
          {card.suit && (
            <Text style={styles.modalArcana}>{card.suit.charAt(0).toUpperCase() + card.suit.slice(1)} · {card.number}</Text>
          )}

          <View style={styles.metaRow}>
            {card.element && <MetaChip label="Element" value={card.element} />}
            {card.planet && <MetaChip label="Planet" value={card.planet} />}
            {card.zodiac && <MetaChip label="Zodiac" value={card.zodiac} />}
          </View>

          {(() => {
            const upright = getCardMeaning(card, language, 'upright');
            const reversed = getCardMeaning(card, language, 'reversed');
            return (
              <>
                <SectionBlock title={t('card.upright', 'Upright')} keywords={upright.keywords} meaning={upright.meaning} love={upright.love} career={upright.career} health={upright.health} />
                <SectionBlock title={t('card.reversed', 'Reversed')} keywords={reversed.keywords} meaning={reversed.meaning} love={reversed.love} career={reversed.career} health={reversed.health} reversed />
              </>
            );
          })()}
        </ScrollView>
      </View>
    </Modal>
  );
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaChip}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function SectionBlock({ title, keywords, meaning, love, career, health, reversed }: {
  title: string; keywords: string[]; meaning: string; love: string; career: string; health: string; reversed?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <View style={[styles.section, reversed && styles.sectionReversed]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.keywordsRow}>
        {keywords.map((kw, i) => (
          <View key={i} style={styles.keyword}><Text style={styles.keywordText}>{kw}</Text></View>
        ))}
      </View>
      <Text style={styles.meaning}>{meaning}</Text>
      <SubSection icon="♥" label={t('card.love', 'Love')} text={love} />
      <SubSection icon="◆" label={t('card.career', 'Career')} text={career} />
      <SubSection icon="✦" label={t('card.health', 'Health')} text={health} />
    </View>
  );
}

function SubSection({ icon, label, text }: { icon: string; label: string; text: string }) {
  return (
    <View style={styles.subSection}>
      <Text style={styles.subLabel}>{icon} {label}</Text>
      <Text style={styles.subText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  title: { ...typography.h2, color: colors.text.primary, paddingHorizontal: spacing.md, paddingTop: spacing.lg, marginBottom: spacing.sm },
  search: {
    ...typography.body,
    color: colors.text.primary,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  filterScroll: { flexShrink: 0 },
  filterRow: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingVertical: spacing.xs, alignItems: 'center' },
  filterChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, minHeight: 36, justifyContent: 'center', borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.border.subtle },
  filterChipActive: { backgroundColor: colors.accent.goldDim, borderColor: colors.accent.gold },
  filterText: { ...typography.caption, color: colors.text.muted },
  filterTextActive: { color: colors.text.gold },
  grid: { paddingHorizontal: spacing.sm, paddingBottom: spacing.xxxl },
  gridItem: { flex: 1, margin: spacing.xs, alignItems: 'center' },
  gridCard: { width: '100%', aspectRatio: 0.6, backgroundColor: colors.background.card, borderRadius: borderRadius.sm, borderWidth: 1, borderColor: colors.border.subtle, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  gridImage: { width: '100%', height: '100%' },
  gridLoader: { position: 'absolute' },
  gridError: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.surface },
  gridErrorIcon: { fontSize: 22, color: colors.accent.purpleLight },
  gridName: { ...typography.caption, color: colors.text.secondary, textAlign: 'center', marginTop: 4 },
  modal: { flex: 1, backgroundColor: colors.background.primary },
  modalScroll: { padding: spacing.md, paddingBottom: spacing.xxxl },
  closeBtn: { paddingVertical: spacing.sm, marginBottom: spacing.md },
  closeText: { ...typography.bodySmall, color: colors.text.muted },
  modalImageWrap: { alignItems: 'center', marginBottom: spacing.lg, height: 300 },
  modalImage: { width: 180, height: 300 },
  modalName: { ...typography.h2, color: colors.text.primary, textAlign: 'center', marginBottom: 4 },
  modalArcana: { ...typography.bodySmall, color: colors.text.muted, textAlign: 'center', marginBottom: spacing.md },
  metaRow: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', marginBottom: spacing.lg, flexWrap: 'wrap' },
  metaChip: { alignItems: 'center', backgroundColor: colors.background.card, borderRadius: borderRadius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderWidth: 1, borderColor: colors.border.subtle },
  metaLabel: { ...typography.caption, color: colors.text.muted },
  metaValue: { ...typography.bodySmall, color: colors.text.gold },
  section: { backgroundColor: colors.background.secondary, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border.subtle },
  sectionReversed: { borderColor: 'rgba(196,116,138,0.3)' },
  sectionTitle: { ...typography.h3, color: colors.text.primary, marginBottom: spacing.sm },
  keywordsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.sm },
  keyword: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full, backgroundColor: colors.background.surface },
  keywordText: { ...typography.caption, color: colors.accent.purpleLight },
  meaning: { ...typography.body, color: colors.text.primary, marginBottom: spacing.md, lineHeight: 26 },
  subSection: { marginBottom: spacing.sm },
  subLabel: { ...typography.label, color: colors.accent.goldLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  subText: { ...typography.bodySmall, color: colors.text.secondary, lineHeight: 22 },
});
