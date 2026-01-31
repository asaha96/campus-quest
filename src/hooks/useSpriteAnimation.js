import { useState, useEffect, useRef, useCallback } from 'react'
import { ANIMATIONS, WALK_OFFSETS } from '../data/spritesheet'

// Hook for managing sprite animation frames
// Syncs animation with movement state for smooth walk cycles

export default function useSpriteAnimation(isMoving, animationType = 'walk') {
  const [frame, setFrame] = useState(0)
  const [offset, setOffset] = useState({ y: 0 })
  const frameTimerRef = useRef(null)
  const lastFrameTimeRef = useRef(Date.now())

  const animation = ANIMATIONS[animationType] || ANIMATIONS.walk

  // Start/stop animation based on movement state
  useEffect(() => {
    if (isMoving) {
      // Start animation loop
      const animate = () => {
        const now = Date.now()
        const elapsed = now - lastFrameTimeRef.current

        if (elapsed >= animation.speed) {
          setFrame((prev) => {
            const nextFrame = (prev + 1) % animation.frames
            // Apply walk offset for bouncy effect
            if (animationType === 'walk' || animationType === 'run') {
              setOffset(WALK_OFFSETS[nextFrame] || { y: 0 })
            }
            return nextFrame
          })
          lastFrameTimeRef.current = now
        }

        frameTimerRef.current = requestAnimationFrame(animate)
      }

      // Start with frame 0
      setFrame(0)
      lastFrameTimeRef.current = Date.now()
      frameTimerRef.current = requestAnimationFrame(animate)
    } else {
      // Stop animation, reset to idle frame
      if (frameTimerRef.current) {
        cancelAnimationFrame(frameTimerRef.current)
        frameTimerRef.current = null
      }
      setFrame(0)
      setOffset({ y: 0 })
    }

    return () => {
      if (frameTimerRef.current) {
        cancelAnimationFrame(frameTimerRef.current)
      }
    }
  }, [isMoving, animation.speed, animation.frames, animationType])

  // Get animation speed for external use
  const getAnimationSpeed = useCallback(() => {
    return animation.speed
  }, [animation.speed])

  return {
    frame,
    offset,
    totalFrames: animation.frames,
    animationSpeed: animation.speed,
    getAnimationSpeed,
  }
}

// Simplified idle animation hook for NPCs
export function useIdleAnimation(speed = 500) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % 2)
    }, speed)

    return () => clearInterval(timer)
  }, [speed])

  return frame
}

// Hook for talk animation (when in dialogue)
export function useTalkAnimation(isTalking) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (!isTalking) {
      setFrame(0)
      return
    }

    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % 2)
    }, 300)

    return () => clearInterval(timer)
  }, [isTalking])

  return frame
}
