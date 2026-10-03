import { Spread } from '../types/cards';

export const spreads: Spread[] = [
  {
    id: 'card_of_the_day',
    name: 'Card of the Day',
    description: 'A single card drawn to provide guidance and insight for the day ahead.',
    cardCount: 1,
    isFree: true,
    isPremium: false,
    positions: [
      {
        index: 0,
        name: 'Card of the Day',
        description: 'The energy, theme, or lesson that will guide you through today.',
      },
    ],
  },
  {
    id: 'three_card',
    name: 'Past / Present / Future',
    description: 'A classic three-card spread revealing the trajectory of a situation across time.',
    cardCount: 3,
    isFree: false,
    isPremium: false,
    positions: [
      {
        index: 0,
        name: 'Past',
        description: 'Events, influences, or energies from the past that have shaped the current situation.',
      },
      {
        index: 1,
        name: 'Present',
        description: 'The current state of affairs — what is happening right now and the dominant energy.',
      },
      {
        index: 2,
        name: 'Future',
        description: 'The likely outcome or direction if the current path continues.',
      },
    ],
  },
  {
    id: 'mind_body_spirit',
    name: 'Mind / Body / Spirit',
    description: 'Explores the balance and alignment across three core aspects of your being.',
    cardCount: 3,
    isFree: false,
    isPremium: false,
    positions: [
      {
        index: 0,
        name: 'Mind',
        description: 'Your thoughts, beliefs, mental patterns, and intellectual influences at play.',
      },
      {
        index: 1,
        name: 'Body',
        description: 'Your physical state, material circumstances, and grounded reality.',
      },
      {
        index: 2,
        name: 'Spirit',
        description: 'Your soul\'s guidance, higher purpose, and spiritual energy surrounding you.',
      },
    ],
  },
  {
    id: 'celtic_cross',
    name: 'Celtic Cross',
    description: 'The most comprehensive tarot spread, offering a deep and nuanced look at any situation from multiple angles.',
    cardCount: 10,
    isFree: false,
    isPremium: true,
    positions: [
      {
        index: 0,
        name: 'The Present',
        description: 'The heart of the matter — the central issue or energy surrounding the querent right now.',
      },
      {
        index: 1,
        name: 'The Challenge',
        description: 'What crosses or challenges the querent; the immediate obstacle or opposing force.',
      },
      {
        index: 2,
        name: 'The Foundation',
        description: 'The root cause or underlying basis of the situation; past events that created the present.',
      },
      {
        index: 3,
        name: 'The Recent Past',
        description: 'Events or influences that are just passing out of the querent\'s life.',
      },
      {
        index: 4,
        name: 'The Crown',
        description: 'The best possible outcome or the querent\'s conscious goal; what could be achieved.',
      },
      {
        index: 5,
        name: 'The Near Future',
        description: 'Events or influences that are coming into the querent\'s life in the near term.',
      },
      {
        index: 6,
        name: 'The Self',
        description: 'How the querent sees themselves or their attitude toward the situation.',
      },
      {
        index: 7,
        name: 'External Influences',
        description: 'How others see the querent, or outside forces and environmental factors at play.',
      },
      {
        index: 8,
        name: 'Hopes and Fears',
        description: 'The querent\'s inner hopes or fears; what they most desire or dread about the outcome.',
      },
      {
        index: 9,
        name: 'The Outcome',
        description: 'The final result — the most likely outcome if the current path continues unchanged.',
      },
    ],
  },
  {
    id: 'yes_no',
    name: 'Yes or No',
    description: 'A single card answers your most pressing question directly. Upright cards lean yes; reversed lean no.',
    cardCount: 1,
    isFree: false,
    isPremium: false,
    positions: [
      {
        index: 0,
        name: 'The Answer',
        description: 'The card that reveals the answer to your question. Upright favours yes; reversed favours no.',
      },
    ],
  },
  {
    id: 'shadow_self',
    name: 'Shadow Self',
    description: 'Illuminate hidden aspects of yourself — what you conceal, why, and how to integrate it.',
    cardCount: 3,
    isFree: false,
    isPremium: false,
    positions: [
      {
        index: 0,
        name: 'What You Hide',
        description: 'The part of yourself you suppress or refuse to acknowledge.',
      },
      {
        index: 1,
        name: 'Why You Hide It',
        description: 'The root fear or belief that drives you to conceal this aspect of yourself.',
      },
      {
        index: 2,
        name: 'Integration',
        description: 'How to acknowledge and integrate your shadow for greater wholeness.',
      },
    ],
  },
  {
    id: 'career_path',
    name: 'Career Path',
    description: 'A focused four-card spread examining your professional situation from every angle.',
    cardCount: 4,
    isFree: false,
    isPremium: false,
    positions: [
      {
        index: 0,
        name: 'Situation',
        description: 'Your current professional position and the dominant energy at work.',
      },
      {
        index: 1,
        name: 'Obstacle',
        description: 'The challenge or block standing between you and your goals.',
      },
      {
        index: 2,
        name: 'Opportunity',
        description: 'A hidden opportunity or strength you can leverage right now.',
      },
      {
        index: 3,
        name: 'Outcome',
        description: 'Where this path leads if you act on the guidance given.',
      },
    ],
  },
  {
    id: 'relationship_dynamics',
    name: 'Relationship Dynamics',
    description: 'A five-card spread that reveals the energy of a relationship from both perspectives.',
    cardCount: 5,
    isFree: false,
    isPremium: true,
    positions: [
      {
        index: 0,
        name: 'You',
        description: 'How you are showing up in this relationship right now.',
      },
      {
        index: 1,
        name: 'Them',
        description: 'How the other person is showing up or what drives their behaviour.',
      },
      {
        index: 2,
        name: 'The Dynamic',
        description: 'The core energy or pattern that defines this relationship.',
      },
      {
        index: 3,
        name: 'The Challenge',
        description: 'What is creating tension or needs to be addressed between you.',
      },
      {
        index: 4,
        name: 'The Path Forward',
        description: 'What this relationship needs to grow or find resolution.',
      },
    ],
  },
  {
    id: 'monthly_forecast',
    name: 'Monthly Forecast',
    description: 'Four cards, one for each week of the month, to guide your path ahead.',
    cardCount: 4,
    isFree: false,
    isPremium: false,
    positions: [
      {
        index: 0,
        name: 'Week 1',
        description: 'The energy and themes that open the month.',
      },
      {
        index: 1,
        name: 'Week 2',
        description: 'What develops and shifts in the middle of the month.',
      },
      {
        index: 2,
        name: 'Week 3',
        description: 'A turning point or challenge in the third week.',
      },
      {
        index: 3,
        name: 'Week 4',
        description: 'How the month closes and what to carry forward.',
      },
    ],
  },
];
