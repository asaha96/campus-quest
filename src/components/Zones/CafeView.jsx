import { useSelector } from 'react-redux'
import { Coffee, Sparkles } from 'lucide-react'
import { sprites } from '../../data/sprites'

export default function CafeView({ onClose }) {
  const gameState = useSelector(state => state.gameState || {})

  // Safely destructure with defaults
  const collectedSprites = gameState.collectedSprites || []
  const dailyStats = gameState.dailyStats || { focusMinutes: 0, workoutsLogged: 0 }
  const level = gameState.level || 1

  const collectedSpriteData = sprites.filter(s => collectedSprites.includes(s.id))
  const uncollectedCount = sprites.length - collectedSprites.length

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Coffee size={24} className="text-amber-400" />
        <h2 className="text-sm font-bold text-gba-light">Cozy Cafe</h2>
      </div>

      <p className="text-[10px] text-gba-light/70 mb-6">
        Take a break and view your collection!
      </p>

      {/* Stats Summary */}
      <div className="bg-gba-wall/20 rounded-lg p-4 mb-4">
        <h3 className="text-xs text-gba-light mb-3 flex items-center justify-center gap-2">
          <Sparkles size={14} /> Today's Progress
        </h3>
        <div className="grid grid-cols-2 gap-3 text-[10px]">
          <div className="bg-gba-dark/50 rounded p-2">
            <p className="text-gba-light/60">Focus Time</p>
            <p className="text-blue-400 font-bold">{dailyStats.focusMinutes}m</p>
          </div>
          <div className="bg-gba-dark/50 rounded p-2">
            <p className="text-gba-light/60">Workouts</p>
            <p className="text-red-400 font-bold">{dailyStats.workoutsLogged}</p>
          </div>
          <div className="bg-gba-dark/50 rounded p-2">
            <p className="text-gba-light/60">Sprites</p>
            <p className="text-purple-400 font-bold">{collectedSprites.length}/{sprites.length}</p>
          </div>
          <div className="bg-gba-dark/50 rounded p-2">
            <p className="text-gba-light/60">Level</p>
            <p className="text-yellow-400 font-bold">{level}</p>
          </div>
        </div>
      </div>

      {/* Sprite Collection */}
      <div className="bg-gba-wall/20 rounded-lg p-4 mb-4">
        <h3 className="text-xs text-gba-light mb-3">Sprite Collection</h3>
        {collectedSpriteData.length > 0 ? (
          <div className="grid grid-cols-4 gap-2">
            {collectedSpriteData.map(sprite => (
              <div
                key={sprite.id}
                className="bg-gba-dark/50 rounded p-2 flex flex-col items-center"
                title={`${sprite.name}: ${sprite.description}`}
              >
                <span className="text-2xl">{sprite.emoji}</span>
                <span className="text-[8px] text-gba-light/70 mt-1 truncate w-full text-center">
                  {sprite.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-gba-light/50 italic">
            No sprites collected yet. Complete tasks to find them!
          </p>
        )}

        {uncollectedCount > 0 && (
          <p className="text-[8px] text-gba-light/40 mt-3">
            {uncollectedCount} more sprites to discover...
          </p>
        )}
      </div>

      <button
        onClick={onClose}
        className="px-4 py-2 bg-gba-path text-gba-dark rounded-lg transition-colors text-xs hover:bg-gba-path/80"
      >
        Back to Campus
      </button>
    </div>
  )
}
