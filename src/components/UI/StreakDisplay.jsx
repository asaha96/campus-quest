import { useSelector } from 'react-redux'
import { Flame, TrendingUp } from 'lucide-react'

const STREAK_ICONS = {
  focus: '🎯',
  workout: '💪',
  reading: '📚',
  hydration: '💧',
  sleep: '😴',
}

const STREAK_LABELS = {
  focus: 'Focus',
  workout: 'Workout',
  reading: 'Reading',
  hydration: 'Hydration',
  sleep: 'Sleep',
}

export default function StreakDisplay({ compact = false }) {
  const gameState = useSelector((state) => state.gameState || {})
  const habitStreaks = gameState.habitStreaks || {}

  // Get active streaks (current > 0)
  const activeStreaks = Object.entries(habitStreaks || {})
    .filter(([_, streak]) => streak.current > 0)
    .sort((a, b) => b[1].current - a[1].current)

  if (activeStreaks.length === 0) {
    return compact ? null : (
      <div className="text-[10px] text-gba-light/50 text-center py-2">
        Complete activities to start streaks!
      </div>
    )
  }

  if (compact) {
    // Show just the top streak
    const [topHabit, topStreak] = activeStreaks[0]
    const isHot = topStreak.current >= 7

    return (
      <div className="flex items-center gap-1 text-[10px]">
        {isHot && <Flame size={12} className="text-orange-400 animate-pulse" />}
        <span>{STREAK_ICONS[topHabit]}</span>
        <span className="text-gba-light/70">{topStreak.current}d</span>
      </div>
    )
  }

  return (
    <div className="bg-gba-dark/80 border border-gba-path/50 rounded-lg p-2 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp size={14} className="text-orange-400" />
        <span className="text-[10px] text-gba-light/70">Streaks</span>
      </div>

      <div className="space-y-1">
        {activeStreaks.map(([habit, streak]) => {
          const isHot = streak.current >= 7
          return (
            <div
              key={habit}
              className="flex items-center justify-between text-[10px]"
            >
              <div className="flex items-center gap-1">
                <span>{STREAK_ICONS[habit]}</span>
                <span className="text-gba-light/70">{STREAK_LABELS[habit]}</span>
              </div>
              <div className="flex items-center gap-1">
                {isHot && (
                  <Flame size={10} className="text-orange-400 animate-pulse" />
                )}
                <span className={isHot ? 'text-orange-400 font-bold' : 'text-gba-light'}>
                  {streak.current}d
                </span>
                {streak.best > streak.current && (
                  <span className="text-gba-light/40 text-[8px]">
                    (best: {streak.best})
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
