import { useCallback, useEffect, useState } from 'react';
import { getUserReadings } from '../services/supabase';
import { useStore } from '../store/useStore';
import type { Reading, ReadingCard } from '../types/database';

export interface ReadingWithCards extends Reading {
  reading_cards: ReadingCard[];
}

export function useReadings() {
  const user = useStore((s) => s.user);
  const [readings, setReadings] = useState<ReadingWithCards[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getUserReadings(user.id);
      setReadings((data ?? []) as ReadingWithCards[]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { readings, isLoading, refetch };
}
