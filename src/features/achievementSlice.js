import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // Unlocked achievements
  unlockedAchievements: [], // Array of achievement IDs

  // Pending notifications (achievements to show popup for)
  pendingNotifications: [],

  // Currently showing notification
  currentNotification: null,

  // Stats for achievement tracking
  stats: {
    focusSessions: 0,
    focusMinutes: 0,
    spritesCaught: 0,
    zonesVisited: [],
    questsCompleted: 0,
    chaptersCompleted: 0,
    friendsAdded: 0,
    challengeStreak: 0,
  },

  // Total XP earned from achievements
  totalAchievementXp: 0,
}

export const achievementSlice = createSlice({
  name: 'achievement',
  initialState,
  reducers: {
    // Unlock an achievement
    unlockAchievement: (state, action) => {
      const { achievementId, xpReward } = action.payload

      if (!state.unlockedAchievements.includes(achievementId)) {
        state.unlockedAchievements.push(achievementId)
        state.pendingNotifications.push(achievementId)
        state.totalAchievementXp += xpReward || 0
      }
    },

    // Show next pending notification
    showNextNotification: (state) => {
      if (state.pendingNotifications.length > 0) {
        state.currentNotification = state.pendingNotifications.shift()
      }
    },

    // Clear current notification
    clearNotification: (state) => {
      state.currentNotification = null
    },

    // Update tracking stats
    updateAchievementStats: (state, action) => {
      const { stat, value, increment = false } = action.payload

      if (stat in state.stats) {
        if (Array.isArray(state.stats[stat])) {
          // For array stats (like zonesVisited)
          if (!state.stats[stat].includes(value)) {
            state.stats[stat].push(value)
          }
        } else if (increment) {
          state.stats[stat] += value
        } else {
          state.stats[stat] = value
        }
      }
    },

    // Bulk update stats
    syncStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload }
    },

    // Load saved state
    loadAchievementState: (state, action) => {
      return { ...state, ...action.payload }
    },
  },
})

export const {
  unlockAchievement,
  showNextNotification,
  clearNotification,
  updateAchievementStats,
  syncStats,
  loadAchievementState,
} = achievementSlice.actions

export default achievementSlice.reducer
