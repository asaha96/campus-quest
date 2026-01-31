import { useDispatch, useSelector } from 'react-redux'
import { resetDailyStats, showToast } from '../../features/gameStateSlice'
import { Home, Moon, RefreshCw } from 'lucide-react'

export default function DormView({ onClose }) {
  const dispatch = useDispatch()
  const { xp, level, collectedSprites } = useSelector(state => state.gameState)

  const handleRest = () => {
    dispatch(resetDailyStats())
    dispatch(showToast('You feel refreshed! Daily stats reset.'))
    onClose()
  }

  const handleResetGame = () => {
    if (confirm('Are you sure you want to reset all progress?')) {
      localStorage.removeItem('campus-quest-save')
      window.location.reload()
    }
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Home size={24} className="text-purple-400" />
        <h2 className="text-sm font-bold text-gba-light">Student Dorm</h2>
      </div>

      <p className="text-[10px] text-gba-light/70 mb-6">
        Your cozy room. Rest here to prepare for tomorrow!
      </p>

      {/* Room decoration */}
      <div className="text-4xl mb-6">
        🛏️
      </div>

      {/* Player stats */}
      <div className="bg-gba-wall/20 rounded-lg p-4 mb-6 text-left">
        <h3 className="text-xs text-gba-light mb-3 text-center">Your Journey</h3>
        <div className="space-y-2 text-[10px]">
          <div className="flex justify-between">
            <span className="text-gba-light/60">Total XP Earned:</span>
            <span className="text-yellow-400 font-bold">{xp}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gba-light/60">Current Level:</span>
            <span className="text-yellow-400 font-bold">{level}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gba-light/60">Sprites Collected:</span>
            <span className="text-purple-400 font-bold">{collectedSprites.length}/8</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleRest}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors text-xs"
        >
          <Moon size={14} />
          Rest & Reset Daily Stats
        </button>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gba-path text-gba-dark rounded-lg transition-colors text-xs hover:bg-gba-path/80"
        >
          Back to Campus
        </button>

        <button
          onClick={handleResetGame}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-transparent border border-red-500/50 text-red-400 rounded-lg transition-colors text-[10px] hover:bg-red-500/10"
        >
          <RefreshCw size={12} />
          Reset All Progress
        </button>
      </div>
    </div>
  )
}
