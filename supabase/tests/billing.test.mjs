// Runs every migration on an in-process Postgres (PGlite) with a stub of Supabase's auth schema,
// then checks billing and account deletion. npm run test:db
import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import { fileURLToPath } from 'url';
const dir = fileURLToPath(new URL('../migrations/', import.meta.url));
const db = new PGlite();
const ok = (c, m) => { if (!c) { console.log('FAIL', m); process.exitCode = 1; } else console.log('ok  ', m); };
await db.exec(`
  CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
  CREATE SCHEMA auth;
  CREATE TABLE auth.users (id UUID PRIMARY KEY, raw_user_meta_data JSONB DEFAULT '{}');
  CREATE FUNCTION auth.uid() RETURNS UUID LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.uid', true), '')::uuid $$;
  GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
  GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;
`);
for (const f of fs.readdirSync(dir).sort()) { await db.exec(fs.readFileSync(dir + f, 'utf8')); console.log('applied', f); }
await db.exec(`GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;`);
const U = '11111111-1111-1111-1111-111111111111';
await db.exec(`INSERT INTO auth.users (id) VALUES ('${U}')`);
const as = async (role, sql, params) => {
  await db.exec(`SET request.uid = '${U}'; SET ROLE ${role};`);
  try { return await db.query(sql, params); } finally { await db.exec('RESET ROLE'); }
};
const prof = async () => (await db.query(`SELECT * FROM profiles WHERE id='${U}'`)).rows[0];

// attack: user grants themselves premium / resets counter
let err = null; try { await as('authenticated', `UPDATE profiles SET is_subscribed = true WHERE id = '${U}'`); } catch (e) { err = e.message; }
ok(err && /permission denied/.test(err), 'user cannot set is_subscribed: ' + err);
err = null; try { await as('authenticated', `UPDATE profiles SET paid_readings = 999 WHERE id = '${U}'`); } catch (e) { err = e.message; }
ok(err, 'user cannot set paid_readings');
err = null; try { await as('authenticated', `UPDATE profiles SET readings_count = 0 WHERE id = '${U}'`); } catch (e) { err = e.message; }
ok(err, 'user cannot reset readings_count');
await as('authenticated', `UPDATE profiles SET language = 'pl', notifications_enabled = false, push_token = 'x' WHERE id = '${U}'`);
ok((await prof()).language === 'pl', 'user can still change language / push settings');
err = null; try { await as('authenticated', `SELECT apply_revenuecat_event('{}'::jsonb)`); } catch (e) { err = e.message; }
ok(err, 'user cannot call apply_revenuecat_event');

// free tier
for (let i = 0; i < 3; i++) await as('authenticated', `SELECT create_reading_with_cards($1, 'three_card', '[{"position":0,"card_id":1}]'::jsonb)`, [U]);
ok((await as('authenticated', `SELECT get_user_can_read($1) v`, [U])).rows[0].v === false, 'after 3 free readings cannot read');

// pack purchase via webhook (service role), plus duplicate delivery
const ev = (id, type, product, extra = {}) => JSON.stringify({ id, type, product_id: product, app_user_id: U, ...extra });
let r = await as('service_role', `SELECT apply_revenuecat_event($1::jsonb) r`, [ev('e1', 'NON_RENEWING_PURCHASE', 'taroluna_starter_8')]);
ok(r.rows[0].r === 'pack', 'pack event applied');
r = await as('service_role', `SELECT apply_revenuecat_event($1::jsonb) r`, [ev('e1', 'NON_RENEWING_PURCHASE', 'taroluna_starter_8')]);
ok(r.rows[0].r === 'duplicate' && (await prof()).paid_readings === 8, 'duplicate webhook does not double-credit (paid=8)');
ok((await as('authenticated', `SELECT get_user_can_read($1) v`, [U])).rows[0].v === true, 'can read after buying pack');

// subscription lifecycle
await as('service_role', `SELECT apply_revenuecat_event($1::jsonb)`, [ev('e2', 'INITIAL_PURCHASE', 'taroluna_monthly', { expiration_at_ms: Date.now() + 864e5 * 30 })]);
ok((await prof()).is_subscribed === true, 'subscription activates');
await as('service_role', `SELECT apply_revenuecat_event($1::jsonb)`, [ev('e3', 'CANCELLATION', 'taroluna_monthly')]);
ok((await prof()).is_subscribed === true, 'cancellation keeps access until expiry');
await as('service_role', `SELECT apply_revenuecat_event($1::jsonb)`, [ev('e4', 'EXPIRATION', 'taroluna_monthly')]);
ok((await prof()).is_subscribed === false, 'expiration removes access');
r = await as('service_role', `SELECT apply_revenuecat_event($1::jsonb) r`, [JSON.stringify({ id: 'e5', type: 'INITIAL_PURCHASE', app_user_id: '$RCAnonymousID:abc' })]);
ok(r.rows[0].r === 'skipped: anonymous user', 'anonymous RevenueCat id is skipped');

// account deletion cascades
await as('authenticated', `SELECT delete_own_account()`);
ok((await db.query(`SELECT count(*)::int c FROM profiles`)).rows[0].c === 0 && (await db.query(`SELECT count(*)::int c FROM readings`)).rows[0].c === 0, 'delete_own_account removes user, profile and readings');
