-- Clients could previously PATCH their own profile row freely, which let anyone with the
-- public anon key set is_subscribed = true or reset readings_count. Billing fields are now
-- written only by apply_revenuecat_event(), called from the revenuecat-webhook function.
REVOKE INSERT, UPDATE ON profiles FROM anon, authenticated;
GRANT UPDATE (display_name, language, push_token, notifications_enabled) ON profiles TO authenticated;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;  -- rows come from handle_new_user()

-- Consumable reading packs (Starter 8 / Popular 25 / Value 60) add to this balance.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS paid_readings INT NOT NULL DEFAULT 0;

ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS product_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_user_id_key ON subscriptions(user_id);

CREATE TABLE IF NOT EXISTS billing_events (
  id TEXT PRIMARY KEY,
  user_id UUID,
  type TEXT NOT NULL,
  product_id TEXT,
  payload JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;  -- no policies: service role only

CREATE OR REPLACE FUNCTION apply_revenuecat_event(p_event JSONB)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_type TEXT := p_event->>'type';
  v_product TEXT := p_event->>'product_id';
  v_user UUID;
  v_pack INT;
  v_expires TIMESTAMPTZ;
BEGIN
  BEGIN
    v_user := (p_event->>'app_user_id')::UUID;
  EXCEPTION WHEN invalid_text_representation THEN
    RETURN 'skipped: anonymous user';
  END;

  INSERT INTO billing_events (id, user_id, type, product_id, payload)
  VALUES (p_event->>'id', v_user, v_type, v_product, p_event)
  ON CONFLICT (id) DO NOTHING;
  IF NOT FOUND THEN
    RETURN 'duplicate';
  END IF;

  v_pack := CASE v_product
    WHEN 'taroluna_starter_8' THEN 8
    WHEN 'taroluna_popular_25' THEN 25
    WHEN 'taroluna_value_60' THEN 60
  END;

  IF v_pack IS NOT NULL THEN
    IF v_type IN ('NON_RENEWING_PURCHASE', 'INITIAL_PURCHASE') THEN
      UPDATE profiles SET paid_readings = paid_readings + v_pack WHERE id = v_user;
    END IF;
    RETURN 'pack';
  END IF;

  IF (p_event->>'expiration_at_ms') IS NOT NULL THEN
    v_expires := to_timestamp((p_event->>'expiration_at_ms')::BIGINT / 1000.0);
  END IF;

  IF v_type IN ('INITIAL_PURCHASE', 'RENEWAL', 'UNCANCELLATION', 'PRODUCT_CHANGE', 'SUBSCRIPTION_EXTENDED') THEN
    INSERT INTO subscriptions (user_id, is_active, expires_at, product_id)
    VALUES (v_user, TRUE, v_expires, v_product)
    ON CONFLICT (user_id) DO UPDATE
      SET is_active = TRUE, expires_at = EXCLUDED.expires_at, product_id = EXCLUDED.product_id;
    UPDATE profiles SET is_subscribed = TRUE WHERE id = v_user;
  ELSIF v_type = 'EXPIRATION' THEN
    UPDATE subscriptions SET is_active = FALSE WHERE user_id = v_user;
    UPDATE profiles SET is_subscribed = FALSE WHERE id = v_user;
  END IF;
  -- CANCELLATION only turns off auto-renew; access lasts until EXPIRATION.
  RETURN v_type;
END;
$$;

REVOKE ALL ON FUNCTION apply_revenuecat_event(JSONB) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION apply_revenuecat_event(JSONB) TO service_role;

CREATE OR REPLACE FUNCTION get_user_can_read(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile profiles%ROWTYPE;
BEGIN
  IF p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  SELECT * INTO v_profile FROM profiles WHERE id = p_user_id;

  IF v_profile.is_subscribed OR EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = p_user_id AND is_active AND (expires_at IS NULL OR expires_at > NOW())
  ) THEN
    RETURN TRUE;
  END IF;

  RETURN v_profile.readings_count < 3 + v_profile.paid_readings;
END;
$$;
