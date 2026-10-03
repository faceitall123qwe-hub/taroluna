import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';
import type { TarotCard } from '../../types/cards';

const SUIT_PREFIX: Record<string, string> = {
  major: 'ar', wands: 'wa', cups: 'cu', swords: 'sw', pentacles: 'pe',
};

function getCardImageUri(imageFile: string): string {
  const parts = imageFile.replace('.jpg', '').split('-');
  const prefix = SUIT_PREFIX[parts[0]] ?? 'ar';
  const num = parts[1] ?? '00';
  return `https://www.sacred-texts.com/tarot/pkt/img/${prefix}${num}.jpg`;
}

const CARD_DIMENSIONS = {
  sm: { width: 70, height: 120 },
  md: { width: 110, height: 188 },
  lg: { width: 150, height: 257 },
} as const;

interface TaroCardProps {
  card: TarotCard;
  size: 'sm' | 'md' | 'lg';
  isRevealed: boolean;
  onPress?: () => void;
}

function CardBack({ width, height }: { width: number; height: number }) {
  const cx = width / 2;
  const cy = height / 2;
  const numRings = 4;

  return (
    <View style={[styles.cardBack, { width, height }]}>
      {/* Concentric diamond rings */}
      {Array.from({ length: numRings }).map((_, i) => {
        const scale = 0.3 + i * 0.18;
        const size = Math.min(width, height) * scale;
        return (
          <View
            key={i}
            style={[
              styles.diamondRing,
              {
                width: size,
                height: size,
                borderRadius: 2,
                transform: [{ rotate: '45deg' }],
                borderColor:
                  i === 0
                    ? colors.accent.gold
                    : `rgba(201, 168, 76, ${0.6 - i * 0.12})`,
              },
            ]}
          />
        );
      })}
      {/* Center star dot */}
      <View style={styles.centerDot} />
      {/* Corner ornaments */}
      {[
        { top: spacing.xs, left: spacing.xs },
        { top: spacing.xs, right: spacing.xs },
        { bottom: spacing.xs, left: spacing.xs },
        { bottom: spacing.xs, right: spacing.xs },
      ].map((pos, i) => (
        <View key={i} style={[styles.cornerOrnament, pos]} />
      ))}
    </View>
  );
}

export function TaroCard({ card, size, isRevealed, onPress }: TaroCardProps) {
  const { width, height } = CARD_DIMENSIONS[size];
  const flipAnim = useRef(new Animated.Value(0)).current;
  const prevRevealed = useRef(isRevealed);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (prevRevealed.current === isRevealed) return;
    prevRevealed.current = isRevealed;

    Animated.timing(flipAnim, {
      toValue: isRevealed ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isRevealed, flipAnim]);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['180deg', '90deg', '0deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '180deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.45, 0.55, 1],
    outputRange: [0, 0, 1, 1],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.45, 0.55, 1],
    outputRange: [1, 1, 0, 0],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.85 : 1}
      style={{ width, height }}
    >
      {/* Back face */}
      <Animated.View
        style={[
          styles.cardFace,
          { width, height, borderRadius: borderRadius.md },
          { opacity: backOpacity, transform: [{ rotateY: backInterpolate }] },
        ]}
      >
        <CardBack width={width} height={height} />
      </Animated.View>

      {/* Front face */}
      <Animated.View
        style={[
          styles.cardFace,
          styles.cardFaceFront,
          { width, height, borderRadius: borderRadius.md },
          { opacity: frontOpacity, transform: [{ rotateY: frontInterpolate }] },
        ]}
      >
        <Image
          source={{ uri: getCardImageUri(card.imageFile) }}
          style={[styles.cardImage, { width, height: height - (size === 'sm' ? 20 : 32) }]}
          resizeMode="cover"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
        {!imgLoaded && !imgError && (
          <View style={[styles.cardImage, { width, height: height - (size === 'sm' ? 20 : 32), backgroundColor: colors.background.card, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0 }]}>
            <ActivityIndicator color={colors.accent.gold} size="small" />
          </View>
        )}
        {imgError && (
          <View style={[styles.cardImage, { width, height: height - (size === 'sm' ? 20 : 32), position: 'absolute', top: 0 }]}>
            <CardBack width={width} height={height - (size === 'sm' ? 20 : 32)} />
          </View>
        )}
        {size !== 'sm' && (
          <Text
            style={[styles.cardName, size === 'lg' && styles.cardNameLg]}
            numberOfLines={1}
          >
            {card.name}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardFace: {
    position: 'absolute',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.accent.purpleLight,
    shadowColor: colors.accent.purpleLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    backfaceVisibility: 'hidden',
  },
  cardFaceFront: {
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cardBack: {
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    borderTopLeftRadius: borderRadius.md - 1,
    borderTopRightRadius: borderRadius.md - 1,
  },
  cardName: {
    ...typography.caption,
    color: colors.text.gold,
    textAlign: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    letterSpacing: 0.8,
  },
  cardNameLg: {
    ...typography.bodySmall,
    color: colors.text.gold,
  },
  diamondRing: {
    position: 'absolute',
    borderWidth: 1,
  },
  centerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent.gold,
  },
  cornerOrnament: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent.gold,
    transform: [{ rotate: '45deg' }],
  },
});
