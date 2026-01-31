import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setVisualPosition,
  setMovementProgress,
  setAnimationFrame,
  completeMovement,
} from '../features/playerSlice'

const MOVEMENT_DURATION = 150 // 150ms for smooth movement

// Ease-out function for smooth deceleration
const easeOut = (t) => 1 - Math.pow(1 - t, 2)

export default function useMovementAnimation() {
  const dispatch = useDispatch()
  const { position, visualPosition, isMoving } = useSelector(
    (state) => state.player
  )

  const animationRef = useRef(null)
  const startTimeRef = useRef(null)
  const startPositionRef = useRef(null)
  const targetPositionRef = useRef(null)

  // Start animation when movement begins
  useEffect(() => {
    if (isMoving) {
      // Store positions using refs to avoid stale closure issues
      startPositionRef.current = { ...visualPosition }
      targetPositionRef.current = { ...position }
      startTimeRef.current = performance.now()

      const animate = () => {
        if (!startTimeRef.current || !startPositionRef.current || !targetPositionRef.current) {
          return
        }

        const elapsed = performance.now() - startTimeRef.current
        const rawProgress = Math.min(elapsed / MOVEMENT_DURATION, 1)
        const easedProgress = easeOut(rawProgress)

        // Interpolate position
        const startPos = startPositionRef.current
        const targetPos = targetPositionRef.current
        const newVisualX = startPos.x + (targetPos.x - startPos.x) * easedProgress
        const newVisualY = startPos.y + (targetPos.y - startPos.y) * easedProgress

        dispatch(setVisualPosition({ x: newVisualX, y: newVisualY }))
        dispatch(setMovementProgress(rawProgress))

        // Sync animation frames for walk cycle
        const frameIndex = Math.floor(rawProgress * 4) % 4
        const walkFrames = [1, 2, 1, 0]
        dispatch(setAnimationFrame(walkFrames[frameIndex]))

        if (rawProgress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          // Movement complete
          dispatch(completeMovement())
          startTimeRef.current = null
          startPositionRef.current = null
          targetPositionRef.current = null
        }
      }

      // Cancel any existing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      // Start the animation loop
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isMoving, position.x, position.y]) // Trigger on position change when moving

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return {
    visualPosition,
    isAnimating: isMoving,
  }
}
