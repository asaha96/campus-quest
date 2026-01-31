import { createSlice } from '@reduxjs/toolkit'

const defaultPosition = { x: 50, y: 50 } // Center of 100x100 map

const initialState = {
  position: defaultPosition,              // Logical grid position
  visualPosition: defaultPosition,        // Interpolated position for rendering
  direction: 'down',                      // 'up', 'down', 'left', 'right'
  isMoving: false,
  movementProgress: 0,                    // 0-1 progress through current move
  animationFrame: 0,                      // Current walk cycle frame (0-3)
  isInputLocked: false,                   // Prevent input during movement
  pendingDirection: null,                 // Queued input direction
}

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    movePlayer: (state, action) => {
      state.position = action.payload
    },
    setDirection: (state, action) => {
      state.direction = action.payload
    },
    setMoving: (state, action) => {
      state.isMoving = action.payload
    },
    setVisualPosition: (state, action) => {
      state.visualPosition = action.payload
    },
    setMovementProgress: (state, action) => {
      state.movementProgress = action.payload
    },
    setAnimationFrame: (state, action) => {
      state.animationFrame = action.payload
    },
    setInputLocked: (state, action) => {
      state.isInputLocked = action.payload
    },
    setPendingDirection: (state, action) => {
      state.pendingDirection = action.payload
    },
    teleportPlayer: (state, action) => {
      state.position = action.payload
      state.visualPosition = action.payload
      state.movementProgress = 0
      state.isMoving = false
      state.isInputLocked = false
      state.animationFrame = 0
    },
    startMovement: (state, action) => {
      const { targetPosition, direction } = action.payload
      state.position = targetPosition
      state.direction = direction
      state.isMoving = true
      state.isInputLocked = true
      state.movementProgress = 0
    },
    completeMovement: (state) => {
      state.visualPosition = state.position
      state.isMoving = false
      state.isInputLocked = false
      state.movementProgress = 1
      state.animationFrame = 0
    },
  },
})

export const {
  movePlayer,
  setDirection,
  setMoving,
  setVisualPosition,
  setMovementProgress,
  setAnimationFrame,
  setInputLocked,
  setPendingDirection,
  teleportPlayer,
  startMovement,
  completeMovement,
} = playerSlice.actions

export default playerSlice.reducer
