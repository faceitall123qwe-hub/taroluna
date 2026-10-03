import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaroCard } from '../ui/TaroCard';
import { colors, spacing, typography } from '../../theme';
import type { TarotCard, Spread } from '../../types/cards';

interface CardSlot {
  card: TarotCard;
  isReversed: boolean;
  isRevealed: boolean;
  positionName: string;
  onPress?: () => void;
}

interface SpreadLayoutProps {
  spreadId: Spread['id'];
  slots: CardSlot[];
}

export function SpreadLayout({ spreadId, slots }: SpreadLayoutProps) {
  switch (spreadId) {
    case 'card_of_the_day':
    case 'yes_no':
      return <SingleCardLayout slots={slots} />;
    case 'three_card':
    case 'mind_body_spirit':
    case 'shadow_self':
      return <ThreeCardLayout slots={slots} showLabels={spreadId !== 'three_card'} />;
    case 'career_path':
    case 'monthly_forecast':
      return <FourCardLayout slots={slots} />;
    case 'relationship_dynamics':
      return <FiveCardLayout slots={slots} />;
    case 'celtic_cross':
      return <CelticCrossLayout slots={slots} />;
  }
}

function SingleCardLayout({ slots }: { slots: CardSlot[] }) {
  const slot = slots[0];
  if (!slot) return null;
  return (
    <View style={layouts.singleCenter}>
      <CardWithLabel slot={slot} size="lg" />
    </View>
  );
}

function ThreeCardLayout({ slots, showLabels }: { slots: CardSlot[]; showLabels: boolean }) {
  return (
    <View style={layouts.row}>
      {slots.map((slot, i) => (
        <CardWithLabel key={i} slot={slot} size="sm" showLabel={showLabels} />
      ))}
    </View>
  );
}

function FourCardLayout({ slots }: { slots: CardSlot[] }) {
  const top = slots.slice(0, 2);
  const bottom = slots.slice(2, 4);
  return (
    <View style={layouts.grid2x2}>
      <View style={layouts.row}>
        {top.map((slot, i) => (
          <CardWithLabel key={i} slot={slot} size="sm" />
        ))}
      </View>
      <View style={layouts.row}>
        {bottom.map((slot, i) => (
          <CardWithLabel key={i} slot={slot} size="sm" />
        ))}
      </View>
    </View>
  );
}

function FiveCardLayout({ slots }: { slots: CardSlot[] }) {
  const top = slots.slice(0, 3);
  const bottom = slots.slice(3, 5);
  return (
    <View style={layouts.fiveRoot}>
      <View style={layouts.row}>
        {top.map((slot, i) => (
          <CardWithLabel key={i} slot={slot} size="sm" />
        ))}
      </View>
      <View style={layouts.fiveBottom}>
        {bottom.map((slot, i) => (
          <CardWithLabel key={i} slot={slot} size="sm" />
        ))}
      </View>
    </View>
  );
}

function CelticCrossLayout({ slots }: { slots: CardSlot[] }) {
  // Celtic Cross: cross (0-5) + staff (6-9)
  // Cross layout:
  //       [4]
  //  [3] [0/1] [5]
  //       [2]
  // Staff (right column, top to bottom): 9, 8, 7, 6
  if (slots.length < 10) return null;

  return (
    <View style={layouts.celticRoot}>
      {/* Cross section */}
      <View style={layouts.celticCross}>
        {/* Top: Crown (4) */}
        <View style={layouts.celticTop}>
          <CardSlotView slot={slots[4]} size="sm" />
        </View>
        {/* Middle row: Past (3), Present+Challenge (0,1), Future (5) */}
        <View style={layouts.celticMiddle}>
          <CardSlotView slot={slots[3]} size="sm" />
          {/* Overlapping center: Present (0) + Challenge (1) rotated */}
          <View style={layouts.celticCenter}>
            <CardSlotView slot={slots[0]} size="sm" />
            <View
              style={layouts.challengeOverlay}
              pointerEvents={slots[1].onPress ? 'auto' : 'none'}
            >
              <CardSlotView slot={slots[1]} size="sm" rotated />
            </View>
          </View>
          <CardSlotView slot={slots[5]} size="sm" />
        </View>
        {/* Bottom: Foundation (2) */}
        <View style={layouts.celticBottom}>
          <CardSlotView slot={slots[2]} size="sm" />
        </View>
      </View>

      {/* Staff section */}
      <View style={layouts.celticStaff}>
        {[9, 8, 7, 6].map((idx) => (
          <CardSlotView key={idx} slot={slots[idx]} size="sm" />
        ))}
      </View>
    </View>
  );
}

function CardWithLabel({
  slot,
  size,
  showLabel = true,
}: {
  slot: CardSlot;
  size: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}) {
  return (
    <View style={layouts.cardWithLabel}>
      {showLabel && (
        <Text style={styles.positionLabel} numberOfLines={1}>
          {slot.positionName}
        </Text>
      )}
      <TaroCard
        card={slot.card}
        size={size}
        isRevealed={slot.isRevealed}
        onPress={slot.onPress}
      />
      {!showLabel && (
        <Text style={styles.positionLabelBelow} numberOfLines={1}>
          {slot.positionName}
        </Text>
      )}
    </View>
  );
}

function CardSlotView({
  slot,
  size,
  rotated = false,
}: {
  slot: CardSlot;
  size: 'sm' | 'md' | 'lg';
  rotated?: boolean;
}) {
  return (
    <View style={rotated && styles.rotated}>
      <TaroCard
        card={slot.card}
        size={size}
        isRevealed={slot.isRevealed}
        onPress={slot.onPress}
      />
    </View>
  );
}

const layouts = StyleSheet.create({
  singleCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: spacing.md,
  },
  cardWithLabel: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  grid2x2: {
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  fiveRoot: {
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  fiveBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  celticRoot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  celticCross: {
    alignItems: 'center',
  },
  celticTop: {
    marginBottom: 2,
  },
  celticMiddle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  celticCenter: {
    position: 'relative',
    width: 74,
    height: 124,
  },
  challengeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  celticBottom: {
    marginTop: 2,
  },
  celticStaff: {
    gap: 4,
  },
});

const styles = StyleSheet.create({
  positionLabel: {
    ...typography.label,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  positionLabelBelow: {
    ...typography.label,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.xs,
  },
  rotated: {
    transform: [{ rotate: '90deg' }],
  },
});
