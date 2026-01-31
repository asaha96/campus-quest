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
  },
  {
    id: 2,
    name: 'Algorhythm',
    type: 'Logic',
    emoji: '🎵',
    description: 'Dances to the beat of efficient algorithms.',
    rarity: 'uncommon',
    unlockCondition: 'Complete 5 focus sessions',
  },
  {
    id: 3,
    name: 'Debuggle',
    type: 'Problem-Solving',
    emoji: '🐛',
    description: 'Helps squash bugs and solve tricky problems.',
    rarity: 'common',
    unlockCondition: 'Complete a 25-minute focus session',
  },
  {
    id: 4,
    name: 'Flexor',
    type: 'Fitness',
    emoji: '💪',
    description: 'Grows stronger with every workout logged.',
    rarity: 'common',
    unlockCondition: 'Log your first workout',
  },
  {
    id: 5,
    name: 'Cardio',
    type: 'Endurance',
    emoji: '🏃',
    description: 'Never gets tired, always ready for more.',
    rarity: 'uncommon',
    unlockCondition: 'Log 3 cardio workouts',
  },
  {
    id: 6,
    name: 'Librix',
    type: 'Knowledge',
    emoji: '📚',
    description: 'A wise sprite born from countless study hours.',
    rarity: 'rare',
    unlockCondition: 'Accumulate 100 focus minutes',
  },
  {
    id: 7,
    name: 'Caffeinix',
    type: 'Energy',
    emoji: '☕',
    description: 'Provides a boost when you need it most.',
    rarity: 'uncommon',
    unlockCondition: 'Visit the cafe after a long study session',
  },
  {
    id: 8,
    name: 'Zenith',
    type: 'Balance',
    emoji: '🧘',
    description: 'Represents perfect harmony between work and rest.',
    rarity: 'legendary',
    unlockCondition: 'Complete 10 focus sessions and 10 workouts',
  },
]

export const getSpriteById = (id) => {
  return sprites.find(sprite => sprite.id === id)
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
