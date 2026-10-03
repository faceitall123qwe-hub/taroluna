import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PurchasesPackage } from '../../services/revenuecat';
import { colors, spacing, borderRadius, typography } from '../../theme';

interface PricingCardProps {
  pkg: PurchasesPackage;
  isSelected: boolean;
  onSelect: (pkg: PurchasesPackage) => void;
  badge?: string;
  period?: string;
}

export function PricingCard({ pkg, isSelected, onSelect, badge, period }: PricingCardProps) {
  const product = pkg.product;

  return (
    <TouchableOpacity
      onPress={() => onSelect(pkg)}
      activeOpacity={0.8}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
    >
      <View style={[styles.card, isSelected && styles.cardSelected]}>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}

        <View style={styles.row}>
          <View style={styles.radioOuter}>
            {isSelected && <View style={styles.radioInner} />}
          </View>

          <View style={styles.info}>
            <Text style={styles.title}>{product.title}</Text>
            {period ? (
              <Text style={styles.period}>{period}</Text>
            ) : null}
          </View>

          <Text style={styles.price}>{product.priceString}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderColor: colors.border.medium,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardSelected: {
    borderColor: colors.accent.gold,
    backgroundColor: colors.accent.goldDim,
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: spacing.md,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.accent.gold,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  badgeText: {
    ...typography.bodySmall,
    color: colors.accent.gold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.accent.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent.gold,
  },
  info: {
    flex: 1,
  },
  title: {
    ...typography.body,
    color: colors.text.primary,
  },
  period: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: 2,
  },
  price: {
    ...typography.body,
    color: colors.text.gold,
    fontFamily: 'DMSans_700Bold',
  },
});
