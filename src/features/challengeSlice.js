import { createSlice } from '@reduxjs/toolkit'
import { generateDailyChallenges } from '../data/challenges'

// Get today's date string
const getTodayString = () => {
  const today = new Date()
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
}

// Get current week string (year-week)
const getWeekString = () => {
  const today = new Date()
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1)
  const pastDaysOfYear = (today - firstDayOfYear) / 86400000
  const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  return `${today.getFullYear()}-W${weekNum}`
}

const initialState = {
  // Daily challenges
  currentDate: getTodayString(),
  dailyChallenges: generateDailyChallenges(getTodayString()),
  dailyProgress: {}, // { challengeId: { current, completed } }
  completedDailyChallenges: [],

  // Weekly goals
  currentWeek: getWeekString(),
  weeklyProgress: {}, // { goalId: { current, milestoneIndex } }
  completedWeeklyGoals: [],

  // Streaks
  dailyChallengeStreak: 0,
  bestDailyChallengeStreak: 0,
  weeklyGoalStreak: 0,
  bestWeeklyGoalStreak: 0,

  // History
  challengeHistory: [], // Array of { date, completed, xpEarned }

  // Stats
  totalChallengesCompleted: 0,
  totalChallengeXpEarned: 0,
}

export const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    // Check and refresh daily challenges if date changed
    refreshDailyChallenges: (state) => {
      const today = getTodayString()
      if (state.currentDate !== today) {
        // Check if previous day had all challenges completed
        const prevAllCompleted = state.dailyChallenges.every(
          c => state.completedDailyChallenges.includes(c.id)
        )

        // Update streak
        if (prevAllCompleted) {
          state.dailyChallengeStreak += 1
          if (state.dailyChallengeStreak > state.bestDailyChallengeStreak) {
            state.bestDailyChallengeStreak = state.dailyChallengeStreak
          }
        } else {
          state.dailyChallengeStreak = 0
        }

        // Save history
        state.challengeHistory.push({
          date: state.currentDate,
          completed: state.completedDailyChallenges.length,
          total: state.dailyChallenges.length,
        })

        // Generate new challenges
        state.currentDate = today
        state.dailyChallenges = generateDailyChallenges(today)
        state.dailyProgress = {}
        state.completedDailyChallenges = []
      }
    },

    // Check and refresh weekly goals if week changed
    refreshWeeklyGoals: (state) => {
      const thisWeek = getWeekString()
      if (state.currentWeek !== thisWeek) {
        // Check if previous week had all goals completed
        const prevAllCompleted = state.completedWeeklyGoals.length > 0

        if (prevAllCompleted) {
          state.weeklyGoalStreak += 1
          if (state.weeklyGoalStreak > state.bestWeeklyGoalStreak) {
            state.bestWeeklyGoalStreak = state.weeklyGoalStreak
          }
        } else {
          state.weeklyGoalStreak = 0
        }

        state.currentWeek = thisWeek
        state.weeklyProgress = {}
        state.completedWeeklyGoals = []
      }
    },

    // Update progress for a daily challenge
    updateDailyChallengeProgress: (state, action) => {
      const { challengeId, current } = action.payload
      if (!state.dailyProgress[challengeId]) {
        state.dailyProgress[challengeId] = { current: 0, completed: false }
      }
      state.dailyProgress[challengeId].current = current
    },

    // Complete a daily challenge
    completeDailyChallenge: (state, action) => {
      const challengeId = action.payload
      if (!state.completedDailyChallenges.includes(challengeId)) {
        state.completedDailyChallenges.push(challengeId)
        state.totalChallengesCompleted += 1

        if (state.dailyProgress[challengeId]) {
          state.dailyProgress[challengeId].completed = true
        }
      }
    },

    // Update progress for a weekly goal
    updateWeeklyGoalProgress: (state, action) => {
      const { goalId, current } = action.payload
      if (!state.weeklyProgress[goalId]) {
        state.weeklyProgress[goalId] = { current: 0, milestoneIndex: 0 }
      }
      state.weeklyProgress[goalId].current = current
    },

    // Complete a weekly goal
    completeWeeklyGoal: (state, action) => {
      const goalId = action.payload
      if (!state.completedWeeklyGoals.includes(goalId)) {
        state.completedWeeklyGoals.push(goalId)
      }
    },

    // Track XP earned from challenges
    addChallengeXp: (state, action) => {
      state.totalChallengeXpEarned += action.payload
    },

    // Manual reset (from dorm room)
    resetDailyChallenges: (state) => {
      state.dailyProgress = {}
      state.completedDailyChallenges = []
      state.dailyChallenges = generateDailyChallenges(state.currentDate)
    },

    // Load saved state
    loadChallengeState: (state, action) => {
      return { ...state, ...action.payload }
    },
  },
})

export const {
  refreshDailyChallenges,
  refreshWeeklyGoals,
  updateDailyChallengeProgress,
  completeDailyChallenge,
  updateWeeklyGoalProgress,
  completeWeeklyGoal,
  addChallengeXp,
  resetDailyChallenges,
  loadChallengeState,
} = challengeSlice.actions

export default challengeSlice.reducer
