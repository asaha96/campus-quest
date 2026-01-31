import { useMemo } from 'react'
import MapTile from './MapTile'
import Player from '../Player/Player'
import { campusMap, MAP_WIDTH, MAP_HEIGHT, TILE_SIZE } from '../../data/maps'
import useDayNight from '../../hooks/useDayNight'

export default function WorldMap() {
  const { timeOfDay, filterStyle } = useDayNight()

  const tiles = useMemo(() => {
    const result = []
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        result.push(
          <MapTile
            key={`${x}-${y}`}
            type={campusMap[y][x]}
            x={x}
            y={y}
          />
        )
      }
    }
    return result
  }, [])

  return (
    <div className="relative">
      {/* Scanline overlay for retro CRT effect */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      {/* Time of day indicator */}
      <div className="absolute -top-6 right-0 text-[8px] text-gba-light/50 z-40">
        {timeOfDay === 'night' && '🌙'}
        {timeOfDay === 'dawn' && '🌅'}
        {timeOfDay === 'day' && '☀️'}
        {timeOfDay === 'dusk' && '🌇'}
        {timeOfDay === 'evening' && '🌆'}
      </div>

      {/* Map container with day/night filter */}
      <div
        className="relative border-4 border-gba-wall rounded-lg shadow-2xl transition-all duration-1000"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${MAP_WIDTH}, ${TILE_SIZE}px)`,
          gridTemplateRows: `repeat(${MAP_HEIGHT}, ${TILE_SIZE}px)`,
          width: MAP_WIDTH * TILE_SIZE,
          height: MAP_HEIGHT * TILE_SIZE,
          ...filterStyle,
        }}
      >
        {tiles}
        <Player />
      </div>
    </div>
  )
}
