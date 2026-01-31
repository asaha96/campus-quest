import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetDailyStats, showToast, addXp, logSleep, updateStreak } from '../../features/gameStateSlice'
import { regenerateMap } from '../../features/mapSlice'
import { teleportPlayer } from '../../features/playerSlice'
import { Home, Moon, RefreshCw, Bed, Map } from 'lucide-react'
import useSound from '../../hooks/useSound'

export default function DormView({ onClose }) {
  const dispatch = useDispatch()
  const gameState = useSelector(state => state.gameState || {})
  const { playSuccess, playError } = useSound()

  // Safely destructure with defaults
  const xp = gameState.xp || 0
  const level = gameState.level || 1
  const collectedSprites = gameState.collectedSprites || []
  const dailyStats = gameState.dailyStats || { sleepHours: 0 }

  const [sleepHours, setSleepHours] = useState('')
  const [sleepLogged, setSleepLogged] = useState(dailyStats.sleepHours > 0)

  const handleLogSleep = (e) => {
    e.preventDefault()
    const hours = parseFloat(sleepHours) || 0
    if (hours <= 0 || hours > 24) {
      dispatch(showToast('Please enter valid sleep hours (1-24)!'))
      playError()
      return
    }

    dispatch(logSleep(hours))

    // 50 XP for 7-9 hours (optimal), 25 XP otherwise
    const isOptimal = hours >= 7 && hours <= 9
    const xpEarned = isOptimal ? 50 : 25
    dispatch(addXp(xpEarned))
    dispatch(updateStreak({ habit: 'sleep', increment: true }))

    const message = isOptimal
      ? `Great sleep! ${hours}h is optimal. +${xpEarned} XP`
      : `Sleep logged: ${hours}h. +${xpEarned} XP (7-9h = bonus XP)`
    dispatch(showToast(message))
    playSuccess()
    setSleepLogged(true)
  }

  const handleRest = () => {
    dispatch(resetDailyStats())
    dispatch(showToast('You feel refreshed! Daily stats reset.'))
    setSleepLogged(false)
    onClose()
  }

  const handleResetGame = () => {
    if (confirm('Are you sure you want to reset all progress?')) {
      localStorage.removeItem('campus-quest-save')
      window.location.reload()
    }
  }

  const handleNewMap = () => {
    dispatch(regenerateMap())
    dispatch(teleportPlayer({ x: 50, y: 50 }))
    dispatch(showToast('New campus generated! Explore the new layout.'))
    playSuccess()
    onClose()
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
      <div className="text-4xl mb-4">
        🛏️
      </div>

      {/* Sleep Tracking */}
      {!sleepLogged ? (
        <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 mb-4">
          <h3 className="text-xs text-purple-400 mb-3 flex items-center justify-center gap-2">
            <Bed size={14} /> Log Your Sleep
          </h3>
          <form onSubmit={handleLogSleep} className="space-y-2">
            <input
              type="number"
              min="1"
              max="24"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              placeholder="Hours slept (e.g., 7.5)"
              className="w-full px-3 py-2 bg-gba-wall/30 border border-gba-path rounded-lg text-xs text-gba-light focus:outline-none focus:border-purple-400 placeholder:text-gba-light/30 text-center"
            />
            <button
              type="submit"
              className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs transition-colors"
            >
              Log Sleep (7-9h = 50 XP)
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3 mb-4">
          <p className="text-xs text-green-400">
            Sleep logged: {dailyStats.sleepHours}h
          </p>
        </div>
      )}

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
          onClick={handleNewMap}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-xs"
        >
          <Map size={14} />
          Generate New Campus Map
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
