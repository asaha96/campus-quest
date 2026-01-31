import { useSelector } from 'react-redux'
import { TILE_SIZE } from '../../data/maps'

const directionEmoji = {
  up: '⬆️',
  down: '⬇️',
  left: '⬅️',
  right: '➡️',
}

export default function Player() {
  const { position, direction, isMoving } = useSelector(state => state.player)

  return (
    <div
      className="absolute z-20 flex items-center justify-center transition-all duration-150 ease-linear"
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        left: position.x * TILE_SIZE,
        top: position.y * TILE_SIZE,
        fontSize: '24px',
        transform: isMoving ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      <div className="relative">
        {/* Player character */}
        <span className="select-none" role="img" aria-label="player">
          🧑‍🎓
        </span>
        {/* Direction indicator (subtle) */}
        <span
          className="absolute -bottom-1 -right-1 text-xs opacity-50"
          style={{ fontSize: '10px' }}
        >
          {directionEmoji[direction]}
        </span>
      </div>
    </div>
  )
}
