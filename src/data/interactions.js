// Interaction map - coordinates where special events occur
// Format: "x,y": { type: string, name: string }

export const interactions = {
  // Library doors (top left building)
  "4,4": { type: 'LIBRARY', name: 'University Library' },
  // Gym door (bottom left building)
  "4,10": { type: 'GYM', name: 'Campus Gym' },
  // Cafe door (top right building)
  "15,4": { type: 'CAFE', name: 'Cozy Cafe' },
  // Second building door (bottom right)
  "15,10": { type: 'DORM', name: 'Student Dorm' },
}

// Map door coordinates to zone types for boss battles
export const DOOR_ZONES = {
  '4,4': 'LIBRARY',
  '4,10': 'GYM',
  '15,4': 'CAFE',
  '15,10': 'DORM',
}

export const getInteraction = (x, y) => {
  const key = `${x},${y}`
  return interactions[key] || null
}

export const getZoneFromCoords = (x, y) => {
  const key = `${x},${y}`
  return DOOR_ZONES[key] || null
}
