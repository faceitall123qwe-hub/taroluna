import { Platform } from 'react-native';

const RC_ANDROID_KEY = process.env.EXPO_PUBLIC_RC_ANDROID_KEY ?? '';
const RC_IOS_KEY = process.env.EXPO_PUBLIC_RC_IOS_KEY ?? '';

export interface PurchasesPackage {
  identifier: string;
  product: {
    identifier: string;
    title: string;
    description: string;
    priceString: string;
    price: number;
    currencyCode: string;
  };
}

let Purchases: any = null;

async function getPurchases() {
  if (Purchases) return Purchases;
  try {
    const mod = await import('react-native-purchases');
    Purchases = mod.default ?? mod;
    return Purchases;
  } catch {
    return null;
  }
}

export async function initRevenueCat(): Promise<void> {
  const P = await getPurchases();
  if (!P) return;
  const key = Platform.OS === 'ios' ? RC_IOS_KEY : RC_ANDROID_KEY;
  if (!key) return;
  try {
    P.configure({ apiKey: key });
  } catch {}
}

export async function getOfferings(): Promise<PurchasesPackage[]> {
  const P = await getPurchases();
  if (!P || !(RC_ANDROID_KEY || RC_IOS_KEY)) return getMockOfferings();
  try {
    const offerings = await P.getOfferings();
    const pkgs = offerings?.current?.availablePackages ?? [];
    if (pkgs.length === 0) return getMockOfferings();
    return pkgs.map((p: any) => ({
      identifier: p.identifier,
      product: {
        identifier: p.product.identifier,
        title: p.product.title,
        description: p.product.description,
        priceString: p.product.priceString,
        price: p.product.price,
        currencyCode: p.product.currencyCode,
      },
    }));
  } catch {
    return getMockOfferings();
  }
}

export async function purchasePackage(_pkg: PurchasesPackage): Promise<boolean> {
  const P = await getPurchases();
  // Without RevenueCat keys nothing can be bought; billing state is written only by the webhook.
  if (!P || !(RC_ANDROID_KEY || RC_IOS_KEY)) return false;
  try {
    // Find the real package from RevenueCat offerings
    const offerings = await P.getOfferings();
    const pkgs = offerings?.current?.availablePackages ?? [];
    const realPkg = pkgs.find((p: any) => p.identifier === _pkg.identifier);
    if (!realPkg) return false;
    const { customerInfo } = await P.purchasePackage(realPkg);
    return Object.keys(customerInfo?.entitlements?.active ?? {}).length > 0;
  } catch (e: any) {
    if (e?.userCancelled || e?.code === '2') return false;
    throw e;
  }
}

export async function checkEntitlement(): Promise<boolean> {
  const P = await getPurchases();
  if (!P || !(RC_ANDROID_KEY || RC_IOS_KEY)) {
    try {
      const { supabase } = await import('./supabase');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      const { data } = await supabase.from('profiles').select('is_subscribed').eq('id', user.id).single();
      return (data as any)?.is_subscribed ?? false;
    } catch { return false; }
  }
  try {
    const info = await P.getCustomerInfo();
    return Object.keys(info?.entitlements?.active ?? {}).length > 0;
  } catch { return false; }
}

export async function restorePurchases(): Promise<boolean> {
  const P = await getPurchases();
  if (!P || !(RC_ANDROID_KEY || RC_IOS_KEY)) return false;
  try {
    const info = await P.restorePurchases();
    return Object.keys(info?.entitlements?.active ?? {}).length > 0;
  } catch { return false; }
}

export async function identifyUser(userId: string): Promise<void> {
  const P = await getPurchases();
  if (!P) return;
  try { await P.logIn(userId); } catch {}
}

export async function logOutRevenueCat(): Promise<void> {
  const P = await getPurchases();
  if (!P) return;
  try { await P.logOut(); } catch {}
}

function getMockOfferings(): PurchasesPackage[] {
  // Detect currency from device locale
  let currency = 'EUR';
  let prices = { starter: '5.99', popular: '12.99', monthly: '3.99', annual: '24.99' };
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale ?? '';
    if (locale.includes('PL') || locale.includes('pl')) {
      currency = 'PLN';
      prices = { starter: '19.99', popular: '49.99', monthly: '14.99', annual: '99.99' };
    } else if (locale.includes('US') || locale.includes('us')) {
      currency = 'USD';
      prices = { starter: '5.99', popular: '14.99', monthly: '4.99', annual: '29.99' };
    }
  } catch {}

  const fmt = (p: string) => currency === 'PLN' ? `${p} zł` : currency === 'USD' ? `$${p}` : `€${p}`;

  return [
    { identifier: 'taroluna_starter_8',  product: { identifier: 'taroluna_starter_8', title: 'Starter Pack',  description: '8 readings',          priceString: fmt(prices.starter),  price: parseFloat(prices.starter),  currencyCode: currency } },
    { identifier: 'taroluna_popular_25', product: { identifier: 'taroluna_popular_25', title: 'Popular Pack',  description: '25 readings',         priceString: fmt(prices.popular),  price: parseFloat(prices.popular),  currencyCode: currency } },
    { identifier: 'taroluna_monthly',    product: { identifier: 'taroluna_monthly', title: 'Monthly',       description: 'Unlimited readings',  priceString: fmt(prices.monthly),  price: parseFloat(prices.monthly),  currencyCode: currency } },
    { identifier: 'taroluna_annual',     product: { identifier: 'taroluna_annual', title: 'Annual',        description: 'Unlimited readings',  priceString: fmt(prices.annual),   price: parseFloat(prices.annual),   currencyCode: currency } },
  ];
}
