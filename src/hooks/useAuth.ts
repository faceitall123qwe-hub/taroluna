import { useState, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { signOut as supabaseSignOut, canUserRead } from '../services/supabase';

export function useAuth() {
  const user = useStore((s) => s.user);
  const profile = useStore((s) => s.profile);
  const reset = useStore((s) => s.reset);
  const [isLoading, setIsLoading] = useState(false);

  // canRead is a client-side hint only (used for UI state like showing the paywall button).
  // The authoritative gate is the canUserRead() RPC called server-side in the reading screen.
  const canRead = user != null
    ? (profile?.is_subscribed ?? false) || (profile?.readings_count ?? 0) < 3 + (profile?.paid_readings ?? 0)
    : false;

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await supabaseSignOut();
      reset();
    } finally {
      setIsLoading(false);
    }
  }, [reset]);

  return { user, profile, isLoading, signOut, canRead };
}
