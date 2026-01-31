import { TILES } from './maps'

// Zone definitions with interior maps
// Each zone has: map grid, spawn point, exit point, NPCs, and interactables

export const ZONES = {
  campus: {
    id: 'campus',
    name: 'Campus Grounds',
    isExterior: true,
    // Campus uses the procedurally generated map from mapSlice
    spawnPoint: { x: 50, y: 50 },
    music: 'campus',
  },

  library: {
    id: 'library',
    name: 'University Library',
    isExterior: false,
    width: 15,
    height: 12,
    spawnPoint: { x: 7, y: 10 }, // Near entrance
    exitPoint: { x: 7, y: 11, targetZone: 'campus', targetPos: { x: 41, y: 44 } }, // Below library door
    map: [
      // Row 0 - Top wall
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      // Row 1 - Bookshelves
      [2, 5, 5, 1, 5, 5, 1, 1, 1, 5, 5, 1, 5, 5, 2],
      // Row 2 - Between shelves
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 3 - More shelves
      [2, 5, 5, 1, 5, 5, 1, 1, 1, 5, 5, 1, 5, 5, 2],
      // Row 4 - Open area
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 5 - Study desks (using path as floor)
      [2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2],
      // Row 6 - Desk area
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 7 - Reception desk
      [2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2],
      // Row 8 - Open floor
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 9 - Near entrance
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 10 - Entrance area
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 11 - Bottom wall with door
      [2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2],
    ],
    npcs: [
      { x: 7, y: 7, emoji: '👩‍🏫', name: 'Librarian Ada', dialogueTree: 'librarian_ada_default' },
    ],
    interactables: [
      { x: 3, y: 5, type: 'STUDY_DESK', emoji: '📚', name: 'Study Desk' },
      { x: 11, y: 5, type: 'STUDY_DESK', emoji: '📚', name: 'Study Desk' },
      { x: 1, y: 1, type: 'BOOKSHELF', emoji: '📖', name: 'Ancient Tomes' },
      { x: 13, y: 1, type: 'BOOKSHELF', emoji: '📖', name: 'Science Section' },
    ],
  },

  gym: {
    id: 'gym',
    name: 'Campus Gym',
    isExterior: false,
    width: 16,
    height: 12,
    spawnPoint: { x: 8, y: 10 },
    exitPoint: { x: 8, y: 11, targetZone: 'campus', targetPos: { x: 41, y: 62 } }, // Below gym door
    map: [
      // Row 0 - Top wall
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      // Row 1 - Weight rack area
      [2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
      // Row 2 - Equipment
      [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
      // Row 3 - Open floor
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 4 - Treadmills (represented by path tiles)
      [2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2],
      // Row 5 - Open area
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 6 - Mats area
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 7 - Bench area
      [2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2],
      // Row 8 - Open floor
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 9 - Locker area entrance
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 10 - Near door
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 11 - Bottom wall with door
      [2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2],
    ],
    npcs: [
      { x: 8, y: 3, emoji: '🏋️', name: 'Coach Thunder', dialogueTree: 'coach_thunder_default' },
    ],
    interactables: [
      { x: 2, y: 4, type: 'TREADMILL', emoji: '🏃', name: 'Treadmill' },
      { x: 6, y: 4, type: 'TREADMILL', emoji: '🏃', name: 'Treadmill' },
      { x: 9, y: 4, type: 'TREADMILL', emoji: '🏃', name: 'Treadmill' },
      { x: 13, y: 4, type: 'TREADMILL', emoji: '🏃', name: 'Treadmill' },
      { x: 2, y: 7, type: 'WEIGHTS', emoji: '🏋️', name: 'Weight Bench' },
      { x: 13, y: 7, type: 'WEIGHTS', emoji: '🏋️', name: 'Weight Bench' },
    ],
  },

  cafe: {
    id: 'cafe',
    name: 'Cozy Cafe',
    isExterior: false,
    width: 14,
    height: 10,
    spawnPoint: { x: 7, y: 8 },
    exitPoint: { x: 7, y: 9, targetZone: 'campus', targetPos: { x: 58, y: 43 } }, // Below cafe door
    map: [
      // Row 0 - Top wall with counter
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      // Row 1 - Behind counter
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      // Row 2 - Counter
      [2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2],
      // Row 3 - Ordering area
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 4 - Tables
      [2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2],
      // Row 5 - Between tables
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 6 - More tables
      [2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2],
      // Row 7 - Open area
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 8 - Near entrance
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 9 - Bottom wall with door
      [2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2],
    ],
    npcs: [
      { x: 7, y: 2, emoji: '☕', name: 'Barista Blitz', dialogueTree: 'barista_blitz_default' },
    ],
    interactables: [
      { x: 2, y: 4, type: 'TABLE', emoji: '🪑', name: 'Cozy Table' },
      { x: 5, y: 4, type: 'TABLE', emoji: '🪑', name: 'Window Seat' },
      { x: 8, y: 4, type: 'TABLE', emoji: '🪑', name: 'Corner Booth' },
      { x: 11, y: 4, type: 'TABLE', emoji: '🪑', name: 'Study Spot' },
      { x: 5, y: 2, type: 'MENU', emoji: '📋', name: 'Menu Board' },
    ],
  },

  dorm: {
    id: 'dorm',
    name: 'Student Dorm',
    isExterior: false,
    width: 12,
    height: 10,
    spawnPoint: { x: 6, y: 8 },
    exitPoint: { x: 6, y: 9, targetZone: 'campus', targetPos: { x: 59, y: 63 } }, // Below dorm door
    map: [
      // Row 0 - Top wall
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      // Row 1 - Bed area
      [2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2],
      // Row 2 - Bed
      [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
      // Row 3 - Open floor
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 4 - Desk area
      [2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2],
      // Row 5 - Open floor
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 6 - Closet/storage
      [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
      // Row 7 - Open floor
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 8 - Near door
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      // Row 9 - Bottom wall with door
      [2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2],
    ],
    npcs: [
      { x: 6, y: 2, emoji: '😴', name: 'RA Restless', dialogueTree: 'ra_restless_default' },
    ],
    interactables: [
      { x: 4, y: 1, type: 'BED', emoji: '🛏️', name: 'Your Bed' },
      { x: 2, y: 4, type: 'DESK', emoji: '💻', name: 'Study Desk' },
      { x: 9, y: 4, type: 'DESK', emoji: '📚', name: 'Bookshelf' },
      { x: 1, y: 6, type: 'CLOSET', emoji: '🚪', name: 'Closet' },
      { x: 10, y: 6, type: 'CLOSET', emoji: '🚪', name: 'Bathroom' },
    ],
  },
}

// Get zone by ID
export const getZone = (zoneId) => {
  return ZONES[zoneId] || ZONES.campus
}

// Check if a position is an exit in the current zone
export const getExitAt = (zoneId, x, y) => {
  const zone = ZONES[zoneId]
  if (!zone || !zone.exitPoint) return null

  if (zone.exitPoint.x === x && zone.exitPoint.y === y) {
    return zone.exitPoint
  }
  return null
}

// Get NPC at position
export const getNpcAt = (zoneId, x, y) => {
  const zone = ZONES[zoneId]
  if (!zone || !zone.npcs) return null

  return zone.npcs.find(npc => npc.x === x && npc.y === y) || null
}

// Get interactable at position
export const getInteractableAt = (zoneId, x, y) => {
  const zone = ZONES[zoneId]
  if (!zone || !zone.interactables) return null

  return zone.interactables.find(obj => obj.x === x && obj.y === y) || null
}

// Door coordinates on campus that lead to zones
// These are calculated based on map center (50, 50 for a 100x100 map)
const MAP_CENTER = { x: 50, y: 50 }

// Building offsets from center (must match mapGenerator.js)
const BUILDING_CONFIG = {
  library: { relX: -14, relY: -12, doorOffsetX: 5, height: 6 },
  gym: { relX: -14, relY: 6, doorOffsetX: 5, height: 6 },
  cafe: { relX: 4, relY: -12, doorOffsetX: 4, height: 5 },
  dorm: { relX: 4, relY: 6, doorOffsetX: 5, height: 7 },
}

// Calculate door positions dynamically
const calculateDoorPositions = () => {
  const doors = {}
  Object.entries(BUILDING_CONFIG).forEach(([name, config]) => {
    const doorX = MAP_CENTER.x + config.relX + config.doorOffsetX
    const doorY = MAP_CENTER.y + config.relY + config.height - 1
    doors[`${doorX},${doorY}`] = name
  })
  return doors
}

export const CAMPUS_DOORS = calculateDoorPositions()

// Get zone entrance from campus door position
export const getZoneFromDoor = (x, y) => {
  const key = `${x},${y}`
  return CAMPUS_DOORS[key] || null
}

// Get door position for a specific zone
export const getDoorPositionForZone = (zoneName) => {
  const config = BUILDING_CONFIG[zoneName]
  if (!config) return null
  return {
    x: MAP_CENTER.x + config.relX + config.doorOffsetX,
    y: MAP_CENTER.y + config.relY + config.height - 1,
  }
}
