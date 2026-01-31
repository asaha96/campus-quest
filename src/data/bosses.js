// Boss configurations for each zone

export const BOSSES = {
  LIBRARY: {
    name: 'Professor Wisdom',
    emoji: '📚',
    hp: 120,
    damage: { min: 8, max: 16 },
    xpReward: 75,
    specialAbility: {
      name: 'Pop Quiz',
      description: 'A sudden burst of difficult questions!',
      damage: { min: 15, max: 25 },
      chance: 0.2,
    },
    dialogue: {
      intro: 'Prepare to be tested on your knowledge!',
      attack: 'Study this!',
      special: 'POP QUIZ TIME!',
      defeat: 'Your wisdom has surpassed mine...',
      victory: 'Back to studying with you!',
    },
    color: 'blue',
  },
  GYM: {
    name: 'Coach Thunder',
    emoji: '🏋️',
    hp: 100,
    damage: { min: 10, max: 18 },
    xpReward: 50,
    specialAbility: {
      name: 'Power Slam',
      description: 'A devastating gym equipment attack!',
      damage: { min: 20, max: 30 },
      chance: 0.15,
    },
    dialogue: {
      intro: 'Time to see if you can handle a REAL workout!',
      attack: 'Feel the burn!',
      special: 'POWER SLAM!!!',
      defeat: 'Now THAT\'s what I call gains!',
      victory: 'Need more reps, rookie!',
    },
    color: 'red',
  },
  CAFE: {
    name: 'Barista Blitz',
    emoji: '☕',
    hp: 80,
    damage: { min: 6, max: 12 },
    xpReward: 40,
    specialAbility: {
      name: 'Espresso Shot',
      description: 'A supercharged caffeine attack!',
      damage: { min: 12, max: 20 },
      chance: 0.25,
    },
    dialogue: {
      intro: 'Your order is... DEFEAT!',
      attack: 'Hot coffee incoming!',
      special: 'TRIPLE ESPRESSO SHOT!!!',
      defeat: 'You\'ve earned your coffee break...',
      victory: 'No coffee for you!',
    },
    color: 'amber',
  },
  DORM: {
    name: 'RA Restless',
    emoji: '😴',
    hp: 90,
    damage: { min: 5, max: 10 },
    xpReward: 45,
    specialAbility: {
      name: 'Quiet Hours',
      description: 'Forces you into a drowsy state!',
      damage: { min: 10, max: 15 },
      chance: 0.3,
    },
    dialogue: {
      intro: 'It\'s past quiet hours... time for consequences!',
      attack: 'Keep it down!',
      special: 'LIGHTS OUT!!!',
      defeat: 'Fine... you can stay up late tonight.',
      victory: 'Time for bed!',
    },
    color: 'purple',
  },
}

export const getBoss = (type) => {
  return BOSSES[type] || BOSSES.GYM
}

export const calculateDamage = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const shouldUseSpecial = (boss) => {
  return boss.specialAbility && Math.random() < boss.specialAbility.chance
}
