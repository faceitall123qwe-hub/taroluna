import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { StarBackground } from '../../src/components/ui/StarBackground';
import { allCards } from '../../src/data';
import { useStore } from '../../src/store/useStore';
import { colors, spacing, typography, borderRadius } from '../../src/theme';
import type { TarotCard } from '../../src/types/cards';

const ZODIAC_SIGNS = [
  { key: 'aries',       emoji: '♈', dates: 'Mar 21–Apr 19', element: 'Fire',  tarotId: 5  },
  { key: 'taurus',      emoji: '♉', dates: 'Apr 20–May 20', element: 'Earth', tarotId: 6  },
  { key: 'gemini',      emoji: '♊', dates: 'May 21–Jun 20', element: 'Air',   tarotId: 7  },
  { key: 'cancer',      emoji: '♋', dates: 'Jun 21–Jul 22', element: 'Water', tarotId: 8  },
  { key: 'leo',         emoji: '♌', dates: 'Jul 23–Aug 22', element: 'Fire',  tarotId: 9  },
  { key: 'virgo',       emoji: '♍', dates: 'Aug 23–Sep 22', element: 'Earth', tarotId: 10 },
  { key: 'libra',       emoji: '♎', dates: 'Sep 23–Oct 22', element: 'Air',   tarotId: 12 },
  { key: 'scorpio',     emoji: '♏', dates: 'Oct 23–Nov 21', element: 'Water', tarotId: 14 },
  { key: 'sagittarius', emoji: '♐', dates: 'Nov 22–Dec 21', element: 'Fire',  tarotId: 15 },
  { key: 'capricorn',   emoji: '♑', dates: 'Dec 22–Jan 19', element: 'Earth', tarotId: 16 },
  { key: 'aquarius',    emoji: '♒', dates: 'Jan 20–Feb 18', element: 'Air',   tarotId: 18 },
  { key: 'pisces',      emoji: '♓', dates: 'Feb 19–Mar 20', element: 'Water', tarotId: 19 },
];

type PeriodKey = 'day' | 'week' | 'month' | 'year';

const SUIT_PREFIX: Record<string, string> = {
  major: 'ar', wands: 'wa', cups: 'cu', swords: 'sw', pentacles: 'pe',
};

