import { useDispatch, useSelector } from 'react-redux'
import { addWaterGlass, addXp, showToast, updateStreak } from '../../features/gameStateSlice'
import { Droplets, Plus } from 'lucide-react'
import useSound from '../../hooks/useSound'

const WATER_GOAL = 8 // 8 glasses per day

export default function HydrationTracker() {
  const dispatch = useDispatch()
  const gameState = useSelector((state) => state.gameState || {})
  const { playSuccess, playCollect } = useSound()

  const dailyStats = gameState.dailyStats || {}
  const glasses = dailyStats.waterGlasses || 0
  const isComplete = glasses >= WATER_GOAL

  const handleAddGlass = () => {
    if (isComplete) return

    dispatch(addWaterGlass())
    dispatch(addXp(5)) // 5 XP per glass
    playSuccess()

    // Check if completing the goal
    if (glasses + 1 >= WATER_GOAL) {
      dispatch(addXp(25)) // Bonus for completing goal
      dispatch(updateStreak({ habit: 'hydration', increment: true }))
      dispatch(showToast('Hydration complete! +25 bonus XP'))
      playCollect()
    } else {
      dispatch(showToast(`+5 XP (${glasses + 1}/${WATER_GOAL} glasses)`))
    }
  }

  return (
    <div className="bg-gba-dark/80 border border-gba-path/50 rounded-lg p-2 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2">
        <Droplets size={14} className="text-blue-400" />
        <span className="text-[10px] text-gba-light/70">Hydration</span>
      </div>

      {/* Water glasses visualization */}
      <div className="flex gap-1 mb-2">
        {Array.from({ length: WATER_GOAL }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-4 rounded-sm transition-colors ${
              i < glasses
                ? 'bg-blue-400'
                : 'bg-gba-wall/30'
            }`}
          />
        ))}
      </div>

      {/* Progress text */}
      <div className="flex items-center justify-between">
        <span className={`text-[10px] ${isComplete ? 'text-green-400' : 'text-gba-light/50'}`}>
          {glasses}/{WATER_GOAL} {isComplete && '✓'}
        </span>

        {!isComplete && (
          <button
            onClick={handleAddGlass}
            className="flex items-center gap-1 px-2 py-1 bg-blue-600/80 hover:bg-blue-500 rounded text-[8px] transition-colors"
          >
            <Plus size={10} />
            Add
          </button>
        )}
      </div>
    </div>
  )
}
