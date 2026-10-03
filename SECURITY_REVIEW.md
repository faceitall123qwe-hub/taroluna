# Security Review — TaroLuna

**Date:** 2026-05-16
**Reviewer:** Automated security audit agent
**Stack:** React Native + Expo + TypeScript + Supabase + RevenueCat

---

## Files Audited

- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_functions.sql`
- `src/services/supabase.ts`
- `src/services/revenuecat.ts`
- `src/hooks/usePurchases.ts`
- `src/hooks/useAuth.ts`
- `src/hooks/useReading.ts`
- `app/auth/login.tsx`
- `app/auth/register.tsx`
- `app/reading/[spreadId].tsx`
- `app/paywall.tsx`
- `.env.example`
- `src/store/useStore.ts`

---

## Issues Found and Fixed

### CRITICAL — SECURITY DEFINER functions did not verify caller identity

**File:** `supabase/migrations/002_functions.sql`

`increment_reading_count`, `get_user_can_read`, and `create_reading_with_cards` all accepted `p_user_id UUID` as a parameter and used it directly without checking it against `auth.uid()`. Any authenticated user could pass another user's UUID and:
- Read whether another user can perform a reading
- Create readings billed to another user's count
- Cause another user's free reading quota to be exhausted

**Fix applied:** Each function now raises `EXCEPTION 'unauthorized'` if `p_user_id IS DISTINCT FROM auth.uid()`.

---

### HIGH — Apple Sign-In missing nonce (replay attack risk)

**File:** `src/services/supabase.ts` — `signInWithApple()`

The Apple identity token was passed to `supabase.auth.signInWithIdToken` without a nonce. Without a nonce, a captured identity token can be replayed by an attacker to sign in as the victim.

**Fix applied:** A random nonce is now generated with `expo-crypto`, its SHA-256 hash is passed to Apple's `signInAsync`, and the raw nonce is passed to Supabase for server-side validation.

---

### HIGH — `.env.example` used wrong variable names for RevenueCat keys

**File:** `.env.example`

The example file listed `REVENUECAT_IOS_KEY` and `REVENUECAT_ANDROID_KEY`, but `src/services/revenuecat.ts` reads `EXPO_PUBLIC_RC_IOS_KEY` and `EXPO_PUBLIC_RC_ANDROID_KEY`. Any developer copying `.env.example` verbatim would ship with empty API keys, and the `?? ''` fallback would silently suppress errors until first purchase.

**Fix applied:** `.env.example` updated to use the correct variable names.

---

### HIGH — Post-purchase subscription status set client-side only

**File:** `src/hooks/usePurchases.ts`

After `purchasePackage()` or `restorePurchases()`, the old code wrote `is_subscribed: true` directly into the Zustand store without re-fetching from Supabase. This means:
- If the RevenueCat webhook had not yet updated the Supabase profile, the client would show a subscribed state that doesn't match the server.
- More critically, the `useAuth.canRead` computed value (client-side gate) could be spoofed by patching Zustand state.

**Fix applied:** After purchase or restore, `syncProfileFromServer()` now re-fetches the actual profile from Supabase and updates the store. The authoritative reading gate (`canUserRead` RPC) on the reading screen remains server-enforced.

---

### MEDIUM — `displayName` silently dropped during registration

**File:** `app/auth/register.tsx` + `src/services/supabase.ts`

The register screen collected `displayName` in state but `signUpWithEmail` did not accept or forward it. Since `handle_new_user()` trigger reads `raw_user_meta_data->>'full_name'` to set the profile display name, the name was always `NULL` for email signups.

**Fix applied:** `signUpWithEmail` now accepts an optional `displayName` parameter and passes it as `data.full_name` in the sign-up options.

---

### LOW — Raw Supabase/auth error messages shown to users

**Files:** `app/auth/login.tsx`, `app/auth/register.tsx`

`e.message` from Supabase errors was displayed directly in the UI. Supabase errors can include constraint names, table names, or internal details (e.g., `"duplicate key value violates unique constraint \"profiles_pkey\""`).

**Fix applied:** All auth error handlers now show generic user-facing strings. The original exception is still thrown/caught; it is just not forwarded to the UI error state.

---

### INFORMATIONAL — `subscriptions` table has no client-side INSERT/UPDATE/DELETE policies

**File:** `supabase/migrations/001_initial_schema.sql`

This is correct by design — subscriptions should only be written by a server-side RevenueCat webhook using the Supabase service role key. A comment has been added to make this intent explicit so future developers don't accidentally add a client policy.

---

### INFORMATIONAL — `useAuth.canRead` is a client-side hint

**File:** `src/hooks/useAuth.ts`

`canRead` is computed from local store state. A comment has been added clarifying it is a UI hint only. The authoritative gate is the `canUserRead` RPC call in `app/reading/[spreadId].tsx`, which cannot be bypassed by client-side state manipulation.

---

## Issues Requiring Manual / Server-Side Action

### RevenueCat Webhook — Supabase subscription sync

The most robust architecture for subscription status is:

1. RevenueCat sends a webhook to a Supabase Edge Function on every subscription event (purchase, renewal, cancellation, expiry).
2. The Edge Function uses the Supabase **service role key** (not anon key) to update `profiles.is_subscribed` and the `subscriptions` table.
3. The client re-fetches the profile after purchase (now implemented) to reflect the server state.

The webhook endpoint does not exist yet. Until it does, `profiles.is_subscribed` can only be updated manually or via the `syncProfileFromServer` call added in this review (which re-fetches after purchase, but does not handle async delays if the webhook hasn't fired yet).

**Action required:**
- Create a Supabase Edge Function `functions/revenuecat-webhook/index.ts`
- Register the webhook URL in the RevenueCat dashboard
- Validate the RevenueCat webhook signature (`X-RevenueCat-Signature` header) before processing
- Use the service role key in the Edge Function environment (never in the client)

### Certificate Pinning

The app communicates with Supabase over HTTPS. On jailbroken/rooted devices, SSL traffic can be intercepted with a MITM proxy even without certificate pinning. For a payment-handling app, consider adding certificate pinning via `react-native-ssl-pinning` or a managed solution.

### RevenueCat API Key Exposure

`EXPO_PUBLIC_RC_IOS_KEY` and `EXPO_PUBLIC_RC_ANDROID_KEY` are bundled into the client app (that is unavoidable for RevenueCat). These are public-facing keys and RevenueCat is designed for this. Ensure the keys are scoped to the correct app in the RevenueCat dashboard and that server-to-server API calls use a separate secret key stored only in backend environments.

### Rate Limiting on Auth Endpoints

Supabase provides basic rate limiting on auth endpoints by default. Verify in the Supabase dashboard that rate limiting is enabled for sign-up and sign-in, and consider adding CAPTCHA (Supabase supports hCaptcha) for email sign-up to prevent account enumeration and spam.

### `readings.notes` Column

The `notes` column exists in the schema but is never written by any current code path (the intention text is stored in client state only and not persisted). If notes are added to the save flow in future, the DB-level constraint (`char_length(notes) <= 1000`) added in migration `004_security_hardening.sql` will enforce the limit server-side.

---

## Production Deployment Checklist

- [ ] Set all env vars in EAS Secrets (never commit a `.env` file with real values)
- [ ] Configure Supabase Auth rate limiting and optionally hCaptcha
- [ ] Implement and deploy RevenueCat webhook Edge Function with signature validation
- [ ] Rotate any keys that may have been committed to version control
- [ ] Enable Supabase database backups (Point-in-Time Recovery)
- [ ] Review Supabase Auth settings: disable email enumeration protection is OFF (it should be ON — "Confirm email" setting)
- [ ] Ensure `SUPABASE_SERVICE_ROLE_KEY` is never in any client-side code or `EXPO_PUBLIC_` variable
- [ ] Test RLS policies with a second test user to confirm cross-user data access is blocked
- [ ] Consider certificate pinning for the Supabase API host
