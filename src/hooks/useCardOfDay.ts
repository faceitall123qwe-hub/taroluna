import { useMemo } from 'react';
import { allCards } from '../data';
import { useStore } from '../store/useStore';
import type { TarotCard } from '../types/cards';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function useCardOfDay(): { card: TarotCard; isReversed: boolean } {
  const userId = useStore((s) => s.user?.id ?? '');
  return useMemo(() => {
    const seed = new Date().toDateString() + userId;
    const hash = hashString(seed);
    const card = allCards[hash % allCards.length];
    const isReversed = (hash % 7) < 3;
    return { card, isReversed };
  }, [userId]);
}
