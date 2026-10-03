import { cardNamesRu } from '../data/translations/cards_ru';
import { cardNamesPl } from '../data/translations/cards_pl';
import { cardNamesUk } from '../data/translations/cards_uk';
import type { TarotCard } from '../types/cards';

const translationMap: Record<string, Record<number, string>> = {
  ru: cardNamesRu,
  pl: cardNamesPl,
  uk: cardNamesUk,
};

export function getCardName(card: TarotCard, language: string): string {
  const map = translationMap[language];
  if (!map) return card.name;
  return map[card.id] ?? card.name;
}
