import { TILES, TILE_SIZE } from '../../data/maps'

const tileStyles = {
  [TILES.GRASS]: 'bg-gba-grass',
  [TILES.PATH]: 'bg-gba-path',
  [TILES.WALL]: 'bg-gba-wall',
  [TILES.DOOR]: 'bg-gba-door',
  [TILES.WATER]: 'bg-gba-water',
  [TILES.TREE]: 'bg-green-800',
}

const tileDecorations = {
  [TILES.GRASS]: '🌱',
  [TILES.TREE]: '🌲',
  [TILES.DOOR]: '🚪',
  [TILES.WATER]: '💧',
}

export default function MapTile({ type, x, y }) {
  const baseStyle = tileStyles[type] || 'bg-gray-500'
  const decoration = tileDecorations[type]
  const showDecoration = decoration && (
    type === TILES.TREE ||
    type === TILES.DOOR ||
    (type === TILES.GRASS && Math.random() > 0.85) ||
    (type === TILES.WATER && x % 3 === 0 && y % 2 === 0)
  )

  return (
    <div
      className={`${baseStyle} flex items-center justify-center text-xs select-none`}
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        fontSize: type === TILES.TREE ? '20px' : '12px',
      }}
      data-x={x}
      data-y={y}
    >
      {showDecoration && decoration}
    </div>
  )
}
