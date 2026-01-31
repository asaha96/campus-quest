import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // Playback state
  isPlaying: false,
  currentCutscene: null,
  currentSceneIndex: 0,

  // Camera control
  cameraPosition: { x: 50, y: 50 },
  cameraOverride: false,
  cameraZoom: 1,

  // Visual effects
  fadeOpacity: 0, // 0 = fully visible, 1 = fully black
  shakeIntensity: 0,
  shakeOffset: { x: 0, y: 0 },

  // Text display
  displayText: null,
  textStyle: null,

  // Characters spawned during cutscene
  cutsceneCharacters: [], // { id, position, direction }

  // Skip state
  canSkip: true,
  showSkipPrompt: false,

  // Queued cutscenes
  cutsceneQueue: [],

  // History of played cutscenes
  playedCutscenes: [],
}

export const cutsceneSlice = createSlice({
  name: 'cutscene',
  initialState,
  reducers: {
    // Start a cutscene
    startCutscene: (state, action) => {
      const { cutsceneId, canSkip = true } = action.payload
      state.isPlaying = true
      state.currentCutscene = cutsceneId
      state.currentSceneIndex = 0
      state.canSkip = canSkip
      state.cameraOverride = true
      state.fadeOpacity = 1 // Start with fade in
      state.displayText = null
      state.cutsceneCharacters = []
      if (!state.playedCutscenes.includes(cutsceneId)) {
        state.playedCutscenes.push(cutsceneId)
      }
    },

    // Advance to next scene
    advanceScene: (state) => {
      state.currentSceneIndex += 1
    },

    // End cutscene
    endCutscene: (state) => {
      state.isPlaying = false
      state.currentCutscene = null
      state.currentSceneIndex = 0
      state.cameraOverride = false
      state.fadeOpacity = 0
      state.shakeIntensity = 0
      state.shakeOffset = { x: 0, y: 0 }
      state.displayText = null
      state.textStyle = null
      state.cutsceneCharacters = []
      state.showSkipPrompt = false

      // Check for queued cutscenes
      if (state.cutsceneQueue.length > 0) {
        const next = state.cutsceneQueue.shift()
        state.isPlaying = true
        state.currentCutscene = next
        state.currentSceneIndex = 0
        state.cameraOverride = true
      }
    },

    // Skip current cutscene
    skipCutscene: (state) => {
      if (state.canSkip) {
        state.isPlaying = false
        state.currentCutscene = null
        state.currentSceneIndex = 0
        state.cameraOverride = false
        state.fadeOpacity = 0
        state.shakeIntensity = 0
        state.displayText = null
        state.cutsceneCharacters = []
      }
    },

    // Queue a cutscene to play after current one
    queueCutscene: (state, action) => {
      state.cutsceneQueue.push(action.payload)
    },

    // Camera controls
    setCameraPosition: (state, action) => {
      state.cameraPosition = action.payload
    },

    setCameraZoom: (state, action) => {
      state.cameraZoom = action.payload
    },

    // Visual effects
    setFadeOpacity: (state, action) => {
      state.fadeOpacity = action.payload
    },

    setShakeIntensity: (state, action) => {
      state.shakeIntensity = action.payload
    },

    setShakeOffset: (state, action) => {
      state.shakeOffset = action.payload
    },

    // Text display
    setDisplayText: (state, action) => {
      const { text, style } = action.payload
      state.displayText = text
      state.textStyle = style
    },

    clearDisplayText: (state) => {
      state.displayText = null
      state.textStyle = null
    },

    // Character management
    spawnCutsceneCharacter: (state, action) => {
      const { characterId, position, direction = 'down' } = action.payload
      // Remove existing character with same ID
      state.cutsceneCharacters = state.cutsceneCharacters.filter(c => c.id !== characterId)
      state.cutsceneCharacters.push({ id: characterId, position, direction })
    },

    moveCutsceneCharacter: (state, action) => {
      const { characterId, position, direction } = action.payload
      const char = state.cutsceneCharacters.find(c => c.id === characterId)
      if (char) {
        if (position) char.position = position
        if (direction) char.direction = direction
      }
    },

    removeCutsceneCharacter: (state, action) => {
      state.cutsceneCharacters = state.cutsceneCharacters.filter(
        c => c.id !== action.payload
      )
    },

    // Skip prompt
    showSkipPrompt: (state) => {
      state.showSkipPrompt = true
    },

    hideSkipPrompt: (state) => {
      state.showSkipPrompt = false
    },

    // Load state
    loadCutsceneState: (state, action) => {
      return { ...state, ...action.payload, isPlaying: false }
    },
  },
})

export const {
  startCutscene,
  advanceScene,
  endCutscene,
  skipCutscene,
  queueCutscene,
  setCameraPosition,
  setCameraZoom,
  setFadeOpacity,
  setShakeIntensity,
  setShakeOffset,
  setDisplayText,
  clearDisplayText,
  spawnCutsceneCharacter,
  moveCutsceneCharacter,
  removeCutsceneCharacter,
  showSkipPrompt,
  hideSkipPrompt,
  loadCutsceneState,
} = cutsceneSlice.actions

export default cutsceneSlice.reducer
