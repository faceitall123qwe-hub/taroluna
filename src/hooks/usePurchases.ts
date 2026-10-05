import { useCallback, useEffect, useState } from 'react';
import { PurchasesPackage } from '../services/revenuecat';
import {
  checkEntitlement,
  getOfferings,
  purchasePackage,
  restorePurchases,
} from '../services/revenuecat';
import { getUserProfile, getCurrentUser } from '../services/supabase';
import { useStore } from '../store/useStore';

export function usePurchases() {
  const [offerings, setOfferings] = useState<PurchasesPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const setProfile = useStore((s) => s.setProfile);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [pkgs, entitled] = await Promise.all([
          getOfferings(),
          checkEntitlement(),
        ]);
        if (!cancelled) {
          setOfferings(pkgs);
          setIsSubscribed(entitled);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // Billing state is written by the RevenueCat webhook, which lands a few seconds after the
  // purchase, so poll the profile until it changes.
  const syncProfileFromServer = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user) return;
    const before = await getUserProfile(user.id);
    let profile = before;
    for (let i = 0; i < 8; i++) {
      if (profile?.is_subscribed || (profile?.paid_readings ?? 0) > (before?.paid_readings ?? 0)) break;
      await new Promise((r) => setTimeout(r, 1500));
      profile = await getUserProfile(user.id);
    }
    setProfile(profile);
    setIsSubscribed(profile?.is_subscribed ?? false);
  }, [setProfile]);

  const purchase = useCallback(async (pkg: PurchasesPackage) => {
    setIsPurchasing(true);
    try {
      await purchasePackage(pkg);
      await syncProfileFromServer();
    } finally {
      setIsPurchasing(false);
    }
  }, [syncProfileFromServer]);

  const restore = useCallback(async () => {
    setIsPurchasing(true);
    try {
      await restorePurchases();
      await syncProfileFromServer();
    } finally {
      setIsPurchasing(false);
    }
  }, [syncProfileFromServer]);

  return { offerings, isLoading, isPurchasing, isSubscribed, purchase, restore };
}