function getImageUri(imageFile: string): string {
  const parts = imageFile.replace('.jpg', '').split('-');
  return `https://www.sacred-texts.com/tarot/pkt/img/${SUIT_PREFIX[parts[0]] ?? 'ar'}${parts[1] ?? '00'}.jpg`;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getPeriodSeed(period: PeriodKey): string {
  const d = new Date();
  switch (period) {
    case 'day':   return d.toDateString();
    case 'week':  {
      const start = new Date(d);
      start.setDate(d.getDate() - d.getDay());
      return `week-${start.toDateString()}`;
    }
    case 'month': return `month-${d.getFullYear()}-${d.getMonth()}`;
    case 'year':  return `year-${d.getFullYear()}`;
  }
}

function getPeriodCard(signKey: string, period: PeriodKey): { card: TarotCard; isReversed: boolean } {
  const seed = getPeriodSeed(period) + signKey;
  const hash = hashString(seed);
  return {
    card: allCards[hash % allCards.length],
    isReversed: (hash % 5) < 2,
  };
}

function getAdvice(signKey: string, card: TarotCard, isReversed: boolean, period: PeriodKey, signName: string): {
  general: string; love: string; career: string; finance: string; health: string;
} {
  const sign = ZODIAC_SIGNS.find((s) => s.key === signKey)!;
  const m = isReversed ? card.reversed : card.upright;
  const kw = m.keywords[0] ?? 'reflection';
  const kw2 = m.keywords[1] ?? 'change';
  const periodLabel = { day: 'today', week: 'this week', month: 'this month', year: 'this year' }[period];
  const elem = sign.element.toLowerCase();
  const caution = isReversed;

  const general = caution
    ? `${signName}, ${periodLabel} calls for caution. The energy of ${kw} may feel blocked — take time to reflect before acting. ${m.meaning.slice(0, 120)}...`
    : `${signName}, ${periodLabel} brings the energy of ${kw} and ${kw2}. Trust your ${elem} instincts and move forward with confidence. ${m.meaning.slice(0, 120)}...`;

  const love = caution
    ? `In love, ${signName}, avoid pushing too hard ${periodLabel}. ${m.love.slice(0, 100)}...`
    : `Love favors you ${periodLabel}, ${signName}. ${m.love.slice(0, 120)}...`;

  const career = caution
    ? `At work, be careful with decisions ${periodLabel}. ${m.career.slice(0, 100)}...`
    : `Career-wise, ${periodLabel} is a good time for ${kw}. ${m.career.slice(0, 120)}...`;

  const finance = caution
    ? `${signName}, be careful with money ${periodLabel} — avoid impulsive spending or risky investments.`
    : `Financially, ${periodLabel} supports steady growth for ${signName}. Focus on ${kw2}.`;

  const health = caution
    ? `Pay attention to your body ${periodLabel}, ${signName}. ${m.health.slice(0, 100)}...`
    : `Your health energy ${periodLabel}: ${m.health.slice(0, 120)}...`;

  return { general, love, career, finance, health };
}

export default function ZodiacScreen() {
  const { t } = useTranslation();
  const profile = useStore((s) => s.profile);
  const [selectedSign, setSelectedSign] = useState<string | null>((profile as any)?.zodiac_sign ?? null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [period, setPeriod] = useState<PeriodKey>('day');

  const sign = ZODIAC_SIGNS.find((s) => s.key === selectedSign);
  const signName = sign ? t(`zodiac.signs.${sign.key}`, sign.key) : '';

  const PERIODS: { key: PeriodKey; label: string }[] = [
    { key: 'day',   label: t('zodiac.today') },
    { key: 'week',  label: t('zodiac.week')  },
    { key: 'month', label: t('zodiac.month') },
    { key: 'year',  label: t('zodiac.year')  },
  ];

  return (
    <StarBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{t('zodiac.title')}</Text>

          <TouchableOpacity style={styles.signSelector} onPress={() => setPickerVisible(true)}>
            {sign ? (
              <>
                <Text style={styles.signEmoji}>{sign.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.signName}>{signName}</Text>
                  <Text style={styles.signDates}>{sign.dates}</Text>
                </View>
                <Text style={styles.changeText}>{t('zodiac.changeSign')}</Text>
              </>
            ) : (
              <Text style={styles.selectPrompt}>{t('zodiac.selectSign')}</Text>
            )}
          </TouchableOpacity>

          {sign && (
            <>
              <View style={styles.periodRow}>
                {PERIODS.map((p) => (
                  <TouchableOpacity
                    key={p.key}
                    style={[styles.periodTab, period === p.key && styles.periodTabActive]}
                    onPress={() => setPeriod(p.key)}
                  >
                    <Text style={[styles.periodText, period === p.key && styles.periodTextActive]}>
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <PeriodForecast sign={sign} signName={signName} period={period} />
            </>
          )}

          {!sign && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>✦</Text>
              <Text style={styles.emptyText}>{t('zodiac.emptyState')}</Text>
            </View>
          )}
        </ScrollView>

        <SignPickerModal
          visible={pickerVisible}
          onClose={() => setPickerVisible(false)}
          onSelect={(key) => { setSelectedSign(key); setPickerVisible(false); }}
          current={selectedSign}
        />
      </SafeAreaView>
    </StarBackground>
  );
}

function PeriodForecast({ sign, signName, period }: {
  sign: typeof ZODIAC_SIGNS[number]; signName: string; period: PeriodKey;
}) {
  const { t } = useTranslation();
  const { card, isReversed } = getPeriodCard(sign.key, period);
  const advice = getAdvice(sign.key, card, isReversed, period, signName);
  const [imgLoaded, setImgLoaded] = useState(false);

  const cardLabelKey = `zodiac.cardLabel_${period}` as const;
  const cardLabel = t(cardLabelKey, { sign: signName.toUpperCase() });

  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{cardLabel}</Text>
        <View style={styles.cardRow}>
          <View style={styles.cardImageWrap}>
            {!imgLoaded && <ActivityIndicator color={colors.accent.gold} style={{ position: 'absolute' }} />}
            <Image
              source={{ uri: getImageUri(card.imageFile) }}
              style={styles.cardImage}
              resizeMode="cover"
              onLoad={() => setImgLoaded(true)}
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{card.name}</Text>
            <View style={[styles.badge, isReversed && styles.badgeReversed]}>
              <Text style={styles.badgeText}>
                {isReversed ? t('zodiac.reversed') : t('zodiac.upright')}
              </Text>
            </View>
            <View style={styles.keywordsRow}>
              {(isReversed ? card.reversed : card.upright).keywords.slice(0, 3).map((kw, i) => (
                <View key={i} style={styles.keyword}>
                  <Text style={styles.keywordText}>{kw}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Text style={styles.generalText}>{advice.general}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{t('zodiac.areasOfLife')}</Text>
        <AdviceBlock icon="♥" label={t('zodiac.love')} text={advice.love} />
        <AdviceBlock icon="◆" label={t('zodiac.career')} text={advice.career} />
        <AdviceBlock icon="$" label={t('zodiac.finance')} text={advice.finance} />
        <AdviceBlock icon="✦" label={t('zodiac.health')} text={advice.health} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{t('zodiac.yourSign')}</Text>
        <View style={styles.signInfoRow}>
          <View style={styles.elementBadge}>
            <Text style={styles.elementText}>{sign.element}</Text>
          </View>
          <Text style={styles.signCardText}>
            {sign.emoji} {signName} · {sign.dates}
          </Text>
        </View>
      </View>
    </View>
  );
}

function AdviceBlock({ icon, label, text }: { icon: string; label: string; text: string }) {
  return (
    <View style={styles.adviceBlock}>
      <Text style={styles.adviceLabel}>{icon} {label}</Text>
      <Text style={styles.adviceText}>{text}</Text>
    </View>
  );
}

function SignPickerModal({ visible, onClose, onSelect, current }: {
  visible: boolean; onClose: () => void; onSelect: (key: string) => void; current: string | null;
}) {
  const { t } = useTranslation();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.pickerOverlay}>
        <View style={styles.pickerSheet}>
          <Text style={styles.pickerTitle}>{t('zodiac.chooseSign')}</Text>
          <FlatList
            data={ZODIAC_SIGNS}
            keyExtractor={(s) => s.key}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.pickerItem, current === item.key && styles.pickerItemActive]}
                onPress={() => onSelect(item.key)}
              >
                <Text style={styles.pickerEmoji}>{item.emoji}</Text>
                <Text style={[styles.pickerName, current === item.key && styles.pickerNameActive]}>
                  {t(`zodiac.signs.${item.key}`, item.key)}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.pickerClose} onPress={onClose}>
            <Text style={styles.pickerCloseText}>{t('zodiac.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxxl },
  title: { ...typography.h2, color: colors.text.primary, marginBottom: spacing.lg },
  signSelector: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.background.card, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border.gold,
    padding: spacing.md, marginBottom: spacing.lg,
  },
  signEmoji: { fontSize: 36 },
  signName: { ...typography.h3, color: colors.text.primary },
  signDates: { ...typography.caption, color: colors.text.muted },
  changeText: { ...typography.bodySmall, color: colors.accent.goldLight },
  selectPrompt: { ...typography.body, color: colors.text.muted, flex: 1, textAlign: 'center' },
  periodRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.lg },
  periodTab: {
    flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.md,
    backgroundColor: colors.background.card, alignItems: 'center',
    borderWidth: 1, borderColor: colors.border.subtle,
  },
  periodTabActive: { backgroundColor: colors.accent.goldDim, borderColor: colors.accent.gold },
  periodText: { ...typography.bodySmall, color: colors.text.muted },
  periodTextActive: { color: colors.text.gold, fontFamily: 'DMSans_500Medium' },
  emptyState: { alignItems: 'center', paddingTop: spacing.xxxl, gap: spacing.md },
  emptyEmoji: { fontSize: 48, color: colors.accent.gold },
  emptyText: { ...typography.body, color: colors.text.secondary, textAlign: 'center' },
  section: {
    backgroundColor: colors.background.secondary, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border.subtle,
    padding: spacing.md, marginBottom: spacing.md,
  },
  sectionLabel: { ...typography.label, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.md },
  cardRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  cardImageWrap: {
    width: 80, height: 135, borderRadius: borderRadius.sm, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border.gold,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.card,
  },
  cardImage: { width: 80, height: 135 },
  cardInfo: { flex: 1, gap: spacing.sm },
  cardName: { ...typography.h3, color: colors.text.primary },
  badge: { alignSelf: 'flex-start', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full, backgroundColor: colors.accent.goldDim, borderWidth: 1, borderColor: colors.accent.gold },
  badgeReversed: { backgroundColor: 'rgba(196,116,138,0.15)', borderColor: colors.accent.rose },
  badgeText: { ...typography.caption, color: colors.text.gold },
  keywordsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  keyword: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full, backgroundColor: colors.background.surface },
  keywordText: { ...typography.caption, color: colors.accent.purpleLight },
  generalText: { ...typography.body, color: colors.text.primary, lineHeight: 26 },
  signInfoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  elementBadge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, backgroundColor: colors.accent.goldDim, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.accent.gold },
  elementText: { ...typography.bodySmall, color: colors.text.gold },
  signCardText: { ...typography.bodySmall, color: colors.text.secondary },
  adviceBlock: { marginBottom: spacing.md },
  adviceLabel: { ...typography.label, color: colors.accent.goldLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  adviceText: { ...typography.bodySmall, color: colors.text.secondary, lineHeight: 22 },
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  pickerSheet: { backgroundColor: colors.background.secondary, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg, paddingBottom: spacing.xxxl },
  pickerTitle: { ...typography.h3, color: colors.text.primary, textAlign: 'center', marginBottom: spacing.lg },
  pickerItem: { flex: 1, alignItems: 'center', padding: spacing.sm, borderRadius: borderRadius.md, marginBottom: spacing.sm },
  pickerItemActive: { backgroundColor: colors.accent.goldDim },
  pickerEmoji: { fontSize: 28, marginBottom: 4 },
  pickerName: { ...typography.caption, color: colors.text.secondary, textAlign: 'center' },
  pickerNameActive: { color: colors.text.gold },
  pickerClose: { marginTop: spacing.sm, alignItems: 'center', paddingVertical: spacing.md },
  pickerCloseText: { ...typography.body, color: colors.text.muted },
});
