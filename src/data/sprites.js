// Knowledge Sprites - collectible creatures themed around learning

export const sprites = [
  {
    id: 1,
    name: 'Syntaxia',
    type: 'Code',
    emoji: '🔮',
    description: 'A mystical sprite that appears after clean code sessions.',
    rarity: 'common',
    unlockCondition: 'Complete your first focus session',
    stats: { hp: 50, attack: 8, defense: 5, speed: 10 },
    moves: [
      { name: 'Syntax Slash', power: 15, accuracy: 95, type: 'attack' },
      { name: 'Debug', power: 20, accuracy: 100, type: 'heal' },
    ],
  },
  {
    id: 2,
    name: 'Algorhythm',
    type: 'Logic',
    emoji: '🎵',
    description: 'Dances to the beat of efficient algorithms.',
    rarity: 'uncommon',
    unlockCondition: 'Complete 5 focus sessions',
    stats: { hp: 45, attack: 12, defense: 4, speed: 15 },
    moves: [
      { name: 'Binary Beat', power: 18, accuracy: 90, type: 'attack' },
      { name: 'Optimize', power: 15, accuracy: 100, type: 'heal' },
    ],
  },
  {
    id: 3,
    name: 'Debuggle',
    type: 'Problem-Solving',
    emoji: '🐛',
    description: 'Helps squash bugs and solve tricky problems.',
    rarity: 'common',
    unlockCondition: 'Complete a 25-minute focus session',
    stats: { hp: 55, attack: 7, defense: 8, speed: 6 },
    moves: [
      { name: 'Bug Bite', power: 12, accuracy: 100, type: 'attack' },
      { name: 'Stack Trace', power: 20, accuracy: 85, type: 'attack' },
    ],
  },
  {
    id: 4,
    name: 'Flexor',
    type: 'Fitness',
    emoji: '💪',
    description: 'Grows stronger with every workout logged.',
    rarity: 'common',
    unlockCondition: 'Log your first workout',
    stats: { hp: 60, attack: 15, defense: 10, speed: 5 },
    moves: [
      { name: 'Power Press', power: 20, accuracy: 90, type: 'attack' },
      { name: 'Protein Shake', power: 25, accuracy: 100, type: 'heal' },
    ],
  },
  {
    id: 5,
    name: 'Cardio',
    type: 'Endurance',
    emoji: '🏃',
    description: 'Never gets tired, always ready for more.',
    rarity: 'uncommon',
    unlockCondition: 'Log 3 cardio workouts',
    stats: { hp: 40, attack: 10, defense: 3, speed: 20 },
    moves: [
      { name: 'Sprint Strike', power: 14, accuracy: 95, type: 'attack' },
      { name: 'Second Wind', power: 30, accuracy: 100, type: 'heal' },
    ],
  },
  {
    id: 6,
    name: 'Librix',
    type: 'Knowledge',
    emoji: '📚',
    description: 'A wise sprite born from countless study hours.',
    rarity: 'rare',
    unlockCondition: 'Accumulate 100 focus minutes',
    stats: { hp: 65, attack: 14, defense: 12, speed: 8 },
    moves: [
      { name: 'Knowledge Blast', power: 25, accuracy: 85, type: 'attack' },
      { name: 'Study Break', power: 35, accuracy: 100, type: 'heal' },
    ],
  },
  {
    id: 7,
    name: 'Caffeinix',
    type: 'Energy',
    emoji: '☕',
    description: 'Provides a boost when you need it most.',
    rarity: 'uncommon',
    unlockCondition: 'Visit the cafe after a long study session',
    stats: { hp: 35, attack: 18, defense: 2, speed: 18 },
    moves: [
      { name: 'Espresso Shot', power: 22, accuracy: 90, type: 'attack' },
      { name: 'Caffeine Rush', power: 15, accuracy: 100, type: 'heal' },
    ],
  },
  {
    id: 8,
    name: 'Zenith',
    type: 'Balance',
    emoji: '🧘',
    description: 'Represents perfect harmony between work and rest.',
    rarity: 'legendary',
    unlockCondition: 'Complete 10 focus sessions and 10 workouts',
    stats: { hp: 80, attack: 16, defense: 15, speed: 12 },
    moves: [
      { name: 'Balance Strike', power: 30, accuracy: 95, type: 'attack' },
      { name: 'Meditate', power: 40, accuracy: 100, type: 'heal' },
      { name: 'Inner Peace', power: 50, accuracy: 80, type: 'attack' },
    ],
  },
]

