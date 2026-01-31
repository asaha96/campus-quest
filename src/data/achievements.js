// Achievement definitions

export const ACHIEVEMENTS = {
  // Getting Started
  first_steps: {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first focus session',
    icon: '👣',
    category: 'basics',
    requirement: { type: 'focusSessions', value: 1 },
    xpReward: 25,
  },
  orientation: {
    id: 'orientation',
    name: 'Orientation Complete',
    description: 'Visit all campus buildings',
    icon: '🗺️',
    category: 'exploration',
    requirement: { type: 'zonesVisited', value: 4 },
    xpReward: 50,
  },

  // Focus achievements
  focus_10: {
    id: 'focus_10',
    name: 'Getting Focused',
    description: 'Accumulate 10 focus minutes',
    icon: '🎯',
    category: 'focus',
    requirement: { type: 'focusMinutes', value: 10 },
    xpReward: 20,
  },
  focus_100: {
    id: 'focus_100',
    name: 'Focus Apprentice',
    description: 'Accumulate 100 focus minutes',
    icon: '🔥',
    category: 'focus',
    requirement: { type: 'focusMinutes', value: 100 },
    xpReward: 100,
  },
  focus_500: {
    id: 'focus_500',
    name: 'Focus Master',
    description: 'Accumulate 500 focus minutes',
    icon: '⭐',
    category: 'focus',
    requirement: { type: 'focusMinutes', value: 500 },
    xpReward: 250,
  },
  focus_1000: {
    id: 'focus_1000',
    name: 'Focus Legend',
    description: 'Accumulate 1000 focus minutes',
    icon: '🏆',
    category: 'focus',
    requirement: { type: 'focusMinutes', value: 1000 },
    xpReward: 500,
  },

  // Sprite achievements
  sprite_1: {
    id: 'sprite_1',
    name: 'Sprite Seeker',
    description: 'Catch your first sprite',
    icon: '✨',
    category: 'sprites',
    requirement: { type: 'spritesCaught', value: 1 },
    xpReward: 25,
  },
  sprite_5: {
    id: 'sprite_5',
    name: 'Sprite Collector',
    description: 'Catch 5 sprites',
    icon: '🌟',
    category: 'sprites',
    requirement: { type: 'spritesCaught', value: 5 },
    xpReward: 75,
  },
  sprite_10: {
    id: 'sprite_10',
    name: 'Sprite Hunter',
    description: 'Catch 10 sprites',
    icon: '💫',
    category: 'sprites',
    requirement: { type: 'spritesCaught', value: 10 },
    xpReward: 150,
  },
  sprite_25: {
    id: 'sprite_25',
    name: 'Sprite Champion',
    description: 'Catch 25 sprites',
    icon: '👑',
    category: 'sprites',
    requirement: { type: 'spritesCaught', value: 25 },
    xpReward: 300,
  },

  // Streak achievements
  streak_3: {
    id: 'streak_3',
    name: 'On a Roll',
    description: 'Maintain any streak for 3 days',
    icon: '🔥',
    category: 'streaks',
    requirement: { type: 'anyStreak', value: 3 },
    xpReward: 50,
  },
  streak_7: {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain any streak for 7 days',
    icon: '💪',
    category: 'streaks',
    requirement: { type: 'anyStreak', value: 7 },
    xpReward: 100,
  },
  streak_30: {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain any streak for 30 days',
    icon: '🎖️',
    category: 'streaks',
    requirement: { type: 'anyStreak', value: 30 },
    xpReward: 500,
  },

  // Level achievements
  level_5: {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '⬆️',
    category: 'progress',
    requirement: { type: 'level', value: 5 },
    xpReward: 50,
  },
  level_10: {
    id: 'level_10',
    name: 'Campus Regular',
    description: 'Reach level 10',
    icon: '🌟',
    category: 'progress',
    requirement: { type: 'level', value: 10 },
    xpReward: 100,
  },
  level_25: {
    id: 'level_25',
    name: 'Campus Veteran',
    description: 'Reach level 25',
    icon: '🎓',
    category: 'progress',
    requirement: { type: 'level', value: 25 },
    xpReward: 250,
  },
  level_50: {
    id: 'level_50',
    name: 'Campus Legend',
    description: 'Reach level 50',
    icon: '👨‍🎓',
    category: 'progress',
    requirement: { type: 'level', value: 50 },
    xpReward: 500,
  },

  // Quest achievements
  quest_first: {
    id: 'quest_first',
    name: 'Quest Beginner',
    description: 'Complete your first quest',
    icon: '📜',
    category: 'quests',
    requirement: { type: 'questsCompleted', value: 1 },
    xpReward: 25,
  },
  quest_10: {
    id: 'quest_10',
    name: 'Quest Runner',
    description: 'Complete 10 quests',
    icon: '🏃',
    category: 'quests',
    requirement: { type: 'questsCompleted', value: 10 },
    xpReward: 150,
  },

  // Social achievements
  first_friend: {
    id: 'first_friend',
    name: 'Social Butterfly',
    description: 'Add your first friend',
    icon: '🤝',
    category: 'social',
    requirement: { type: 'friendsAdded', value: 1 },
    xpReward: 50,
  },

  // Challenge achievements
  challenge_streak_5: {
    id: 'challenge_streak_5',
    name: 'Challenge Streak',
    description: 'Complete daily challenges 5 days in a row',
    icon: '🔥',
    category: 'challenges',
    requirement: { type: 'challengeStreak', value: 5 },
    xpReward: 100,
  },

  // Hydration achievements
  hydration_8: {
    id: 'hydration_8',
    name: 'Hydration Hero',
    description: 'Drink 8 glasses of water in one day',
    icon: '💧',
    category: 'wellness',
    requirement: { type: 'waterGlasses', value: 8 },
    xpReward: 30,
  },

  // Story achievements
  chapter_1: {
    id: 'chapter_1',
    name: 'Freshman',
    description: 'Complete Chapter 1',
    icon: '📖',
    category: 'story',
    requirement: { type: 'chaptersCompleted', value: 1 },
    xpReward: 100,
  },
  graduate: {
    id: 'graduate',
    name: 'Graduate',
    description: 'Complete the entire story',
    icon: '🎓',
    category: 'story',
    requirement: { type: 'gameComplete', value: 1 },
    xpReward: 1000,
  },
}

// Achievement categories
export const ACHIEVEMENT_CATEGORIES = {
  basics: { name: 'Getting Started', order: 1 },
  focus: { name: 'Focus', order: 2 },
  sprites: { name: 'Sprites', order: 3 },
  streaks: { name: 'Streaks', order: 4 },
  progress: { name: 'Progress', order: 5 },
  quests: { name: 'Quests', order: 6 },
  story: { name: 'Story', order: 7 },
  challenges: { name: 'Challenges', order: 8 },
  wellness: { name: 'Wellness', order: 9 },
  social: { name: 'Social', order: 10 },
  exploration: { name: 'Exploration', order: 11 },
}

// Get achievement by ID
export const getAchievement = (id) => {
  return ACHIEVEMENTS[id] || null
}

// Get all achievements for a category
export const getAchievementsByCategory = (category) => {
  return Object.values(ACHIEVEMENTS).filter(a => a.category === category)
}

// Get all achievements sorted by category
export const getAllAchievements = () => {
  return Object.values(ACHIEVEMENTS).sort((a, b) => {
    const catA = ACHIEVEMENT_CATEGORIES[a.category]?.order || 99
    const catB = ACHIEVEMENT_CATEGORIES[b.category]?.order || 99
    return catA - catB
  })
}

export default ACHIEVEMENTS
