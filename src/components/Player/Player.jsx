import { useSelector } from 'react-redux'
import { TILE_SIZE } from '../../data/maps'
import CharacterSprite from '../Sprites/CharacterSprite'

export default function Player({ offset = { x: 0, y: 0 } }) {
  const player = useSelector(state => state.player || {})

  // Safely destructure with defaults
  const position = player.position || { x: 0, y: 0 }
  const direction = player.direction || 'down'
  const isMoving = player.isMoving || false

  // Use visualPosition for smooth movement if available, otherwise fall back to position
  // Handle case where visualPosition might be undefined from old saved state
  const renderPosition = player.visualPosition && player.visualPosition.x !== undefined
    ? player.visualPosition
    : position

  return (
    <div
      className="absolute z-20 flex items-center justify-center transition-all duration-150 ease-out"
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        left: (renderPosition.x - offset.x) * TILE_SIZE,
        top: (renderPosition.y - offset.y) * TILE_SIZE,
      }}
    >
      <CharacterSprite
        characterId="player"
        direction={direction}
        isMoving={isMoving}
        scale={1}
      />
    </div>
  )
}
