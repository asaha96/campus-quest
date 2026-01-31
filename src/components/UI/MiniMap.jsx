import { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { closeModal } from '../../features/gameStateSlice'
import { teleportPlayer } from '../../features/playerSlice'
import { TILES } from '../../data/maps'
import { getDoorPositionForZone } from '../../data/zones'
import { MapPin, X } from 'lucide-react'

// Zone locations for teleportation (positions in front of buildings)
const getZoneLocations = () => {
  const libraryDoor = getDoorPositionForZone('library')
  const gymDoor = getDoorPositionForZone('gym')
  const cafeDoor = getDoorPositionForZone('cafe')
  const dormDoor = getDoorPositionForZone('dorm')

  return {
    campus: { x: 50, y: 50, name: 'Campus Center', emoji: '🏫' },
    library: { x: libraryDoor?.x || 41, y: (libraryDoor?.y || 43) + 1, name: 'Library', emoji: '📚' },
    gym: { x: gymDoor?.x || 41, y: (gymDoor?.y || 61) + 1, name: 'Gym', emoji: '🏋️' },
    cafe: { x: cafeDoor?.x || 58, y: (cafeDoor?.y || 42) + 1, name: 'Cafe', emoji: '☕' },
    dorm: { x: dormDoor?.x || 59, y: (dormDoor?.y || 62) + 1, name: 'Dorm', emoji: '🏠' },
  }
}

const ZONE_LOCATIONS = getZoneLocations()

const TILE_COLORS = {
  [TILES.GRASS]: '#4ade80',
  [TILES.PATH]: '#a8a29e',
  [TILES.WALL]: '#78716c',
  [TILES.DOOR]: '#fbbf24',
  [TILES.WATER]: '#38bdf8',
  [TILES.TREE]: '#16a34a',
}

export default function MiniMap({ onClose }) {
  const dispatch = useDispatch()
  const canvasRef = useRef(null)
  const mapState = useSelector((state) => state.map || {})
  const playerState = useSelector((state) => state.player || {})

  // Safely destructure with defaults
  const grid = mapState.grid || []
  const width = mapState.width || 0
  const height = mapState.height || 0
  const position = playerState.position || { x: 0, y: 0 }

  const SCALE = 2 // 2px per tile for canvas
  const canvasWidth = width * SCALE
  const canvasHeight = height * SCALE

  // Draw minimap on canvas (much faster than divs)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !grid) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Draw tiles
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tile = grid[y]?.[x]
        ctx.fillStyle = TILE_COLORS[tile] || '#000'
        ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
      }
    }

    // Draw player position
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(position.x * SCALE + SCALE/2, position.y * SCALE + SCALE/2, SCALE * 2, 0, Math.PI * 2)
    ctx.fill()

    // Draw building markers
    Object.entries(ZONE_LOCATIONS).forEach(([zone, data]) => {
      if (zone !== 'campus') {
        ctx.fillStyle = '#fbbf24'
        ctx.beginPath()
        ctx.arc(data.x * SCALE, data.y * SCALE, SCALE * 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
    })
  }, [grid, width, height, position, canvasWidth, canvasHeight])

  const handleTeleport = (zone) => {
    const location = ZONE_LOCATIONS[zone]
    if (location) {
      dispatch(teleportPlayer({ x: location.x, y: location.y }))
      dispatch(closeModal())
    }
  }

  return (
    <div className="text-center max-h-[80vh] overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gba-light flex items-center gap-2">
          <MapPin size={18} /> Campus Map
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gba-wall/50 rounded transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <p className="text-[10px] text-gba-light/70 mb-4">
        Click a location to fast travel
      </p>

      {/* Canvas minimap */}
      <div className="relative mx-auto border-2 border-gba-path rounded overflow-auto bg-gba-dark"
        style={{ maxWidth: '100%', maxHeight: '180px' }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* Teleport destinations - all unlocked for easy testing */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {Object.entries(ZONE_LOCATIONS).map(([zone, data]) => (
          <button
            key={zone}
            onClick={() => handleTeleport(zone)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all bg-gba-path/20 hover:bg-gba-path/40 text-gba-light border border-gba-path/50"
          >
            <span className="text-lg">{data.emoji}</span>
            <span>{data.name}</span>
          </button>
        ))}
      </div>

      <p className="mt-3 text-[8px] text-gba-light/50">
        🔴 = You | 🟡 = Buildings
      </p>
    </div>
  )
}
