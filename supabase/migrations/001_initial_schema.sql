-- uuid-ossp not needed; using gen_random_uuid() from pgcrypto (built-in on Supabase)

CREATE TYPE spread_type AS ENUM (
  'card_of_the_day',
  'three_card',
  'celtic_cross',
  'mind_body_spirit'
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  readings_count INT NOT NULL DEFAULT 0,
  is_subscribed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  spread_type spread_type NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reading_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id UUID NOT NULL REFERENCES readings(id) ON DELETE CASCADE,
  position INT NOT NULL,
  card_id INT NOT NULL,
  is_reversed BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_readings_user_id ON readings(user_id);
CREATE INDEX idx_readings_created_at ON readings(created_at DESC);
CREATE INDEX idx_reading_cards_reading_id ON reading_cards(reading_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "readings_select_own" ON readings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "readings_insert_own" ON readings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "readings_delete_own" ON readings
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "reading_cards_select_own" ON reading_cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM readings
      WHERE readings.id = reading_cards.reading_id
      AND readings.user_id = auth.uid()
    )
  );

CREATE POLICY "reading_cards_insert_own" ON reading_cards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM readings
      WHERE readings.id = reading_cards.reading_id
      AND readings.user_id = auth.uid()
    )
  );

CREATE POLICY "subscriptions_select_own" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Subscriptions are written exclusively by server-side webhooks via the service role.
-- No client INSERT/UPDATE/DELETE policies are defined intentionally.

CREATE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
