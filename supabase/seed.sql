-- Test users must exist in auth.users first.
-- In local Supabase dev, create via: supabase auth admin create-user
-- UUIDs below are fixed for reproducibility.

INSERT INTO profiles (id, display_name, language, readings_count)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Test User One', 'en', 2),
  ('00000000-0000-0000-0000-000000000002', 'Test User Two', 'ru', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO readings (id, user_id, spread_type, notes)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'card_of_the_day',
    'Morning reading'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'three_card',
    NULL
  );

INSERT INTO reading_cards (reading_id, position, card_id, is_reversed)
VALUES
  ('10000000-0000-0000-0000-000000000001', 0, 0, FALSE),
  ('10000000-0000-0000-0000-000000000002', 0, 14, FALSE),
  ('10000000-0000-0000-0000-000000000002', 1, 2, TRUE),
  ('10000000-0000-0000-0000-000000000002', 2, 21, FALSE);
