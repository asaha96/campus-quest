// Challenge pool for daily and weekly challenges

export const CHALLENGE_CATEGORIES = {
  focus: { name: 'Focus', icon: '🎯', color: '#4a90d9' },
  fitness: { name: 'Fitness', icon: '💪', color: '#e74c3c' },
  hydration: { name: 'Hydration', icon: '💧', color: '#3498db' },
  reading: { name: 'Reading', icon: '📚', color: '#9b59b6' },
  sleep: { name: 'Sleep', icon: '😴', color: '#1abc9c' },
}

// Daily challenges - smaller, achievable in one day
export const DAILY_CHALLENGES = [
  // Focus challenges
  {
    id: 'focus_15',
    category: 'focus',
    title: 'Quick Focus',
    description: 'Complete a 15-minute focus session',
    requirement: { type: 'focusMinutes', value: 15 },
    xpBonus: 25,
    difficulty: 'easy',
  },
  {
    id: 'focus_30',
    category: 'focus',
    title: 'Deep Work',
    description: 'Accumulate 30 focus minutes',
    requirement: { type: 'focusMinutes', value: 30 },
    xpBonus: 50,
    difficulty: 'medium',
  },
  {
    id: 'focus_60',
    category: 'focus',
    title: 'Focus Master',
    description: 'Accumulate 60 focus minutes',
    requirement: { type: 'focusMinutes', value: 60 },
    xpBonus: 100,
    difficulty: 'hard',
  },
  {
    id: 'focus_sessions_2',
    category: 'focus',
    title: 'Double Session',
    description: 'Complete 2 focus sessions',
    requirement: { type: 'focusSessions', value: 2 },
    xpBonus: 40,
    difficulty: 'medium',
  },

  // Fitness challenges
  {
    id: 'workout_1',
    category: 'fitness',
    title: 'Get Moving',
    description: 'Log at least one workout',
    requirement: { type: 'workoutsLogged', value: 1 },
    xpBonus: 30,
    difficulty: 'easy',
  },
  {
    id: 'workout_30min',
    category: 'fitness',
    title: 'Power Hour',
    description: 'Log 30 minutes of exercise',
    requirement: { type: 'exerciseMinutes', value: 30 },
    xpBonus: 50,
    difficulty: 'medium',
  },

  // Hydration challenges
  {
    id: 'water_4',
    category: 'hydration',
    title: 'Stay Hydrated',
    description: 'Drink 4 glasses of water',
    requirement: { type: 'waterGlasses', value: 4 },
    xpBonus: 20,
    difficulty: 'easy',
  },
  {
    id: 'water_8',
    category: 'hydration',
    title: 'Hydration Hero',
    description: 'Drink 8 glasses of water',
    requirement: { type: 'waterGlasses', value: 8 },
    xpBonus: 50,
    difficulty: 'medium',
  },

  // Reading challenges
  {
    id: 'read_10',
    category: 'reading',
    title: 'Page Turner',
    description: 'Read 10 pages',
    requirement: { type: 'pagesRead', value: 10 },
    xpBonus: 25,
    difficulty: 'easy',
  },
  {
    id: 'read_30',
    category: 'reading',
    title: 'Bookworm',
    description: 'Read 30 pages',
    requirement: { type: 'pagesRead', value: 30 },
    xpBonus: 60,
    difficulty: 'medium',
  },

  // Sleep challenges
  {
    id: 'sleep_7',
    category: 'sleep',
    title: 'Well Rested',
    description: 'Log 7+ hours of sleep',
    requirement: { type: 'sleepHours', value: 7 },
    xpBonus: 40,
    difficulty: 'medium',
  },
  {
    id: 'sleep_8',
    category: 'sleep',
    title: 'Sleep Champion',
    description: 'Log 8+ hours of sleep',
    requirement: { type: 'sleepHours', value: 8 },
    xpBonus: 60,
    difficulty: 'hard',
  },
]

// Weekly goals - longer-term objectives
export const WEEKLY_GOALS = [
  {
    id: 'weekly_focus_200',
    category: 'focus',
    title: 'Weekly Focus Goal',
    description: 'Accumulate 200 focus minutes this week',
    requirement: { type: 'focusMinutes', value: 200 },
    xpBonus: 200,
    milestones: [50, 100, 150, 200],
  },
  {
    id: 'weekly_workouts_3',
    category: 'fitness',
    title: 'Active Week',
    description: 'Log 3 workouts this week',
    requirement: { type: 'workoutsLogged', value: 3 },
    xpBonus: 150,
    milestones: [1, 2, 3],
  },
  {
    id: 'weekly_reading_100',
    category: 'reading',
    title: 'Reading Week',
    description: 'Read 100 pages this week',
    requirement: { type: 'pagesRead', value: 100 },
    xpBonus: 175,
    milestones: [25, 50, 75, 100],
  },
  {
    id: 'weekly_hydration_streak',
    category: 'hydration',
    title: 'Hydration Streak',
    description: 'Hit your hydration goal 5 days this week',
    requirement: { type: 'hydrationDays', value: 5 },
    xpBonus: 150,
    milestones: [2, 3, 4, 5],
  },
  {
    id: 'weekly_sleep_quality',
    category: 'sleep',
    title: 'Sleep Schedule',
    description: 'Log 7+ hours of sleep for 5 days',
    requirement: { type: 'goodSleepDays', value: 5 },
    xpBonus: 175,
    milestones: [2, 3, 4, 5],
  },
]

// Generate 3 random daily challenges for a given date
export const generateDailyChallenges = (dateString) => {
  // Use date as seed for consistent challenges per day
  const seed = dateString.split('-').reduce((acc, n) => acc + parseInt(n), 0)

  // Shuffle challenges using seed
  const shuffled = [...DAILY_CHALLENGES].sort((a, b) => {
    const hashA = (seed * a.id.charCodeAt(0)) % 100
    const hashB = (seed * b.id.charCodeAt(0)) % 100
    return hashA - hashB
  })

  // Select 3 challenges from different categories
  const selected = []
  const usedCategories = new Set()

  for (const challenge of shuffled) {
    if (selected.length >= 3) break
    if (!usedCategories.has(challenge.category)) {
      selected.push(challenge)
      usedCategories.add(challenge.category)
    }
  }

  // If we don't have 3 yet, add more regardless of category
  for (const challenge of shuffled) {
    if (selected.length >= 3) break
    if (!selected.find(c => c.id === challenge.id)) {
      selected.push(challenge)
    }
  }

  return selected
}

// Get challenge by ID
export const getChallenge = (challengeId) => {
  return DAILY_CHALLENGES.find(c => c.id === challengeId) ||
         WEEKLY_GOALS.find(c => c.id === challengeId) ||
         null
}

// Check if challenge requirement is met
export const checkChallengeProgress = (challenge, stats) => {
  const { type, value } = challenge.requirement

  const currentValue = stats[type] || 0
  const progress = Math.min(currentValue / value, 1)

  return {
    current: currentValue,
    target: value,
    progress,
    completed: currentValue >= value,
  }
}

export default {
  CHALLENGE_CATEGORIES,
  DAILY_CHALLENGES,
  WEEKLY_GOALS,
  generateDailyChallenges,
  getChallenge,
  checkChallengeProgress,
}
