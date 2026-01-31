import { configureStore } from '@reduxjs/toolkit'
import gameStateReducer from './features/gameStateSlice'
import playerReducer from './features/playerSlice'
import mapReducer from './features/mapSlice'
import spriteBattleReducer from './features/spriteBattleSlice'
import storyReducer from './features/storySlice'
import cutsceneReducer from './features/cutsceneSlice'
import challengeReducer from './features/challengeSlice'
import calendarReducer from './features/calendarSlice'
import profileReducer from './features/profileSlice'
import achievementReducer from './features/achievementSlice'

const CURRENT_MAP_VERSION = 3

// Check if map state is valid (has proper grid structure)
const isMapStateValid = (mapState) => {
  if (!mapState) return false
  if (!mapState.grid || !Array.isArray(mapState.grid)) return false
  if (mapState.grid.length === 0) return false
  if (!Array.isArray(mapState.grid[0])) return false
  if (mapState.grid[0].length === 0) return false
  if (!mapState.width || !mapState.height) return false
  if (mapState.width <= 0 || mapState.height <= 0) return false
  // Also check campusGrid for when returning to campus
  if (mapState.currentZone === 'campus' && !mapState.campusGrid) return false
  return true
}

// Force map regeneration by clearing old save (for debugging)
if (typeof window !== 'undefined') {
  window.forceMapRegeneration = () => {
    const saved = localStorage.getItem('campus-quest-save')
    if (saved) {
      const state = JSON.parse(saved)
      delete state.map
      if (state.player) {
        state.player.position = { x: 50, y: 50 }
        state.player.visualPosition = { x: 50, y: 50 }
        state.player.isInputLocked = false
      }
      localStorage.setItem('campus-quest-save', JSON.stringify(state))
      console.log('Map cleared. Refresh the page to regenerate.')
    }
  }
}

// Load saved game from localStorage
const loadSavedGame = () => {
  try {
    const saved = localStorage.getItem('campus-quest-save')
    if (saved) {
      const state = JSON.parse(saved)

      // Check if map version is outdated OR map state is invalid
      // This forces a fresh map generation
      const mapOutdated = !state.map?.mapVersion || state.map.mapVersion < CURRENT_MAP_VERSION
      const mapInvalid = !isMapStateValid(state.map)

      if (mapOutdated || mapInvalid) {
        console.log('Map version outdated or invalid, regenerating fresh map...')
        // Keep player stats but regenerate map
        return {
          gameState: state.gameState,
          player: {
            ...state.player,
            position: { x: 50, y: 50 }, // Reset to center
            visualPosition: { x: 50, y: 50 },
            isInputLocked: false, // Ensure input is not locked
          },
          spriteBattle: state.spriteBattle,
          story: state.story,
          cutscene: state.cutscene ? { ...state.cutscene, isPlaying: false } : undefined,
          challenge: state.challenge,
          calendar: state.calendar,
          profile: state.profile,
          achievement: state.achievement,
          // Don't include map - let it regenerate fresh
        }
      }

      // Also ensure player input is not stuck locked
      if (state.player) {
        state.player.isInputLocked = false
        state.player.position = state.player.position || { x: 50, y: 50 }
        state.player.visualPosition = state.player.visualPosition || { x: 50, y: 50 }
      }

      // ALWAYS delete map state to force fresh generation
      // This ensures the map is never loaded from potentially corrupted save
      delete state.map

      console.log('Loaded saved game, forcing fresh map generation')
      return state
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
    map: mapReducer,
    spriteBattle: spriteBattleReducer,
    story: storyReducer,
    cutscene: cutsceneReducer,
    challenge: challengeReducer,
    calendar: calendarReducer,
    profile: profileReducer,
    achievement: achievementReducer,
  },
  preloadedState,
})

// Subscribe to store changes and save to localStorage
let saveTimeout
store.subscribe(() => {
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    const state = store.getState()
    // Don't persist battle state (transient) or active cutscene state
    const stateToSave = {
      ...state,
      spriteBattle: {
        caughtSprites: state.spriteBattle?.caughtSprites || [],
      },
      cutscene: {
        playedCutscenes: state.cutscene?.playedCutscenes || [],
        // Don't persist active cutscene state
      },
    }
    localStorage.setItem('campus-quest-save', JSON.stringify(stateToSave))
  }, 1000) // Debounce saves by 1 second
})

export default store
