import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import MapTile from './MapTile'
import Player from '../Player/Player'
import ZoneObjects from './ZoneObjects'
import CampusObjects from './CampusObjects'
import { TILE_SIZE } from '../../data/maps'
import useDayNight from '../../hooks/useDayNight'
import { getZone } from '../../data/zones'

const VIEWPORT_WIDTH = 20
const VIEWPORT_HEIGHT = 15

export default function WorldMap() {
  const { timeOfDay, filterStyle } = useDayNight()
  const mapState = useSelector(state => state.map || {})
  const playerState = useSelector(state => state.player || {})

  // Safely destructure with defaults
  const grid = mapState.grid || []
  const width = mapState.width || 0
  const height = mapState.height || 0
  const currentZone = mapState.currentZone || 'campus'
  const position = playerState.position || { x: 0, y: 0 }
  const zone = getZone(currentZone)

  // Calculate viewport based on player position
  const viewport = useMemo(() => {
    let x = position.x - Math.floor(VIEWPORT_WIDTH / 2)
    let y = position.y - Math.floor(VIEWPORT_HEIGHT / 2)

    // Clamp to bounds
    x = Math.max(0, Math.min(width - VIEWPORT_WIDTH, x))
    y = Math.max(0, Math.min(height - VIEWPORT_HEIGHT, y))

    return { x, y }
  }, [position.x, position.y, width, height])

  const tiles = useMemo(() => {
    const result = []
    for (let y = 0; y < VIEWPORT_HEIGHT; y++) {
      for (let x = 0; x < VIEWPORT_WIDTH; x++) {
        const mapX = viewport.x + x
        const mapY = viewport.y + y

        // Safety check
        if (mapY < height && mapX < width) {
          result.push(
            <MapTile
              key={`${mapX}-${mapY}`}
              type={grid[mapY][mapX]}
              x={x} // Render relative to grid container (0..19)
              y={y} // Render relative to grid container (0..14)
            />
          )
        }
      }
    }
    return result
  }, [grid, viewport, width, height])

  return (
    <div className="relative">
      {/* Scanline overlay for retro CRT effect */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
        }}
      />

      {/* Zone name and time indicator */}
      <div className="absolute -top-6 left-0 right-0 flex justify-between items-center text-[8px] text-gba-light/50 z-40 px-1">
        <span className="bg-gba-dark/50 px-2 py-0.5 rounded">
          📍 {zone?.name || 'Campus'}
        </span>
        <span>
          {timeOfDay === 'night' && '🌙'}
          {timeOfDay === 'dawn' && '🌅'}
          {timeOfDay === 'day' && '☀️'}
          {timeOfDay === 'dusk' && '🌇'}
          {timeOfDay === 'evening' && '🌆'}
        </span>
      </div>

      {/* Map container with day/night filter */}
      <div
        className="relative border-4 border-gba-wall rounded-lg shadow-2xl transition-all duration-1000"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${VIEWPORT_WIDTH}, ${TILE_SIZE}px)`,
          gridTemplateRows: `repeat(${VIEWPORT_HEIGHT}, ${TILE_SIZE}px)`,
          width: VIEWPORT_WIDTH * TILE_SIZE,
          height: VIEWPORT_HEIGHT * TILE_SIZE,
          // ...filterStyle, // Disabled for debugging
        }}
      >
        {tiles}
        <CampusObjects offset={viewport} />
        <ZoneObjects offset={viewport} />
        <Player offset={viewport} />
      </div>
    </div>
  )
}
