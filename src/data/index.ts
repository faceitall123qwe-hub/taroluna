import { majorArcana } from './cards_major';
import { wandsCards, cupsCards } from './cards_wands_cups';
import { swordsCards, pentaclesCards } from './cards_swords_pentacles';
import { spreads } from './spreads';
import { TarotCard } from '../types/cards';

export const allCards: TarotCard[] = [
  ...majorArcana,
  ...wandsCards,
  ...cupsCards,
  ...swordsCards,
  ...pentaclesCards,
];

export { spreads };

export function getCardById(id: number): TarotCard {
  const card = allCards.find((c) => c.id === id);
  if (!card) throw new Error(`Card with id ${id} not found`);
  return card;
}

export function getRandomCards(count: number, exclude: number[] = []): TarotCard[] {
  const pool = allCards.filter((c) => !exclude.includes(c.id));
  if (count > pool.length) throw new Error(`Cannot draw ${count} cards from pool of ${pool.length}`);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
