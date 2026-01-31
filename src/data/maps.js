export const MAP_WIDTH = 20
export const MAP_HEIGHT = 15
export const TILE_SIZE = 32

// Tile types
export const TILES = {
  GRASS: 0,
  PATH: 1,
  WALL: 2,
  DOOR: 3,
  WATER: 4,
  TREE: 5,
}

// Map legend:
// 0 = Grass (walkable)
// 1 = Path (walkable)
// 2 = Wall/Building (collision)
// 3 = Door (interactable)
// 4 = Water (collision)
// 5 = Tree (collision)

export const campusMap = [
  // Row 0 - Top boundary
  [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  // Row 1
  [5, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 5],
  // Row 2 - Library building top
  [5, 0, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 0, 5],
  // Row 3 - Library with door
  [5, 0, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 0, 5],
  // Row 4 - Library entrance
  [5, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 5],
  // Row 5 - Main path
  [5, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 5],
  // Row 6
  [5, 0, 0, 0, 1, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 1, 0, 0, 0, 5],
  // Row 7 - Center with pond
  [5, 0, 0, 0, 1, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 1, 0, 0, 0, 5],
  // Row 8
  [5, 0, 0, 0, 1, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 1, 0, 0, 0, 5],
  // Row 9 - Path continues
  [5, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 5],
  // Row 10 - Gym entrance
  [5, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 5],
  // Row 11 - Gym building
  [5, 0, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 0, 5],
  // Row 12 - Gym building bottom
  [5, 0, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 0, 5],
  // Row 13
  [5, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 5],
  // Row 14 - Bottom boundary
  [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
]

// Check if a tile is walkable
export const isWalkable = (x, y) => {
  if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) {
    return false
  }
  const tile = campusMap[y][x]
  return tile === TILES.GRASS || tile === TILES.PATH || tile === TILES.DOOR
}

// Get tile type at position
export const getTileAt = (x, y) => {
  if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) {
    return null
  }
  return campusMap[y][x]
}
