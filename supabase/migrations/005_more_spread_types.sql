-- Spreads added in the app after 001 must exist in the enum, otherwise
-- create_reading_with_cards fails on the ::spread_type cast.
ALTER TYPE spread_type ADD VALUE IF NOT EXISTS 'yes_no';
ALTER TYPE spread_type ADD VALUE IF NOT EXISTS 'shadow_self';
ALTER TYPE spread_type ADD VALUE IF NOT EXISTS 'career_path';
ALTER TYPE spread_type ADD VALUE IF NOT EXISTS 'relationship_dynamics';
ALTER TYPE spread_type ADD VALUE IF NOT EXISTS 'monthly_forecast';
