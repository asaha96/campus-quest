import { memo, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { TILE_SIZE } from '../../data/maps'
import { getBuildingObjects } from '../../utils/mapGenerator'

const VIEWPORT_WIDTH = 20
const VIEWPORT_HEIGHT = 15

// Render a decorative object on the campus
const CampusObject = memo(({ obj, offset }) => {
  // Calculate screen position
  const screenX = (obj.x - offset.x) * TILE_SIZE
  const screenY = (obj.y - offset.y) * TILE_SIZE

  // Strict viewport bounds check - only render if fully visible
  if (screenX < 0 || screenX >= VIEWPORT_WIDTH * TILE_SIZE ||
      screenY < 0 || screenY >= VIEWPORT_HEIGHT * TILE_SIZE) {
    return null
  }

  const isSign = obj.type === 'sign'
  const isLandmark = obj.type === 'landmark'

  return (
    <div
      className={`absolute flex items-center justify-center pointer-events-none ${
        isSign ? 'z-25' : isLandmark ? 'z-15' : 'z-10'
      }`}
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        left: screenX,
        top: screenY,
      }}
    >
      <span
        className={`${isSign || isLandmark ? 'text-xl' : 'text-sm'} ${
          isLandmark ? 'animate-pulse' : ''
        }`}
        style={{
          filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.6))',
        }}
        title={obj.name}
      >
        {obj.emoji}
      </span>
      {/* Show name label for signs */}
      {isSign && (
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gba-dark/90 px-1 rounded text-[6px] text-gba-light border border-gba-path/50"
        >
          {obj.name}
        </div>
      )}
    </div>
  )
})

export default function CampusObjects({ offset = { x: 0, y: 0 } }) {
  const mapState = useSelector((state) => state.map || {})
  const currentZone = mapState.currentZone || 'campus'

  // Only render on campus
  const objects = useMemo(() => {
    if (currentZone !== 'campus') return []
    return getBuildingObjects()
  }, [currentZone])

  if (currentZone !== 'campus' || objects.length === 0) {
    return null
  }

  return (
    <>
      {objects.map((obj, index) => (
        <CampusObject
          key={`${obj.type}-${obj.x}-${obj.y}-${index}`}
          obj={obj}
          offset={offset}
        />
      ))}
    </>
  )
}
