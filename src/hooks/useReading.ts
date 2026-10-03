import { useState, useCallback, useMemo } from 'react';
import { getRandomCards } from '../data';
import { spreads } from '../data/spreads';
import { createReading, getUserProfile } from '../services/supabase';
import { useStore } from '../store/useStore';
import type { TarotCard, Spread, SpreadPosition } from '../types/cards';
import type { CardPositionInput } from '../types/database';

export type ReadingStep = 'intention' | 'selection' | 'result';

export interface DrawnCard {
  position: SpreadPosition;
  card: TarotCard;
  isReversed: boolean;
}

interface ReadingState {
  step: ReadingStep;
  spread: Spread;
  drawnCards: DrawnCard[];
  revealedCount: number;
  intention: string;
  isSaving: boolean;
  savedReadingId: string | null;
  error: string | null;
}

export function useReading(spreadId: string) {
  const setProfile = useStore((s) => s.setProfile);

  const spread = useMemo(() => {
    const found = spreads.find((s) => s.id === spreadId);
    if (!found) throw new Error(`Unknown spread: ${spreadId}`);
    return found;
  }, [spreadId]);

  const [drawnCards] = useState<DrawnCard[]>(() => {
    const cards = getRandomCards(spread.cardCount);
    return spread.positions.map((position, i) => ({
      position,
      card: cards[i],
      isReversed: Math.random() < 0.3,
    }));
  });

  const [step, setStep] = useState<ReadingStep>('intention');
  const [revealedCount, setRevealedCount] = useState(0);
  const [intention, setIntention] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedReadingId, setSavedReadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startReading = useCallback(() => {
    setStep('selection');
    setRevealedCount(0);
  }, []);

  const revealCard = useCallback(
    (index: number) => {
      if (index !== revealedCount) return;
      setRevealedCount((c) => c + 1);
    },
    [revealedCount],
  );

  const showResult = useCallback(() => {
    setStep('result');
  }, []);

  const saveReading = useCallback(
    async (userId: string) => {
      if (isSaving || savedReadingId) return;
      setIsSaving(true);
      setError(null);
      try {
        const cardPositions: CardPositionInput[] = drawnCards.map((dc) => ({
          position: dc.position.index,
          card_id: dc.card.id,
          is_reversed: dc.isReversed,
        }));
        const id = await createReading(userId, spread.id, cardPositions, intention);
        setSavedReadingId(id);
        const updated = await getUserProfile(userId);
        setProfile(updated);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to save');
      } finally {
        setIsSaving(false);
      }
    },
    [drawnCards, spread.id, isSaving, savedReadingId, intention, setProfile],
  );

  const state: ReadingState = {
    step,
    spread,
    drawnCards,
    revealedCount,
    intention,
    isSaving,
    savedReadingId,
    error,
  };

  return {
    ...state,
    setIntention,
    startReading,
    revealCard,
    showResult,
    saveReading,
    allRevealed: revealedCount === spread.cardCount,
  };
}
