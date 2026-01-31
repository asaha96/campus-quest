import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  showNextNotification,
  clearNotification,
} from '../../features/achievementSlice'
import { getAchievement } from '../../data/achievements'
import useSound from '../../hooks/useSound'

export default function AchievementPopup() {
  const dispatch = useDispatch()
  const achievementState = useSelector(state => state.achievement || {})
  const currentNotification = achievementState.currentNotification || null
  const pendingNotifications = achievementState.pendingNotifications || []
  const { playSuccess } = useSound()

  // Show next notification if there are pending ones
  useEffect(() => {
    if (!currentNotification && pendingNotifications.length > 0) {
      dispatch(showNextNotification())
    }
  }, [currentNotification, pendingNotifications.length, dispatch])

  // Play sound and auto-dismiss
  useEffect(() => {
    if (currentNotification) {
      playSuccess()

      const timer = setTimeout(() => {
        dispatch(clearNotification())
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [currentNotification, dispatch, playSuccess])

  const handleDismiss = useCallback(() => {
    dispatch(clearNotification())
  }, [dispatch])

  if (!currentNotification) return null

  const achievement = getAchievement(currentNotification)
  if (!achievement) return null

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] animate-slide-down cursor-pointer"
      onClick={handleDismiss}
    >
      <div className="bg-gradient-to-r from-yellow-600/90 to-orange-600/90 border-2 border-yellow-400
                    rounded-lg shadow-lg px-6 py-3 flex items-center gap-4">
        {/* Icon */}
        <div className="text-3xl animate-bounce">
          {achievement.icon}
        </div>

        {/* Content */}
        <div>
          <div className="text-yellow-100 text-[10px] uppercase tracking-wider mb-0.5">
            Achievement Unlocked!
          </div>
          <div className="text-white font-bold">
            {achievement.name}
          </div>
          <div className="text-yellow-100/80 text-xs">
            {achievement.description}
          </div>
        </div>

        {/* XP reward */}
        <div className="text-right">
          <div className="text-yellow-300 font-bold text-lg">
            +{achievement.xpReward}
          </div>
          <div className="text-yellow-100/60 text-[10px]">XP</div>
        </div>
      </div>
    </div>
  )
}
