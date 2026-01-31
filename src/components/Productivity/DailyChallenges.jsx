import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  refreshDailyChallenges,
  completeDailyChallenge,
  addChallengeXp,
} from '../../features/challengeSlice'
import { addXp, showToast } from '../../features/gameStateSlice'
import { CHALLENGE_CATEGORIES, checkChallengeProgress } from '../../data/challenges'
import { Target, CheckCircle, Circle, Flame, Trophy } from 'lucide-react'

export default function DailyChallenges({ onClose }) {
  const dispatch = useDispatch()
  const challenge = useSelector(state => state.challenge || {})
  const gameState = useSelector(state => state.gameState || {})

  // Safely destructure with defaults
  const dailyChallenges = challenge.dailyChallenges || []
  const completedDailyChallenges = challenge.completedDailyChallenges || []
  const dailyChallengeStreak = challenge.dailyChallengeStreak || 0
  const bestDailyChallengeStreak = challenge.bestDailyChallengeStreak || 0

  // Refresh challenges on mount
  useEffect(() => {
    dispatch(refreshDailyChallenges())
  }, [dispatch])

  // Map game stats to challenge requirement types
  const dailyStats = gameState.dailyStats || {}
  const statsMap = useMemo(() => ({
    focusMinutes: dailyStats.focusMinutes || 0,
    focusSessions: Math.floor((dailyStats.focusMinutes || 0) / 15),
    workoutsLogged: dailyStats.workoutsLogged || 0,
    exerciseMinutes: (dailyStats.workoutsLogged || 0) * 30, // Estimate
    waterGlasses: dailyStats.waterGlasses || 0,
    pagesRead: dailyStats.pagesRead || 0,
    sleepHours: dailyStats.sleepHours || 0,
  }), [dailyStats])

  // Check for newly completed challenges
  useEffect(() => {
    dailyChallenges.forEach(challenge => {
      if (completedDailyChallenges.includes(challenge.id)) return

      const progress = checkChallengeProgress(challenge, statsMap)
      if (progress.completed) {
        dispatch(completeDailyChallenge(challenge.id))
        dispatch(addXp(challenge.xpBonus))
        dispatch(addChallengeXp(challenge.xpBonus))
        dispatch(showToast(`Challenge Complete: ${challenge.title}! +${challenge.xpBonus} XP`))
      }
    })
  }, [dailyChallenges, completedDailyChallenges, statsMap, dispatch])

  const allCompleted = dailyChallenges.every(c => completedDailyChallenges.includes(c.id))

  return (
    <div className="text-gba-light">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Target className="text-gba-accent" size={20} />
        <h2 className="text-lg font-bold">Daily Challenges</h2>
      </div>

      {/* Streak display */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-gba-wall/20 rounded-lg">
        <div className="flex items-center gap-2">
          <Flame className="text-orange-500" size={18} />
          <div>
            <div className="text-sm font-medium">{dailyChallengeStreak}</div>
            <div className="text-[10px] text-gba-light/50">Day Streak</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500" size={18} />
          <div>
            <div className="text-sm font-medium">{bestDailyChallengeStreak}</div>
            <div className="text-[10px] text-gba-light/50">Best Streak</div>
          </div>
        </div>
        <div className="flex-1 text-right">
          <div className="text-sm font-medium">
            {completedDailyChallenges.length}/{dailyChallenges.length}
          </div>
          <div className="text-[10px] text-gba-light/50">Completed</div>
        </div>
      </div>

      {/* All completed message */}
      {allCompleted && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-600/50 rounded-lg text-center">
          <div className="text-green-400 font-medium">All Challenges Complete!</div>
          <div className="text-xs text-green-400/70">Come back tomorrow for new challenges</div>
        </div>
      )}

      {/* Challenge list */}
      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
        {dailyChallenges.map(challenge => {
          const category = CHALLENGE_CATEGORIES[challenge.category]
          const isCompleted = completedDailyChallenges.includes(challenge.id)
          const progress = checkChallengeProgress(challenge, statsMap)

          return (
            <div
              key={challenge.id}
              className={`p-3 rounded-lg border ${
                isCompleted
                  ? 'bg-green-900/20 border-green-600/30'
                  : 'bg-gba-wall/20 border-gba-path/30'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Status icon */}
                <div className="pt-0.5">
                  {isCompleted ? (
                    <CheckCircle size={18} className="text-green-500" />
                  ) : (
                    <Circle size={18} className="text-gba-light/30" />
                  )}
                </div>

                {/* Challenge info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{category.icon}</span>
                    <span className={`text-sm font-medium ${isCompleted ? 'line-through text-gba-light/50' : ''}`}>
                      {challenge.title}
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: category.color + '30', color: category.color }}
                    >
                      {category.name}
                    </span>
                  </div>

                  <p className="text-xs text-gba-light/60 mb-2">
                    {challenge.description}
                  </p>

                  {/* Progress bar */}
                  {!isCompleted && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gba-wall/30 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${progress.progress * 100}%`,
                            backgroundColor: category.color,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-gba-light/50">
                        {progress.current}/{progress.target}
                      </span>
                    </div>
                  )}
                </div>

                {/* XP reward */}
                <div className="text-right">
                  <div className={`text-sm font-medium ${isCompleted ? 'text-green-400' : 'text-gba-accent'}`}>
                    +{challenge.xpBonus}
                  </div>
                  <div className="text-[10px] text-gba-light/50">XP</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tip */}
      <div className="mt-4 text-xs text-gba-light/40 text-center">
        Complete activities in-game to progress challenges
      </div>
    </div>
  )
}
