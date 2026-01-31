import { useSelector } from 'react-redux'
import { Star, Book, Dumbbell, Sparkles } from 'lucide-react'

export default function HUD() {
  const { xp, level, dailyStats, collectedSprites } = useSelector(state => state.gameState)

  const xpProgress = xp % 100

  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-40 pointer-events-none">
      {/* Left side - Level and XP */}
      <div className="bg-gba-dark/90 border-2 border-gba-path rounded-lg p-3 pointer-events-auto">
        <div className="flex items-center gap-2 mb-2">
          <Star size={16} className="text-yellow-400" />
          <span className="text-xs text-gba-light">Level {level}</span>
        </div>
        <div className="w-24 h-2 bg-gba-wall rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 transition-all duration-300"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        <p className="text-[8px] text-gba-light/70 mt-1">{xp} XP</p>
      </div>

      {/* Right side - Stats */}
      <div className="bg-gba-dark/90 border-2 border-gba-path rounded-lg p-3 pointer-events-auto">
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Book size={14} className="text-blue-400" />
            <span className="text-gba-light">{dailyStats.focusMinutes}m</span>
          </div>
          <div className="flex items-center gap-2">
            <Dumbbell size={14} className="text-red-400" />
            <span className="text-gba-light">{dailyStats.workoutsLogged}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-gba-light">{collectedSprites.length}/8</span>
          </div>
        </div>
      </div>
    </div>
  )
}
