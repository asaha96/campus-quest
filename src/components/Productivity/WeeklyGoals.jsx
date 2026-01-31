import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  refreshWeeklyGoals,
  completeWeeklyGoal,
} from '../../features/challengeSlice'
import { addXp, showToast } from '../../features/gameStateSlice'
import { CHALLENGE_CATEGORIES, WEEKLY_GOALS, checkChallengeProgress } from '../../data/challenges'
import { Calendar, CheckCircle, Circle, TrendingUp, Award } from 'lucide-react'

export default function WeeklyGoals({ onClose }) {
  const dispatch = useDispatch()
  const challenge = useSelector(state => state.challenge || {})
  const gameState = useSelector(state => state.gameState || {})

  // Safely destructure with defaults
  const completedWeeklyGoals = challenge.completedWeeklyGoals || []
  const weeklyProgress = challenge.weeklyProgress || {}
  const weeklyGoalStreak = challenge.weeklyGoalStreak || 0
  const bestWeeklyGoalStreak = challenge.bestWeeklyGoalStreak || 0
  const currentWeek = challenge.currentWeek || ''

  // Refresh weekly goals on mount
  useEffect(() => {
    dispatch(refreshWeeklyGoals())
  }, [dispatch])

  // Calculate weekly stats (aggregated from daily stats)
  // In a real app, this would track across the whole week
  const dailyStats = gameState.dailyStats || {}
  const weeklyStats = useMemo(() => ({
    focusMinutes: weeklyProgress.weekly_focus_200?.current || dailyStats.focusMinutes || 0,
    workoutsLogged: weeklyProgress.weekly_workouts_3?.current || dailyStats.workoutsLogged || 0,
    pagesRead: weeklyProgress.weekly_reading_100?.current || dailyStats.pagesRead || 0,
    hydrationDays: weeklyProgress.weekly_hydration_streak?.current || ((dailyStats.waterGlasses || 0) >= 8 ? 1 : 0),
    goodSleepDays: weeklyProgress.weekly_sleep_quality?.current || ((dailyStats.sleepHours || 0) >= 7 ? 1 : 0),
  }), [weeklyProgress, dailyStats])

  // Check for completed goals
  useEffect(() => {
    WEEKLY_GOALS.forEach(goal => {
      if (completedWeeklyGoals.includes(goal.id)) return

      const progress = checkChallengeProgress(goal, weeklyStats)
      if (progress.completed) {
        dispatch(completeWeeklyGoal(goal.id))
        dispatch(addXp(goal.xpBonus))
        dispatch(showToast(`Weekly Goal Complete: ${goal.title}! +${goal.xpBonus} XP`))
      }
    })
  }, [completedWeeklyGoals, weeklyStats, dispatch])

  const completedCount = completedWeeklyGoals.length

  return (
    <div className="text-gba-light">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="text-gba-accent" size={20} />
        <h2 className="text-lg font-bold">Weekly Goals</h2>
      </div>

      {/* Week info and streak */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-gba-wall/20 rounded-lg">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-blue-400" size={18} />
          <div>
            <div className="text-sm font-medium">{weeklyGoalStreak}</div>
            <div className="text-[10px] text-gba-light/50">Week Streak</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Award className="text-yellow-500" size={18} />
          <div>
            <div className="text-sm font-medium">{bestWeeklyGoalStreak}</div>
            <div className="text-[10px] text-gba-light/50">Best Streak</div>
          </div>
        </div>
        <div className="flex-1 text-right">
          <div className="text-xs text-gba-light/50">{currentWeek}</div>
          <div className="text-sm font-medium">{completedCount}/{WEEKLY_GOALS.length}</div>
        </div>
      </div>

      {/* Goal list */}
      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
        {WEEKLY_GOALS.map(goal => {
          const category = CHALLENGE_CATEGORIES[goal.category]
          const isCompleted = completedWeeklyGoals.includes(goal.id)
          const progress = checkChallengeProgress(goal, weeklyStats)

          // Calculate milestone progress
          const milestoneIndex = goal.milestones.findIndex(m => progress.current < m)
          const nextMilestone = goal.milestones[milestoneIndex] || goal.milestones[goal.milestones.length - 1]
          const prevMilestone = milestoneIndex > 0 ? goal.milestones[milestoneIndex - 1] : 0

          return (
            <div
              key={goal.id}
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

                {/* Goal info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{category.icon}</span>
                    <span className={`text-sm font-medium ${isCompleted ? 'line-through text-gba-light/50' : ''}`}>
                      {goal.title}
                    </span>
                  </div>

                  <p className="text-xs text-gba-light/60 mb-2">
                    {goal.description}
                  </p>

                  {/* Progress bar with milestones */}
                  {!isCompleted && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-2.5 bg-gba-wall/30 rounded-full overflow-hidden relative">
                          {/* Milestone markers */}
                          {goal.milestones.map((milestone, idx) => (
                            <div
                              key={idx}
                              className="absolute top-0 bottom-0 w-0.5 bg-gba-path/50"
                              style={{ left: `${(milestone / goal.requirement.value) * 100}%` }}
                            />
                          ))}
                          {/* Progress fill */}
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${progress.progress * 100}%`,
                              backgroundColor: category.color,
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-gba-light/50 min-w-[50px] text-right">
                          {progress.current}/{progress.target}
                        </span>
                      </div>

                      {/* Next milestone indicator */}
                      {!isCompleted && milestoneIndex >= 0 && (
                        <div className="text-[10px] text-gba-light/40">
                          Next milestone: {nextMilestone}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* XP reward */}
                <div className="text-right">
                  <div className={`text-sm font-medium ${isCompleted ? 'text-green-400' : 'text-gba-accent'}`}>
                    +{goal.xpBonus}
                  </div>
                  <div className="text-[10px] text-gba-light/50">XP</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info */}
      <div className="mt-4 text-xs text-gba-light/40 text-center">
        Weekly goals reset every Monday
      </div>
    </div>
  )
}
