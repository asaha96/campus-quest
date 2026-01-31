import { configureStore } from '@reduxjs/toolkit'
import gameStateReducer from './features/gameStateSlice'
import playerReducer from './features/playerSlice'

// Load saved game from localStorage
const loadSavedGame = () => {
  try {
    const saved = localStorage.getItem('campus-quest-save')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load saved game:', e)
  }
  return undefined
}

const preloadedState = loadSavedGame()

export const store = configureStore({
  reducer: {
    gameState: gameStateReducer,
    player: playerReducer,
  },
  preloadedState,
})

// Subscribe to store changes and save to localStorage
let saveTimeout
store.subscribe(() => {
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    const state = store.getState()
    localStorage.setItem('campus-quest-save', JSON.stringify(state))
  }, 1000) // Debounce saves by 1 second
})

export default store
