import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../types/database';

interface AppState {
  user: User | null;
  profile: Profile | null;
  readingsCount: number;
  isSubscribed: boolean;
  language: string;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLanguage: (lang: string) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  profile: null,
  readingsCount: 0,
  isSubscribed: false,
  language: 'en',
};

export const useStore = create<AppState>((set) => ({
  ...initialState,

  setUser: (user) => set({ user }),

  setProfile: (profile) =>
    set({
      profile,
      readingsCount: profile?.readings_count ?? 0,
      isSubscribed: profile?.is_subscribed ?? false,
      language: profile?.language ?? 'en',
    }),

  setLanguage: (language) => set({ language }),

  reset: () => set(initialState),
}));
