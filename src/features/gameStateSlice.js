import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentZone: 'campus',
  isMenuOpen: false,
  activeModal: null, // 'LIBRARY', 'GYM', 'CAFE', null
  collectedSprites: [],
  dailyStats: {
    focusMinutes: 0,
    workoutsLogged: 0,
    spritesCollected: 0,
  },
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
      }
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
} = gameStateSlice.actions

export default gameStateSlice.reducer
