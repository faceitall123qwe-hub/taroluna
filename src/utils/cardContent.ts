import type { TarotCard, CardMeaning } from '../types/cards';

type CardTranslation = {
  upright: CardMeaning;
  reversed: CardMeaning;
};

const cache: Partial<Record<string, Record<number, CardTranslation>>> = {};

function getMap(language: string): Record<number, CardTranslation> | null {
  if (language in cache) return cache[language] ?? null;
  try {
    if (language === 'ru') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      cache.ru = require('../data/translations/cards_content_ru').cardContentRu;
    } else if (language === 'uk') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      cache.uk = require('../data/translations/cards_content_uk').cardContentUk;
    } else if (language === 'pl') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      cache.pl = require('../data/translations/cards_content_pl').cardContentPl;
    } else {
      cache[language] = undefined;
    }
  } catch {
    cache[language] = undefined;
  }
  return cache[language] ?? null;
}

export function getCardMeaning(
  card: TarotCard,
  language: string,
  side: 'upright' | 'reversed',
): CardMeaning {
  const translation = getMap(language)?.[card.id]?.[side];
  return translation ?? card[side];
}
