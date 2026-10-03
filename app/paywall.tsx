import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { PurchasesPackage } from '../src/services/revenuecat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarBackground } from '../src/components/ui/StarBackground';
import { Button } from '../src/components/ui/Button';
import { PricingCard } from '../src/components/paywall/PricingCard';
import { usePurchases } from '../src/hooks/usePurchases';
import { colors, spacing, typography, borderRadius } from '../src/theme';

const PRODUCT_IDS = {
  monthly: 'taroluna_monthly',
  annual: 'taroluna_annual',
  starter: 'taroluna_starter_8',
};

const FEATURES = [
  'Unlimited readings',
  'Celtic Cross spread',
  'Full reading history',
];

function getPeriodLabel(pkg: PurchasesPackage): string {
  const id = pkg.product.identifier;
  if (id === PRODUCT_IDS.monthly) return 'per month';
  if (id === PRODUCT_IDS.annual) return 'per year';
  return 'one-time';
}

function getBadge(pkg: PurchasesPackage): string | undefined {
  if (pkg.product.identifier === 'taroluna_annual') return 'BEST VALUE • -44% OFF';
  if (pkg.product.identifier === 'taroluna_popular_25') return '-30% OFF';
  return undefined;
}

function getDefaultSelected(pkgs: PurchasesPackage[]): PurchasesPackage | null {
  return pkgs.find((p) => p.product.identifier === PRODUCT_IDS.annual) ?? pkgs[0] ?? null;
}

function filterPaywallPackages(pkgs: PurchasesPackage[]): PurchasesPackage[] {
  const order = [PRODUCT_IDS.monthly, PRODUCT_IDS.annual, PRODUCT_IDS.starter];
  const ordered = order
    .map((id) => pkgs.find((p) => p.product.identifier === id))
    .filter((p): p is PurchasesPackage => p !== undefined);
  // Fall back to all packages if none matched
  return ordered.length > 0 ? ordered : pkgs;
}

export default function PaywallScreen() {
  const router = useRouter();
  const { offerings, isLoading, isPurchasing, purchase, restore } = usePurchases();
  const displayPackages = filterPaywallPackages(offerings);

  const [selected, setSelected] = useState<PurchasesPackage | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const resolvedSelected = selected ?? getDefaultSelected(displayPackages);

  async function handleContinue() {
    if (!resolvedSelected || isPurchasing) return;
    try {
      await purchase(resolvedSelected);
      setPurchaseSuccess(true);
      setTimeout(() => router.back(), 2000);
    } catch (err: unknown) {
      if (isCancelError(err)) return;
      throw err;
    }
  }

  async function handleRestore() {
    if (isPurchasing) return;
    try {
      await restore();
      router.back();
    } catch {
      // silent
    }
  }

  return (
    <StarBackground>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Unlock TaroLuna</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Feature bullets */}
          <View style={styles.features}>
            {FEATURES.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          {/* Pricing cards */}
          {isLoading ? (
            <ActivityIndicator
              color={colors.accent.gold}
              size="large"
              style={styles.loader}
            />
          ) : displayPackages.length === 0 ? (
            <Text style={styles.errorText}>
              Could not load offers. Check your connection and try again.
            </Text>
          ) : (
            <View style={styles.cards}>
              {displayPackages.map((pkg) => (
                <PricingCard
                  key={pkg.identifier}
                  pkg={pkg}
                  isSelected={resolvedSelected?.identifier === pkg.identifier}
                  onSelect={setSelected}
                  badge={getBadge(pkg)}
                  period={getPeriodLabel(pkg)}
                />
              ))}
            </View>
          )}

          {/* CTA */}
          <View style={styles.actions}>
            <Button
              title="Continue"
              onPress={handleContinue}
              size="lg"
              loading={isPurchasing}
              disabled={isLoading || displayPackages.length === 0}
            />

            <TouchableOpacity
              onPress={handleRestore}
              style={styles.restoreBtn}
              disabled={isPurchasing}
              accessibilityRole="button"
            >
              <Text style={styles.restoreText}>Restore Purchases</Text>
            </TouchableOpacity>

            <Text style={styles.legal}>
              Auto-renews. Cancel anytime.
            </Text>
          </View>
        </ScrollView>
        {purchaseSuccess && (
          <View style={styles.successOverlay}>
            <Text style={styles.successIcon}>✦</Text>
            <Text style={styles.successTitle}>Welcome to Premium!</Text>
            <Text style={styles.successSub}>All features unlocked</Text>
          </View>
        )}
      </SafeAreaView>
    </StarBackground>
  );
}

function isCancelError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as Record<string, unknown>;
  // RevenueCat Android / iOS cancel codes
  if (typeof e['code'] === 'string') {
    const code = e['code'];
    if (code === 'PURCHASE_CANCELLED') return true;
    if (code === '2') return true; // StoreKitError.userCancelled
  }
  if (typeof e['userCancelled'] === 'boolean' && e['userCancelled']) return true;
  return false;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
    padding: spacing.sm,
  },
  closeIcon: {
    ...typography.body,
    color: colors.text.muted,
  },
  scroll: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  features: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkmark: {
    ...typography.body,
    color: colors.accent.gold,
    fontFamily: 'DMSans_700Bold',
  },
  featureText: {
    ...typography.body,
    color: colors.text.primary,
  },
  loader: {
    marginVertical: spacing.xl,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.status.error,
    textAlign: 'center',
    marginVertical: spacing.xl,
  },
  cards: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  actions: {
    gap: spacing.md,
    alignItems: 'center',
  },
  restoreBtn: {
    paddingVertical: spacing.sm,
  },
  restoreText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
  legal: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  successIcon: {
    fontSize: 64,
    color: colors.accent.gold,
  },
  successTitle: {
    ...typography.h2,
    color: colors.text.primary,
  },
  successSub: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
