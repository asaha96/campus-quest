import { memo } from 'react'
import { TILE_SIZE, TILES } from '../../data/maps'

import tilesetBox from '../../assets/tileset.png'

// Map tile types to their index in the tileset (assuming horizontal strip)
// 0: Grass, 1: Path, 2: Wall, 3: Door, 4: Water, 5: Tree
const TILE_OFFSETS = {
  [TILES.GRASS]: 0,
  [TILES.PATH]: 1,
  [TILES.WALL]: 2,
  [TILES.DOOR]: 3,
  [TILES.WATER]: 4,
  [TILES.TREE]: 5,
}

const FALLBACK_COLORS = {
  [TILES.GRASS]: '#4caf50',
  [TILES.PATH]: '#795548',
  [TILES.WALL]: '#9e9e9e',
  [TILES.DOOR]: '#795548',
  [TILES.WATER]: '#2196f3',
  [TILES.TREE]: '#2e7d32',
}

const MapTile = memo(({ type, x, y }) => {
  const tileIndex = TILE_OFFSETS[type] ?? 0

  // Tileset is 1024x1024 with 6 tiles (170px each) horizontally centered
  // Tiles are vertically centered around y=427 with height ~170px
  // We scale to display 32px tiles: 170/32 ≈ 5.3125
  // Total width needed: 6 * 32 = 192px after scaling
  // Original image scaled: 1024 / 5.3125 ≈ 193px (we use 192 for clean math)
  const SCALE_FACTOR = 32 / 170
  const SCALED_WIDTH = 1024 * SCALE_FACTOR  // ~195px
  const SCALED_HEIGHT = 1024 * SCALE_FACTOR // ~195px

  // Tiles start at approximately x=6 in original, centered vertically at y=427
  // After scaling: y offset = 427 * SCALE_FACTOR ≈ 80px
  // x offset for first tile = 6 * SCALE_FACTOR ≈ 1px
  const X_START = 1
  const Y_OFFSET = 80

  return (
    <div
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        backgroundColor: FALLBACK_COLORS[type] || 'pink',
        backgroundImage: `url(${tilesetBox})`,
        backgroundPosition: `-${X_START + tileIndex * TILE_SIZE}px -${Y_OFFSET}px`,
        backgroundSize: `${SCALED_WIDTH}px ${SCALED_HEIGHT}px`,
        imageRendering: 'pixelated',
        gridColumnStart: x + 1,
        gridRowStart: y + 1,
      }}
    />
  )
})

export default MapTile
