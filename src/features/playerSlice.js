import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  position: { x: 10, y: 10 },
  direction: 'down', // 'up', 'down', 'left', 'right'
  isMoving: false,
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
  },
})

export const { movePlayer, setDirection, setMoving } = playerSlice.actions

export default playerSlice.reducer
