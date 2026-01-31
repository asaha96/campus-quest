import { createSlice } from '@reduxjs/toolkit'

// Zone coordinates for teleportation
export const ZONE_LOCATIONS = {
  campus: { x: 50, y: 50 },
  library: { x: 4, y: 5 },
  gym: { x: 4, y: 11 },
  cafe: { x: 15, y: 5 },
  dorm: { x: 15, y: 11 },
}

const initialState = {
  currentZone: 'campus',
  isMenuOpen: false,
  activeModal: null, // 'LIBRARY', 'GYM', 'CAFE', 'MINIMAP', etc.
  collectedSprites: [],
  dailyStats: {
    focusMinutes: 0,
    workoutsLogged: 0,
    spritesCollected: 0,
    pagesRead: 0,
    waterGlasses: 0,  // Target: 8 glasses
    sleepHours: 0,
  },
  habitStreaks: {
    focus: { current: 0, best: 0 },
    workout: { current: 0, best: 0 },
    reading: { current: 0, best: 0 },
    hydration: { current: 0, best: 0 },
    sleep: { current: 0, best: 0 },
  },
  lastActivityDate: null,  // For tracking streaks
  xp: 0,
  level: 1,
  unlockedAreas: ['campus', 'dorm'],
  toastMessage: null,
}

export const gameStateSlice = createSlice({
  name: 'gameState',
  initialState,
  reducers: {
    changeZone: (state, action) => {
      state.currentZone = action.payload
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen
    },
    openModal: (state, action) => {
      state.activeModal = action.payload
    },
    closeModal: (state) => {
      state.activeModal = null
    },
    addSprite: (state, action) => {
      if (!state.collectedSprites.includes(action.payload)) {
        state.collectedSprites.push(action.payload)
        state.dailyStats.spritesCollected += 1
      }
    },
    updateStat: (state, action) => {
      const { stat, value } = action.payload
      if (stat in state.dailyStats) {
        state.dailyStats[stat] += value
      }
    },
    addXp: (state, action) => {
      state.xp += action.payload
      // Level up every 100 XP
      const newLevel = Math.floor(state.xp / 100) + 1
      if (newLevel > state.level) {
        state.level = newLevel
        // Unlock new areas based on level
        if (newLevel >= 2 && !state.unlockedAreas.includes('library')) {
          state.unlockedAreas.push('library')
        }
        if (newLevel >= 3 && !state.unlockedAreas.includes('gym')) {
          state.unlockedAreas.push('gym')
        }
        if (newLevel >= 5 && !state.unlockedAreas.includes('cafe')) {
          state.unlockedAreas.push('cafe')
        }
      }
    },
    showToast: (state, action) => {
      state.toastMessage = action.payload
    },
    hideToast: (state) => {
      state.toastMessage = null
    },
    resetDailyStats: (state) => {
      state.dailyStats = {
        focusMinutes: 0,
        workoutsLogged: 0,
        spritesCollected: 0,
        pagesRead: 0,
        waterGlasses: 0,
        sleepHours: 0,
      }
    },
    addWaterGlass: (state) => {
      if (state.dailyStats.waterGlasses < 8) {
        state.dailyStats.waterGlasses += 1
      }
    },
    logReading: (state, action) => {
      state.dailyStats.pagesRead += action.payload
    },
    logSleep: (state, action) => {
      state.dailyStats.sleepHours = action.payload
    },
    updateStreak: (state, action) => {
      const { habit, increment } = action.payload
      if (state.habitStreaks[habit]) {
        if (increment) {
          state.habitStreaks[habit].current += 1
          if (state.habitStreaks[habit].current > state.habitStreaks[habit].best) {
            state.habitStreaks[habit].best = state.habitStreaks[habit].current
          }
        } else {
          state.habitStreaks[habit].current = 0
        }
      }
    },
    setLastActivityDate: (state, action) => {
      state.lastActivityDate = action.payload
    },
  },
})

export const {
  changeZone,
  toggleMenu,
  openModal,
  closeModal,
  addSprite,
  updateStat,
  addXp,
  showToast,
  hideToast,
  resetDailyStats,
  addWaterGlass,
  logReading,
  logSleep,
  updateStreak,
  setLastActivityDate,
} = gameStateSlice.actions

export default gameStateSlice.reducer
