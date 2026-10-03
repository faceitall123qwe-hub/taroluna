-- increment_reading_count is internal-only; callers must pass auth.uid()
CREATE OR REPLACE FUNCTION increment_reading_count(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  UPDATE profiles
  SET readings_count = readings_count + 1
  WHERE id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_can_read(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_readings_count INT;
  v_is_subscribed BOOLEAN;
  v_has_active_sub BOOLEAN;
BEGIN
  -- Enforce caller can only query their own record
  IF p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  SELECT readings_count, is_subscribed
  INTO v_readings_count, v_is_subscribed
  FROM profiles
  WHERE id = p_user_id;

  IF v_is_subscribed THEN
    RETURN TRUE;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = p_user_id
      AND is_active = TRUE
      AND (expires_at IS NULL OR expires_at > NOW())
  ) INTO v_has_active_sub;

  IF v_has_active_sub THEN
    RETURN TRUE;
  END IF;

  RETURN v_readings_count < 3;
END;
$$;

CREATE OR REPLACE FUNCTION create_reading_with_cards(
  p_user_id UUID,
  p_spread_type TEXT,
  p_card_positions JSONB,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reading_id UUID;
  v_card JSONB;
BEGIN
  -- Prevent one user from creating readings under another user's account
  IF p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  INSERT INTO readings (user_id, spread_type, notes)
  VALUES (p_user_id, p_spread_type::spread_type, p_notes)
  RETURNING id INTO v_reading_id;

  FOR v_card IN SELECT * FROM jsonb_array_elements(p_card_positions)
  LOOP
    INSERT INTO reading_cards (reading_id, position, card_id, is_reversed)
    VALUES (
      v_reading_id,
      (v_card->>'position')::INT,
      (v_card->>'card_id')::INT,
      COALESCE((v_card->>'is_reversed')::BOOLEAN, FALSE)
    );
  END LOOP;

  PERFORM increment_reading_count(p_user_id);

  RETURN v_reading_id;
END;
$$;
