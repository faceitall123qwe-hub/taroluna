export interface TarotCard {
  id: number;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number: number;
  element?: string;
  planet?: string;
  zodiac?: string;
  imageFile: string;
  upright: CardMeaning;
  reversed: CardMeaning;
}

export interface CardMeaning {
  keywords: string[];
  meaning: string;
  love: string;
  career: string;
  health: string;
}

export interface SpreadPosition {
  index: number;
  name: string;
  description: string;
}

export interface Spread {
  id: 'card_of_the_day' | 'three_card' | 'mind_body_spirit' | 'celtic_cross' | 'yes_no' | 'shadow_self' | 'career_path' | 'relationship_dynamics' | 'monthly_forecast';
  name: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
  isFree: boolean;
  isPremium: boolean;
}

export interface ReadingResult {
  id: string;
  spreadId: Spread['id'];
  cards: Array<{
    position: SpreadPosition;
    card: TarotCard;
    isReversed: boolean;
  }>;
  createdAt: Date;
  notes?: string;
}
