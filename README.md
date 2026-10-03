# TaroLuna — tarot reading app (iOS / Android)

Cross-platform tarot app built with Expo: the full 78-card deck, nine spreads, reading
history, card of the day with push reminders, four languages and a freemium model
(3 free readings, then reading packs or a subscription).

## Stack

React Native 0.74 + Expo SDK 51 · TypeScript (strict) · Expo Router · Zustand ·
i18next · Supabase (Postgres, Auth, RLS) · RevenueCat · Expo Notifications ·
GitHub Actions (typecheck + lint) · EAS Build

## Features

- **78 cards** with upright/reversed meanings; UI in EN / PL / RU / UK, card names in all
  four, full card texts in EN / RU / UK
- **9 spreads**: card of the day, past–present–future, mind–body–spirit, Celtic Cross,
  yes/no, shadow self, career path, relationship dynamics, monthly forecast
- Animated card flip, star background, card browser with detail pages
- Auth: e-mail/password, Apple Sign-In (with nonce), password reset
- Reading history stored per user in Supabase
- Paywall: reading packs and monthly/annual subscription via RevenueCat; localised
  mock offerings (EUR / PLN / USD) when no store keys are configured, so the full flow
  works in development

## Backend and security

All quota logic is server-side in Postgres (`supabase/migrations`):

- `get_user_can_read` / `create_reading_with_cards` are `SECURITY DEFINER` functions that
  check `p_user_id = auth.uid()` before touching data, so a client can't read or spend
  another user's quota
- RLS on every table; the `subscriptions` table has no client write policies (only a
  server-side webhook may change entitlement)
- DB-level length constraints mirror client `maxLength`
- Raw auth errors are mapped to user-safe messages

The audit that led to these fixes, plus the remaining production checklist (RevenueCat
webhook sync, auth rate limits), is in [SECURITY_REVIEW.md](SECURITY_REVIEW.md).

## Run

```bash
npm install
cp .env.example .env            # Supabase URL + anon key; RevenueCat keys optional
bash scripts/download-card-images.sh
npx expo start
```

Apply `supabase/migrations/*.sql` in order to a Supabase project, then `supabase/seed.sql`.

Card images: [metabismuth/tarot-json](https://github.com/metabismuth/tarot-json) (MIT).