// Wild sprites that can be encountered in random battles
export const wildSprites = [
  {
    id: 101,
    name: 'Buglet',
    type: 'Bug',
    emoji: '🪲',
    description: 'A common bug found around campus.',
    catchRate: 0.4,
    zones: ['campus'],
    stats: { hp: 30, attack: 5, defense: 3, speed: 8 },
    moves: [
      { name: 'Nibble', power: 8, accuracy: 100, type: 'attack' },
    ],
    xpReward: 15,
  },
  {
    id: 102,
    name: 'Memoleaf',
    type: 'Nature',
    emoji: '🍃',
    description: 'A leaf sprite that helps with memory.',
    catchRate: 0.25,
    zones: ['library', 'campus'],
    stats: { hp: 35, attack: 6, defense: 5, speed: 7 },
    moves: [
      { name: 'Leaf Cut', power: 10, accuracy: 95, type: 'attack' },
      { name: 'Refresh', power: 10, accuracy: 100, type: 'heal' },
    ],
    xpReward: 25,
  },
  {
    id: 103,
    name: 'Naptide',
    type: 'Rest',
    emoji: '💤',
    description: 'A drowsy sprite that appears near the dorms.',
    catchRate: 0.3,
    zones: ['dorm', 'campus'],
    stats: { hp: 40, attack: 4, defense: 8, speed: 3 },
    moves: [
      { name: 'Dream Tap', power: 12, accuracy: 90, type: 'attack' },
    ],
    xpReward: 20,
  },
  {
    id: 104,
    name: 'Sweatdrop',
    type: 'Fitness',
    emoji: '💦',
    description: 'An energetic sprite found near the gym.',
    catchRate: 0.35,
    zones: ['gym', 'campus'],
    stats: { hp: 32, attack: 9, defense: 4, speed: 12 },
    moves: [
      { name: 'Splash Attack', power: 11, accuracy: 95, type: 'attack' },
    ],
    xpReward: 20,
  },
  {
    id: 105,
    name: 'Steamie',
    type: 'Energy',
    emoji: '♨️',
    description: 'A hot sprite that loves the cafe.',
    catchRate: 0.2,
    zones: ['cafe', 'campus'],
    stats: { hp: 28, attack: 11, defense: 3, speed: 10 },
    moves: [
      { name: 'Steam Burst', power: 14, accuracy: 88, type: 'attack' },
    ],
    xpReward: 30,
  },
]

export const getSpriteById = (id) => {
  // Check both regular sprites and wild sprites
  return sprites.find(sprite => sprite.id === id) ||
         wildSprites.find(sprite => sprite.id === id)
}

export const getRandomSprite = (collectedIds = []) => {
  const uncollected = sprites.filter(s => !collectedIds.includes(s.id))
  if (uncollected.length === 0) return null

  // Weight by rarity
  const weights = {
    common: 50,
    uncommon: 30,
    rare: 15,
    legendary: 5,
  }

  const weighted = uncollected.flatMap(sprite =>
    Array(weights[sprite.rarity]).fill(sprite)
  )

  return weighted[Math.floor(Math.random() * weighted.length)]
}

export const getRandomWildSprite = (zone = 'campus', caughtIds = []) => {
  // Filter wild sprites by zone and not yet caught
  const available = wildSprites.filter(
    s => s.zones.includes(zone) && !caughtIds.includes(s.id)
  )

  if (available.length === 0) {
    // If all zone sprites caught, return any uncaught wild sprite
    const anyAvailable = wildSprites.filter(s => !caughtIds.includes(s.id))
    if (anyAvailable.length === 0) return null
    return anyAvailable[Math.floor(Math.random() * anyAvailable.length)]
  }

  return available[Math.floor(Math.random() * available.length)]
}

// Calculate damage in sprite battles
export const calculateSpriteDamage = (attacker, move, defender) => {
  if (move.type === 'heal') {
    return Math.floor(move.power * (1 + attacker.stats.defense / 50))
  }

  // Attack formula: (power * attack / defense) with some randomness
  const baseDamage = (move.power * attacker.stats.attack) / Math.max(1, defender.stats.defense)
  const variance = 0.85 + Math.random() * 0.3 // 85% to 115%
  return Math.floor(baseDamage * variance)
}

// Check if move hits based on accuracy
export const checkAccuracy = (move) => {
  return Math.random() * 100 < move.accuracy
}
