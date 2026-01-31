import { createSlice } from '@reduxjs/toolkit'
import { generateMap } from '../utils/mapGenerator'
import { ZONES, getZone } from '../data/zones'

// Initial map generation for campus
const INITIAL_WIDTH = 100
const INITIAL_HEIGHT = 100

// Always generate fresh map on load to ensure buildings are placed
const initialCampusGrid = generateMap(INITIAL_WIDTH, INITIAL_HEIGHT)

const initialState = {
    // Current zone info
    currentZone: 'campus',
    grid: initialCampusGrid,
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT,
    isGenerated: true,
    mapVersion: 3, // Increment this when map format changes

    // Store campus grid separately so we can return to it
    campusGrid: initialCampusGrid,
    campusWidth: INITIAL_WIDTH,
    campusHeight: INITIAL_HEIGHT,

    // Transition state
    isTransitioning: false,
    transitionType: null, // 'enter' or 'exit'
    targetZoneName: '',
}

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setMap: (state, action) => {
            state.grid = action.payload.grid
            state.width = action.payload.width
            state.height = action.payload.height
            state.isGenerated = true
        },
        updateTile: (state, action) => {
            const { x, y, type } = action.payload
            if (x >= 0 && x < state.width && y >= 0 && y < state.height) {
                state.grid[y][x] = type
            }
        },
        regenerateMap: (state) => {
            const newGrid = generateMap(state.width, state.height)
            state.grid = newGrid
            if (state.currentZone === 'campus') {
                state.campusGrid = newGrid
            }
        },
        // Start zone transition (triggers animation)
        startZoneTransition: (state, action) => {
            const { targetZone, transitionType } = action.payload
            const zone = getZone(targetZone)
            state.isTransitioning = true
            state.transitionType = transitionType
            state.targetZoneName = zone.name
        },
        // Complete the zone change (after animation)
        completeZoneTransition: (state, action) => {
            const { targetZone } = action.payload
            const zone = getZone(targetZone)

            state.currentZone = targetZone

            if (targetZone === 'campus') {
                // Return to campus
                state.grid = state.campusGrid
                state.width = state.campusWidth
                state.height = state.campusHeight
            } else if (zone.map) {
                // Load interior zone
                state.grid = zone.map
                state.width = zone.width
                state.height = zone.height
            }

            state.isTransitioning = false
            state.transitionType = null
        },
        // Cancel transition (in case of error)
        cancelTransition: (state) => {
            state.isTransitioning = false
            state.transitionType = null
            state.targetZoneName = ''
        },
    },
})

export const {
    setMap,
    updateTile,
    regenerateMap,
    startZoneTransition,
    completeZoneTransition,
    cancelTransition,
} = mapSlice.actions

export default mapSlice.reducer
