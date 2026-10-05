export type SpreadType =
  | 'card_of_the_day'
  | 'three_card'
  | 'celtic_cross'
  | 'mind_body_spirit'
  | 'yes_no'
  | 'shadow_self'
  | 'career_path'
  | 'relationship_dynamics'
  | 'monthly_forecast';

export interface Profile {
  id: string;
  display_name: string | null;
  language: string;
  readings_count: number;
  paid_readings: number;
  is_subscribed: boolean;
  push_token: string | null;
  notifications_enabled: boolean;
  created_at: string;
}

export interface ProfileInsert {
  id: string;
  display_name?: string | null;
  language?: string;
  readings_count?: number;
  is_subscribed?: boolean;
  push_token?: string | null;
  notifications_enabled?: boolean;
  created_at?: string;
}

export interface ProfileUpdate {
  display_name?: string | null;
  language?: string;
  is_subscribed?: boolean;
  push_token?: string | null;
  notifications_enabled?: boolean;
}

export interface Reading {
  id: string;
  user_id: string;
  spread_type: SpreadType;
  notes: string | null;
  created_at: string;
}

export interface ReadingInsert {
  id?: string;
  user_id: string;
  spread_type: SpreadType;
  notes?: string | null;
  created_at?: string;
}

export interface ReadingUpdate {
  notes?: string | null;
}

export interface ReadingCard {
  id: string;
  reading_id: string;
  position: number;
  card_id: number;
  is_reversed: boolean;
}

export interface ReadingCardInsert {
  id?: string;
  reading_id: string;
  position: number;
  card_id: number;
  is_reversed?: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      readings: {
        Row: Reading;
        Insert: ReadingInsert;
        Update: ReadingUpdate;
      };
      reading_cards: {
        Row: ReadingCard;
        Insert: ReadingCardInsert;
        Update: never;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, 'id' | 'created_at'>;
        Update: Pick<Subscription, 'is_active' | 'expires_at'>;
      };
    };
    Functions: {
      get_user_can_read: {
        Args: { p_user_id: string };
        Returns: boolean;
      };
      create_reading_with_cards: {
        Args: {
          p_user_id: string;
          p_spread_type: SpreadType;
          p_card_positions: CardPositionInput[];
        };
        Returns: string;
      };
    };
  };
}

export interface CardPositionInput {
  position: number;
  card_id: number;
  is_reversed?: boolean;
}
