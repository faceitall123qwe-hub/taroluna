import type { TarotCard } from '../types/cards';

export const majorArcana: TarotCard[] = [
  {
    id: 1,
    name: 'The Fool',
    arcana: 'major',
    number: 0,
    element: 'Air',
    planet: 'Uranus',
    imageFile: 'major-00-fool.jpg',
    upright: {
      keywords: ['beginnings', 'innocence', 'spontaneity', 'free spirit'],
      meaning:
        'The Fool marks the start of a new journey undertaken with open-hearted trust in the universe. He leaps forward without fear, carrying nothing but enthusiasm and potential. This card invites you to embrace the unknown and take that first courageous step.',
      love: 'A new romance or a fresh start in an existing relationship is on the horizon — approach it with openness rather than past expectations.',
      career: 'A bold leap into a new venture, role, or project is favored; trust your instincts even without a detailed plan.',
      health: 'Your energy is high and your body is ready for new physical challenges; embrace movement and vitality.',
    },
    reversed: {
      keywords: ['recklessness', 'naivety', 'foolishness', 'risk'],
      meaning:
        'Reversed, the Fool\'s adventurous spirit tips into recklessness or paralysis from fear of the unknown. Opportunities are being missed through hesitation, or impulsive decisions are creating unnecessary chaos. Ground yourself before moving forward.',
      love: 'Rushing into a relationship without discernment, or refusing to commit out of fear of vulnerability, is causing setbacks.',
      career: 'Impulsive choices at work — such as quitting without a plan — or refusal to take any risks at all are both holding you back.',
      health: 'Careless habits or ignoring warning signs may be jeopardizing your wellbeing; take preventive action now.',
    },
  },
  {
    id: 2,
    name: 'The Magician',
    arcana: 'major',
    number: 1,
    element: 'Air',
    planet: 'Mercury',
    imageFile: 'major-01-magician.jpg',
    upright: {
      keywords: ['willpower', 'manifestation', 'skill', 'resourcefulness'],
      meaning:
        'The Magician stands at the altar of creation, wielding all four elemental tools with mastery. He represents the power to translate intention into reality through focused will and the skillful use of available resources. You have everything you need to succeed — the question is whether you will act.',
      love: 'You have the charm and clarity to attract or deepen a meaningful connection; express your desires with confidence.',
      career: 'Your skills and resources are perfectly aligned for a new project; this is the moment to take initiative and lead.',
      health: 'Mind over matter is your strength now; channel your mental clarity into disciplined health practices.',
    },
    reversed: {
      keywords: ['manipulation', 'poor planning', 'untapped potential', 'trickery'],
      meaning:
        'Reversed, the Magician\'s power is misdirected — talents are going to waste, or worse, being used to deceive. You may feel blocked, doubting your own abilities, or encountering someone who is not what they seem. Reconnect with your authentic intentions.',
      love: 'Beware of manipulation within a relationship, either from a partner or from your own tendency to play games.',
      career: 'Talented but scattered, you are failing to convert potential into results; focus and honest effort are needed.',
      health: 'Ignoring symptoms or deceiving yourself about lifestyle choices will worsen matters; face reality and seek proper care.',
    },
  },
  {
    id: 3,
    name: 'The High Priestess',
    arcana: 'major',
    number: 2,
    element: 'Water',
    planet: 'Moon',
    imageFile: 'major-02-high-priestess.jpg',
    upright: {
      keywords: ['intuition', 'mystery', 'inner knowledge', 'patience'],
      meaning:
        'The High Priestess sits between two pillars, guardian of hidden wisdom and the subconscious mind. She counsels stillness over action and inner knowing over rational analysis. The answers you seek are already within you — quiet the noise and listen.',
      love: 'Trust your gut feelings about a partner or a developing romance; not everything needs to be spoken aloud to be understood.',
      career: 'Gather information quietly before making a move; there are undercurrents at play in your workplace that are not yet visible.',
      health: 'Pay attention to subtle signals from your body; intuitive or alternative approaches to wellness may serve you well now.',
    },
    reversed: {
      keywords: ['repression', 'hidden agendas', 'confusion', 'disconnection'],
      meaning:
        'Reversed, the High Priestess signals a disconnect from intuition, often caused by overreliance on logic or emotional repression. Secrets may surface in uncomfortable ways. You may be ignoring your inner voice or allowing external noise to drown it out.',
      love: 'Hidden feelings or unspoken truths are creating distance in a relationship; honest communication is necessary.',
      career: 'Confusion and a lack of information are making it difficult to move forward; seek clarity before committing.',
      health: 'Suppressed stress or ignored emotional pain is beginning to manifest physically; address the root cause.',
    },
  },
  {
    id: 4,
    name: 'The Empress',
    arcana: 'major',
    number: 3,
    element: 'Earth',
    planet: 'Venus',
    imageFile: 'major-03-empress.jpg',
    upright: {
      keywords: ['fertility', 'abundance', 'nurturing', 'sensuality'],
      meaning:
        'The Empress is the great mother of the tarot, embodying the fertile abundance of the natural world. She represents creativity in its most generative form — whether bringing forth children, art, or material prosperity. Life is lush and nourishing when she appears; lean into pleasure and creation.',
      love: 'Deep sensual connection, devotion, and the possibility of family or deepening commitment define this period in love.',
      career: 'Creative projects flourish and financial abundance grows; this is an excellent time to invest in what you are building.',
      health: 'Vitality and fertility are strong; connecting with nature and nurturing self-care rituals will deepen your wellbeing.',
    },
    reversed: {
      keywords: ['creative block', 'dependence', 'smothering', 'neglect'],
      meaning:
        'Reversed, the Empress\'s nurturing energy turns stifling, or her abundance becomes scarcity through neglect. You may be over-giving to others while depleting yourself, or you may have lost touch with your own creativity and sensuality. Restore the balance between giving and receiving.',
      love: 'Codependency, possessiveness, or emotional smothering are creating tension in relationships; allow space for both people to breathe.',
      career: 'Creative blocks or financial stagnation suggest you are not fully valuing your own talents and output.',
      health: 'Neglecting self-care, or conversely becoming obsessive about the body, is disrupting your natural balance.',
    },
  },
  {
    id: 5,
    name: 'The Emperor',
    arcana: 'major',
    number: 4,
    element: 'Fire',
    zodiac: 'Aries',
    imageFile: 'major-04-emperor.jpg',
    upright: {
      keywords: ['authority', 'structure', 'stability', 'leadership'],
      meaning:
        'The Emperor sits upon his stone throne as the archetypal father figure and sovereign ruler. He represents the principle of order — the will to establish structure, protect what matters, and build something that endures. His presence calls you toward disciplined leadership and taking full responsibility for your domain.',
      love: 'A stable, protective relationship with clear boundaries and mutual respect is either present or being called for.',
      career: 'Authority, leadership, and a disciplined approach will bring recognition and advancement; build systems that last.',
      health: 'Consistent routines and structured habits are the foundation of your physical strength and longevity.',
    },
    reversed: {
      keywords: ['domination', 'rigidity', 'control', 'abuse of power'],
      meaning:
        'Reversed, the Emperor\'s authority curdles into tyranny or collapses into weakness. You or someone in your life may be wielding power coercively, or structure has broken down entirely due to an inability to commit to discipline. Find a middle path between rigid control and passive chaos.',
      love: 'A controlling dynamic or a relationship where power is severely imbalanced is causing harm; boundaries must be reasserted.',
      career: 'Abuse of authority from a boss or your own inflexibility is creating conflict and stalling progress.',
      health: 'Stubbornness about seeking help or clinging to harmful routines is working against your body\'s needs.',
    },
  },
  {
    id: 6,
    name: 'The Hierophant',
    arcana: 'major',
    number: 5,
    element: 'Earth',
    zodiac: 'Taurus',
    imageFile: 'major-05-hierophant.jpg',
    upright: {
      keywords: ['tradition', 'spiritual guidance', 'conformity', 'institutions'],
      meaning:
        'The Hierophant is the bridge between the divine and the earthly, transmitting sacred tradition through established institutions. He represents the value of working within proven systems — religion, education, mentorship, and cultural heritage. Sometimes the tried-and-true path holds genuine wisdom worth honoring.',
      love: 'Commitment through traditional structures such as marriage or formal partnership is favored; shared values are the foundation.',
      career: 'Working within an established institution or seeking a mentor will accelerate your growth more than going it alone.',
      health: 'Following conventional medical advice and established wellness practices will produce reliable results.',
    },
    reversed: {
      keywords: ['rebellion', 'subversion', 'dogma', 'unconventionality'],
      meaning:
        'Reversed, the Hierophant signals a need to question inherited beliefs and break from rigid dogma. You may be chafing against institutions, or alternatively, blindly following rules that no longer serve your growth. Challenge what you have been taught and find your own spiritual truth.',
      love: 'Pressure to conform to relationship norms that do not fit you, or breaking free from a relationship that has become a hollow ritual.',
      career: 'The conventional path is not the right one for you now; consider unconventional options or challenging outdated workplace norms.',
      health: 'Questioning conventional wisdom about your body, or resisting advice that is genuinely sound, requires discernment.',
    },
  },
  {
    id: 7,
    name: 'The Lovers',
    arcana: 'major',
    number: 6,
    element: 'Air',
    zodiac: 'Gemini',
    imageFile: 'major-06-lovers.jpg',
    upright: {
      keywords: ['love', 'union', 'alignment', 'choice'],
      meaning:
        'The Lovers card depicts a moment of divine alignment — between two people, or between the self and its deepest values. At its core, this card is about a consequential choice that must be made with both the heart and the mind. True union is only possible when your actions are in harmony with who you truly are.',
      love: 'A powerful romantic connection or a deepening of intimacy is at hand; vulnerability and authentic expression will strengthen the bond.',
      career: 'A significant professional decision is before you — choose the path that aligns with your core values, not just financial gain.',
      health: 'Harmony between mind and body is essential now; choices you make regarding lifestyle will have lasting consequences.',
    },
    reversed: {
      keywords: ['disharmony', 'misalignment', 'poor choices', 'imbalance'],
      meaning:
        'Reversed, the Lovers indicates disharmony — an inner conflict, a relationship out of alignment, or a choice made from fear or desire rather than authentic values. You may be in denial about an incompatibility, or struggling to commit to a path. Honesty with yourself is the first step toward resolution.',
      love: 'A relationship is suffering from misalignment of values or a breakdown in communication; difficult truths must be faced.',
      career: 'You are on a path that does not reflect your true values; the discomfort you feel is a signal to reassess.',
      health: 'Internal conflict and stress are taking a tangible toll on your physical health; address the emotional root.',
    },
  },
  {
    id: 8,
    name: 'The Chariot',
    arcana: 'major',
    number: 7,
    element: 'Water',
    zodiac: 'Cancer',
    imageFile: 'major-07-chariot.jpg',
    upright: {
      keywords: ['willpower', 'victory', 'control', 'determination'],
      meaning:
        'The Chariot shows a warrior who has mastered opposing forces — the black and white sphinxes — through sheer force of will. Victory is achieved not by eliminating tension but by harnessing it and driving forward with focused determination. This card heralds triumph through discipline and unwavering resolve.',
      love: 'Pursuing a relationship or overcoming obstacles within one requires courage and persistence — your determination will be rewarded.',
      career: 'You have the drive and control to push through competition and achieve a hard-won professional victory.',
      health: 'Your willpower is your greatest health asset now; use it to push through challenges and establish stronger physical discipline.',
    },
    reversed: {
      keywords: ['lack of control', 'aggression', 'scattered energy', 'defeat'],
      meaning:
        'Reversed, the Chariot\'s momentum is lost to inner conflict and lack of direction. The opposing forces — emotion versus logic, ambition versus fear — are pulling you apart rather than being harnessed. Regroup, clarify your goal, and regain control over both your actions and your reactions.',
      love: 'Power struggles or emotional volatility are derailing a relationship; neither aggression nor passivity will resolve things.',
      career: 'You are losing ground due to scattered focus or an inability to control your impulses in a competitive environment.',
      health: 'Pushing too hard without listening to your body\'s limits, or conversely giving up on health goals too easily.',
    },
  },
  {
    id: 9,
    name: 'Strength',
    arcana: 'major',
    number: 8,
    element: 'Fire',
    zodiac: 'Leo',
    imageFile: 'major-08-strength.jpg',
    upright: {
      keywords: ['courage', 'compassion', 'patience', 'inner strength'],
      meaning:
        'Strength shows a woman taming a lion not through force but through gentleness and love. True power lies not in domination but in the quiet courage to face your fears, your instincts, and the raw animal nature within. This card asks you to lead with compassion rather than control.',
      love: 'The relationship asks for patience and tenderness; emotional courage — the willingness to be vulnerable — is the real strength required now.',
      career: 'Resilience and a calm, compassionate approach in the face of workplace challenges will distinguish you and earn lasting respect.',
      health: 'Your inner resilience is your greatest healing resource; gentle persistence with health practices will yield real results.',
    },
    reversed: {
      keywords: ['self-doubt', 'weakness', 'insecurity', 'cowardice'],
      meaning:
        'Reversed, Strength signals a crisis of confidence or the use of brute force where gentleness was needed. You may be suppressing your natural instincts in unhealthy ways, or feeling overwhelmed by fears you have not yet confronted. Reconnect with your inner courage — it has not disappeared, it is waiting.',
      love: 'Insecurity or fear of vulnerability is preventing real intimacy; courage to open up is what the relationship needs.',
      career: 'Self-doubt is undermining your performance; the competence is there, but you must stop second-guessing every decision.',
      health: 'Low energy and a sense of being overwhelmed may stem from unaddressed emotional wounds draining your vitality.',
    },
  },
  {
    id: 10,
    name: 'The Hermit',
    arcana: 'major',
    number: 9,
    element: 'Earth',
    zodiac: 'Virgo',
    imageFile: 'major-09-hermit.jpg',
    upright: {
      keywords: ['introspection', 'solitude', 'guidance', 'inner wisdom'],
      meaning:
        'The Hermit stands alone on a mountain peak, holding his lantern aloft to illuminate the path ahead. He has withdrawn from the world not out of isolation but in order to find the kind of wisdom that only solitude can reveal. This card calls you inward, inviting deep reflection and a temporary retreat from the noise of the world.',
      love: 'A period of solitude or introspection is necessary to understand what you truly want from love before seeking it externally.',
      career: 'Step back from the rush of ambition and reflect; the quiet insight you gain now will guide far better decisions ahead.',
      health: 'Rest, retreat, and introspective practices such as meditation or therapy will serve your overall health more than any external intervention.',
    },
    reversed: {
      keywords: ['isolation', 'loneliness', 'withdrawal', 'rejection'],
      meaning:
        'Reversed, the Hermit\'s necessary solitude becomes isolating withdrawal or an inability to re-enter the world after a period of reflection. You may be using solitude as avoidance, or you may be feeling profoundly lonely and cut off. The inner work is done — it is time to bring your light back to others.',
      love: 'Excessive withdrawal or fear of intimacy is preventing the connection you actually crave; the world is waiting for you to return.',
      career: 'Refusing to collaborate or share your knowledge is limiting your professional growth and alienating potential allies.',
      health: 'Prolonged isolation and lack of social connection are negatively affecting your mental and physical wellbeing.',
    },
  },
  {
    id: 11,
    name: 'Wheel of Fortune',
    arcana: 'major',
    number: 10,
    element: 'Fire',
    planet: 'Jupiter',
    imageFile: 'major-10-wheel-of-fortune.jpg',
    upright: {
      keywords: ['luck', 'cycles', 'fate', 'turning point'],
      meaning:
        'The Wheel of Fortune turns ceaselessly, bringing change, luck, and the reminder that no condition is permanent. A major turning point is at hand — circumstances are shifting in your favor and new opportunities are arriving. Life moves in cycles, and you are entering an upswing.',
      love: 'Fate is bringing a significant change to your love life — a new meeting, a surprising development, or a relationship entering a new phase.',
      career: 'A fortunate turn in your career is approaching; be ready to seize opportunities as they arise, because timing is everything.',
      health: 'A positive shift in your health is on the way; trust the cycle and continue your healing efforts.',
    },
    reversed: {
      keywords: ['bad luck', 'resistance', 'stagnation', 'chaos'],
      meaning:
        'Reversed, the Wheel of Fortune suggests you are caught in an unlucky downturn or resisting the inevitable changes of life. Fighting the natural rhythm of cycles only prolongs your suffering. Accept that things must change, release what you cannot control, and look for the lesson in the setback.',
      love: 'A run of bad luck or stagnation in your love life may feel discouraging; resist the urge to force outcomes and allow the cycle to turn.',
      career: 'External factors outside your control are creating setbacks; focus on what you can influence rather than spinning your wheels.',
      health: 'A streak of health challenges calls for patience and trust in the body\'s ability to heal over time.',
    },
  },
  {
    id: 12,
    name: 'Justice',
    arcana: 'major',
    number: 11,
    element: 'Air',
    zodiac: 'Libra',
    imageFile: 'major-11-justice.jpg',
    upright: {
      keywords: ['fairness', 'truth', 'cause and effect', 'law'],
      meaning:
        'Justice holds her scales in perfect equilibrium, cutting through illusion with her sword to reveal the objective truth. This card represents karmic law — the certainty that actions have consequences and that the truth will ultimately prevail. A legal or ethical matter will be resolved fairly.',
      love: 'Honesty, fairness, and equal contribution are the cornerstones of a healthy relationship at this time; imbalances will be corrected.',
      career: 'A fair outcome in a professional dispute or evaluation is coming; contracts, legal matters, and negotiations favor the honest party.',
      health: 'The body is giving you clear, honest feedback; pay attention to cause and effect in your lifestyle and health choices.',
    },
    reversed: {
      keywords: ['injustice', 'dishonesty', 'bias', 'avoidance'],
      meaning:
        'Reversed, Justice warns of unfairness, dishonesty, or the avoidance of accountability. You or another party is refusing to face the truth or take responsibility for past actions. Karmic debts are not being settled honestly, and the imbalance is becoming increasingly untenable.',
      love: 'Dishonesty, blame-shifting, or a deeply unfair dynamic within a relationship must be confronted directly.',
      career: 'Biased treatment, unethical practices, or a refusal to acknowledge your own errors is creating professional problems.',
      health: 'Denying or rationalizing unhealthy habits is preventing you from achieving the balance your body requires.',
    },
  },
  {
    id: 13,
    name: 'The Hanged Man',
    arcana: 'major',
    number: 12,
    element: 'Water',
    planet: 'Neptune',
    imageFile: 'major-12-hanged-man.jpg',
    upright: {
      keywords: ['suspension', 'surrender', 'new perspective', 'sacrifice'],
      meaning:
        'The Hanged Man dangles willingly from the World Tree, his serene expression revealing that this pause is not punishment but enlightenment. He has chosen to stop striving and surrender to a different way of seeing. The delay you are experiencing is not a failure — it is an invitation to view your situation from an entirely new angle.',
      love: 'Surrendering control and accepting uncertainty within a relationship will paradoxically bring you closer to what you truly want.',
      career: 'A period of waiting or deliberate inaction is wiser than forcing a move; the pause will provide clarity worth the sacrifice.',
      health: 'Rest and surrender are the most powerful medicine available to you right now; resist the urge to push through.',
    },
    reversed: {
      keywords: ['stalling', 'resistance', 'indecision', 'martyrdom'],
      meaning:
        'Reversed, the Hanged Man\'s necessary suspension becomes stubborn stalling or a refusal to make a sacrifice that must be made. You may be playing the martyr, wallowing in victimhood, or simply avoiding a decision out of fear. The limbo you are stuck in will only end when you choose to act.',
      love: 'Chronic indecision or a pattern of self-sacrifice without growth is keeping you frozen in an unsatisfying situation.',
      career: 'Stalling on a critical decision or refusing to let go of an outdated strategy is costing you valuable opportunities.',
      health: 'Neglecting your needs through excessive self-sacrifice or refusing to rest when rest is clearly required.',
    },
  },
  {
    id: 14,
    name: 'Death',
    arcana: 'major',
    number: 13,
    element: 'Water',
    zodiac: 'Scorpio',
    imageFile: 'major-13-death.jpg',
    upright: {
      keywords: ['transformation', 'endings', 'transition', 'release'],
      meaning:
        'Death rides through the landscape as an unstoppable force of transformation, clearing away what has run its course to make space for new life. This card almost never signifies physical death — it signals the necessary end of a chapter, a relationship, an identity, or a belief system. What must die so that something truer can live?',
      love: 'A relationship is undergoing a profound transformation or ending; what ends here makes space for something far more authentic.',
      career: 'A career chapter is closing — a job, a project, or an entire professional identity — clearing the way for reinvention.',
      health: 'Old habits and self-destructive patterns can be permanently released now; transformation of the body is possible through committed change.',
    },
    reversed: {
      keywords: ['resistance to change', 'stagnation', 'decay', 'fear'],
      meaning:
        'Reversed, Death\'s transformative energy is being blocked by a desperate clinging to what has already died. The refusal to accept an ending keeps you in a state of slow decay — exhausted by the effort of maintaining what can no longer be sustained. Release what is over and allow the new to begin.',
      love: 'Refusing to end or transform a relationship that has run its course is keeping both parties stuck in pain.',
      career: 'Clinging to a dead-end job or an outdated role out of fear of the unknown is blocking significant growth.',
      health: 'Resistance to fundamental lifestyle change is allowing a deteriorating health situation to worsen; radical transformation is overdue.',
    },
  },
  {
    id: 15,
    name: 'Temperance',
    arcana: 'major',
    number: 14,
    element: 'Fire',
    zodiac: 'Sagittarius',
    imageFile: 'major-14-temperance.jpg',
    upright: {
      keywords: ['balance', 'moderation', 'patience', 'integration'],
      meaning:
        'Temperance shows an angel pouring water between two cups in a graceful, continuous flow — the art of alchemical blending and divine equilibrium. This card speaks to the wisdom of moderation, the healing power of patience, and the possibility of integrating apparently opposite forces into a harmonious whole. You are being guided toward your higher purpose through steady, deliberate movement.',
      love: 'Patience, compromise, and a willingness to blend your world with another\'s are the keys to a harmonious and deepening relationship.',
      career: 'Balance multiple demands through careful management of your energy and time; the long-game approach will yield the most durable results.',
      health: 'A moderate, balanced lifestyle — integrating rest, activity, nutrition, and emotional care — is your path to lasting vitality.',
    },
    reversed: {
      keywords: ['imbalance', 'excess', 'impatience', 'conflict'],
      meaning:
        'Reversed, Temperance signals that the harmonious flow has been disrupted by excess, impatience, or the refusal to integrate conflicting parts of yourself. Life feels chaotic and out of proportion. Returning to center requires you to identify where you are overindulging or forcing outcomes, and commit to a more measured path.',
      love: 'Extremes of emotion, impatience, or incompatible lifestyles are creating friction in a relationship.',
      career: 'Overworking or neglecting key responsibilities due to poor balance is leading to burnout and diminishing returns.',
      health: 'Excess in any area — diet, exercise, substances, work — is creating an imbalance that is now showing up as physical symptoms.',
    },
  },
  {
    id: 16,
    name: 'The Devil',
    arcana: 'major',
    number: 15,
    element: 'Earth',
    zodiac: 'Capricorn',
    imageFile: 'major-15-devil.jpg',
    upright: {
      keywords: ['bondage', 'addiction', 'shadow self', 'materialism'],
      meaning:
        'The Devil shows two figures chained to his throne — yet the chains are loose and could be removed at any moment. This card confronts you with the patterns of bondage you have chosen: addiction, obsession, unhealthy attachments, and the seductive lie that you have no power to change. Acknowledging the chains is the first step to removing them.',
      love: 'A relationship may be caught in unhealthy patterns of co-dependency, obsession, or power imbalance that feel impossible to leave.',
      career: 'You may be trapped in work purely for material gain or status, sacrificing your wellbeing and deeper values in the process.',
      health: 'Addictive behaviors, excessive habits, or a pattern of using substances to cope with emotional pain require honest reckoning.',
    },
    reversed: {
      keywords: ['liberation', 'reclaiming power', 'releasing addiction', 'clarity'],
      meaning:
        'Reversed, the Devil signals a breaking of the chains — an awakening to the ways you have been complicit in your own suffering, and a first courageous step toward freedom. You are reclaiming your power from an addiction, an abusive dynamic, or a deeply ingrained limiting belief. The liberation is real but requires sustained effort.',
      love: 'Breaking free from a toxic relationship or releasing an unhealthy pattern within an existing relationship is becoming possible.',
      career: 'Leaving a soul-crushing job or recognizing that material ambition has been controlling you opens the door to more authentic work.',
      health: 'Taking the first real steps to address an addiction or deeply unhealthy habit is the breakthrough this card announces.',
    },
  },
  {
    id: 17,
    name: 'The Tower',
    arcana: 'major',
    number: 16,
    element: 'Fire',
    planet: 'Mars',
    imageFile: 'major-16-tower.jpg',
    upright: {
      keywords: ['sudden change', 'upheaval', 'revelation', 'chaos'],
      meaning:
        'The Tower is struck by lightning, sending its inhabitants into freefall — but what was built on a false foundation must fall. This card represents the sudden, disruptive force of revelation: a crisis that shatters illusions and forces an unavoidable reckoning with truth. The destruction is real, but it clears ground for something far more solid to be built.',
      love: 'A sudden revelation or upheaval is forcing a relationship into crisis; what survives will be honest, and what doesn\'t was already broken.',
      career: 'An unexpected disruption — a firing, a business failure, a sudden shift — is demolishing a structure that was not as stable as it appeared.',
      health: 'A health crisis arrives as a shock but also as a necessary wake-up call; it demands immediate attention and a complete reassessment.',
    },
    reversed: {
      keywords: ['avoidance', 'fear of change', 'disaster averted', 'delayed collapse'],
      meaning:
        'Reversed, the Tower\'s collapse has been narrowly avoided or is being stubbornly resisted. You may be refusing to acknowledge that a structure in your life is fundamentally unsound. Alternatively, a crisis has passed and the rebuilding can begin. Either way, denial only delays the inevitable.',
      love: 'Desperately avoiding a necessary but painful conversation is prolonging a crisis that must eventually be faced.',
      career: 'A workplace upheaval is being resisted or delayed; the longer the reckoning is put off, the more destabilizing it becomes.',
      health: 'Ignoring serious warning signs out of fear of what you might learn will allow a manageable problem to escalate.',
    },
  },
  {
    id: 18,
    name: 'The Star',
    arcana: 'major',
    number: 17,
    element: 'Air',
    zodiac: 'Aquarius',
    imageFile: 'major-17-star.jpg',
    upright: {
      keywords: ['hope', 'healing', 'inspiration', 'serenity'],
      meaning:
        'After the Tower\'s destruction, the Star appears as a gift of renewal — a naked figure pouring water back into the earth, restoring what was depleted. This card radiates the quiet, luminous hope that follows a period of crisis: the certainty that healing is real, that the universe is benevolent, and that your light has not been extinguished.',
      love: 'After difficulty, love is being renewed; a sense of openness, hope, and genuine connection with another is returning.',
      career: 'Inspiration and renewed purpose are guiding you toward work that feels genuinely meaningful and aligned with your gifts.',
      health: 'Healing is actively occurring; trust the process, nourish your body and spirit, and allow the recovery to unfold.',
    },
    reversed: {
      keywords: ['despair', 'lack of faith', 'disconnection', 'disillusionment'],
      meaning:
        'Reversed, the Star\'s healing light is obscured by despair, self-doubt, or a profound loss of faith in the future. You may be feeling hopeless or unable to envision a way forward after a period of loss. Reconnecting with even a small source of inspiration or beauty can begin to restore the inner light.',
      love: 'Hopelessness or a deep fear that love will never come — or return — is preventing you from opening your heart.',
      career: 'Disillusionment with your work or a loss of faith in your own abilities is creating stagnation; reconnect with your original inspiration.',
      health: 'A pessimistic or defeated attitude toward your own healing is slowing recovery; small acts of self-care can begin to shift the tide.',
    },
  },
  {
    id: 19,
    name: 'The Moon',
    arcana: 'major',
    number: 18,
    element: 'Water',
    zodiac: 'Pisces',
    imageFile: 'major-18-moon.jpg',
    upright: {
      keywords: ['illusion', 'fear', 'the unconscious', 'confusion'],
      meaning:
        'The Moon illuminates a strange and shifting landscape where the familiar becomes uncanny — the path winds through shadow, and what appears real may be illusion. This card invites you into the depths of the unconscious mind: your dreams, fears, and unprocessed emotions are speaking, and you must learn to navigate by intuition rather than clear sight.',
      love: 'Confusion, unspoken fears, and illusions are distorting perception in a relationship; look beneath the surface and trust your intuition.',
      career: 'Things are not as they appear in your professional environment; deception or self-delusion may be at play, requiring careful discernment.',
      health: 'Anxiety, sleep disturbances, and emotionally rooted physical symptoms are asking for deeper psychological attention.',
    },
    reversed: {
      keywords: ['clarity', 'release of fear', 'truth revealed', 'emerging from confusion'],
      meaning:
        'Reversed, the Moon\'s fog begins to lift, revealing the truth that was obscured. Fears that haunted you lose their power as you bring them into the light. A period of confusion is ending, and you are beginning to see a situation — or yourself — with much greater clarity and honesty.',
      love: 'The truth about a relationship is finally becoming clear; whether it is reassuring or disappointing, clarity is a gift.',
      career: 'A deception in the workplace is being exposed, or the confusion about which direction to take is finally resolving.',
      health: 'The source of a mysterious health issue or chronic anxiety is becoming clearer; addressing it directly will bring real relief.',
    },
  },
  {
    id: 20,
    name: 'The Sun',
    arcana: 'major',
    number: 19,
    element: 'Fire',
    planet: 'Sun',
    imageFile: 'major-19-sun.jpg',
    upright: {
      keywords: ['joy', 'success', 'vitality', 'clarity'],
      meaning:
        'The Sun blazes in a cloudless sky as a child dances freely on horseback — pure joy, unself-conscious vitality, and the radiant certainty that life is good. This is the most unambiguously positive card in the Major Arcana, heralding success, happiness, and the warmth of good fortune. Whatever you set your mind to now has the sun at its back.',
      love: 'A relationship is flourishing in warmth, joy, and mutual delight; this is a time of real happiness and authentic connection.',
      career: 'Success and recognition are yours; your efforts are paying off and your work is being seen in the best possible light.',
      health: 'Vitality and excellent health prevail; physical energy is high and the body\'s natural capacity to thrive is fully expressed.',
    },
    reversed: {
      keywords: ['sadness', 'pessimism', 'blocked joy', 'temporary setback'],
      meaning:
        'Reversed, the Sun\'s light is temporarily dimmed — not extinguished, but obscured. A period of sadness, low confidence, or difficulty finding joy may be clouding an otherwise positive situation. The happiness you seek is real and available; it may simply require removing the inner obstacles that are casting shadow.',
      love: 'Inner sadness or a tendency toward pessimism is preventing you from fully receiving the love that is actually available to you.',
      career: 'A temporary setback or a bout of self-doubt is making it hard to see the genuine success you have achieved or are capable of.',
      health: 'Low energy, depression, or seasonal mood challenges are dampening your vitality; prioritize activities that reconnect you with joy.',
    },
  },
  {
    id: 21,
    name: 'Judgement',
    arcana: 'major',
    number: 20,
    element: 'Fire',
    planet: 'Pluto',
    imageFile: 'major-20-judgement.jpg',
    upright: {
      keywords: ['rebirth', 'inner calling', 'absolution', 'awakening'],
      meaning:
        'Judgement shows figures rising from their graves at the sound of the angel\'s trumpet — not to be condemned, but to be called home. This card signals a profound awakening to your true purpose and a moment of reckoning with the full arc of your past. You are being summoned to a higher version of yourself; all that you have lived has prepared you for this moment.',
      love: 'A profound renewal within a relationship, or the return of a significant connection from the past, marks an important turning point.',
      career: 'A calling to your true life\'s work is becoming undeniable; what you have learned and endured has uniquely prepared you for what is next.',
      health: 'A major health breakthrough or a profound shift in relationship to your body marks the beginning of genuine healing and renewal.',
    },
    reversed: {
      keywords: ['self-doubt', 'refusing the call', 'guilt', 'stagnation'],
      meaning:
        'Reversed, Judgement indicates that the inner calling is being heard but refused — smothered by self-doubt, unresolved guilt, or fear of the transformation required. You know what must change, and you are not yet ready to answer. The longer the call is ignored, the heavier the weight of the unlived life becomes.',
      love: 'Unresolved guilt or fear of repeating past mistakes is preventing you from fully committing to a relationship or a fresh start.',
      career: 'You know what your true calling is and are actively avoiding it; the cost of this avoidance is growing.',
      health: 'Unresolved emotional wounds from the past are manifesting as physical symptoms that will not heal until their root is addressed.',
    },
  },
  {
    id: 22,
    name: 'The World',
    arcana: 'major',
    number: 21,
    element: 'Earth',
    planet: 'Saturn',
    imageFile: 'major-21-world.jpg',
    upright: {
      keywords: ['completion', 'integration', 'accomplishment', 'wholeness'],
      meaning:
        'The World dancer moves in perfect harmony at the center of a wreath of completion, surrounded by the four elemental guardians. This card marks the triumphant end of a major life cycle — the achievement of wholeness through everything you have experienced and integrated along the journey. What began with the Fool\'s innocent leap now arrives at its fullest expression.',
      love: 'A relationship reaches a beautiful milestone of completeness — deep fulfillment, mutual understanding, and the sense of having found your person.',
      career: 'A major professional achievement or the successful completion of a long-term goal brings recognition and a sense of profound accomplishment.',
      health: 'A state of wholeness and integration in your health — body, mind, and spirit working in harmony — is either present or within reach.',
    },
    reversed: {
      keywords: ['incompletion', 'stagnation', 'shortcuts', 'loose ends'],
      meaning:
        'Reversed, the World card points to a cycle that is not quite complete — some essential lesson or task remains unfinished, preventing you from fully claiming your success. You may be seeking closure without doing the final work, or taking shortcuts that undermine a genuine sense of wholeness. Tie the loose ends with full presence and care.',
      love: 'An unresolved issue from the past, or the refusal to fully commit to a relationship, is preventing the sense of completion you desire.',
      career: 'A project or professional chapter is not truly finished; rushing toward the next thing before closing this one properly will create problems.',
      health: 'Partial efforts toward healing are not enough; full commitment to integrating all aspects of your wellbeing is required for lasting results.',
    },
  },
];
