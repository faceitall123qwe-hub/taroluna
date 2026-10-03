import { createClient } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import type { Database, SpreadType, CardPositionInput, Profile, Reading, ReadingCard } from '../types/database';

// Required for expo-web-browser to close the auth session on redirect back
WebBrowser.maybeCompleteAuthSession();

export type ReadingWithCards = Reading & { reading_cards: ReadingCard[] };

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export async function signInWithGoogle(): Promise<void> {
  const redirectUri = makeRedirectUri({ scheme: 'taroluna' });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUri,
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;
  if (!data.url) throw new Error('No OAuth URL returned');

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
  if (result.type !== 'success') return;

  const params = extractUrlParams(result.url);
  const accessToken = params['access_token'];
  const refreshToken = params['refresh_token'];
  if (!accessToken) return;

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken ?? '',
  });
  if (sessionError) throw sessionError;
}

function extractUrlParams(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  // Tokens arrive in the URL fragment (#) after Supabase redirect
  const fragment = url.split('#')[1] ?? url.split('?')[1] ?? '';
  for (const pair of fragment.split('&')) {
    const eq = pair.indexOf('=');
    if (eq === -1) continue;
    const key = pair.slice(0, eq);
    const val = pair.slice(eq + 1);
    if (key) params[key] = decodeURIComponent(val);
  }
  return params;
}

export async function signInWithApple(): Promise<void> {
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  if (!credential.identityToken) throw new Error('Apple Sign In failed: no identity token');
  const { error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken,
    nonce: rawNonce,
  });
  if (error) throw error;
}

export async function signInWithEmail(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string,
): Promise<void> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: displayName ? { data: { full_name: displayName } } : undefined,
  });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data as unknown as Profile | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rpc = supabase.rpc.bind(supabase) as any;

export async function canUserRead(userId: string): Promise<boolean> {
  const { data, error } = await rpc('get_user_can_read', { p_user_id: userId });
  if (error) throw error;
  return data as boolean;
}

export async function createReading(
  userId: string,
  spreadType: SpreadType,
  cardPositions: CardPositionInput[],
  notes?: string
): Promise<string> {
  const { data, error } = await rpc('create_reading_with_cards', {
    p_user_id: userId,
    p_spread_type: spreadType,
    p_card_positions: cardPositions,
    p_notes: notes ?? null,
  });
  if (error) throw error;
  return data as string;
}

export async function getUserReadings(userId: string): Promise<ReadingWithCards[]> {
  const { data, error } = await supabase
    .from('readings')
    .select('*, reading_cards (*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data as unknown as ReadingWithCards[]) ?? [];
}

export async function deleteReading(readingId: string): Promise<void> {
  const { error } = await supabase
    .from('readings')
    .delete()
    .eq('id', readingId);
  if (error) throw error;
}
