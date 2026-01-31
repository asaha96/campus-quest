import { useRef, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setCameraPosition,
  setShakeIntensity,
  setShakeOffset,
  setCameraZoom,
} from '../features/cutsceneSlice'

// Hook for cinematic camera effects during cutscenes
export default function useCinematicCamera() {
  const dispatch = useDispatch()
  const cutsceneState = useSelector(state => state.cutscene || {})

  // Safely extract with defaults
  const cameraPosition = cutsceneState.cameraPosition || { x: 50, y: 50 }
  const shakeIntensity = cutsceneState.shakeIntensity || 0
  const cameraZoom = cutsceneState.cameraZoom || 1
  const cameraOverride = cutsceneState.cameraOverride || false

  const animationRef = useRef(null)
  const shakeTimerRef = useRef(null)

  // Smooth camera pan from one position to another
  const panCamera = useCallback((from, to, duration) => {
    return new Promise((resolve) => {
      const startTime = Date.now()
      const deltaX = to.x - from.x
      const deltaY = to.y - from.y

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Ease-in-out curve
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2

        const newX = from.x + deltaX * eased
        const newY = from.y + deltaY * eased

        dispatch(setCameraPosition({ x: newX, y: newY }))

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          dispatch(setCameraPosition(to))
          resolve()
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    })
  }, [dispatch])

  // Screen shake effect
  const shakeScreen = useCallback((intensity, duration) => {
    return new Promise((resolve) => {
      dispatch(setShakeIntensity(intensity))

      const startTime = Date.now()

      const updateShake = () => {
        const elapsed = Date.now() - startTime

        if (elapsed < duration) {
          // Random shake offset
          const currentIntensity = intensity * (1 - elapsed / duration)
          const offsetX = (Math.random() - 0.5) * currentIntensity * 2
          const offsetY = (Math.random() - 0.5) * currentIntensity * 2

          dispatch(setShakeOffset({ x: offsetX, y: offsetY }))
          shakeTimerRef.current = requestAnimationFrame(updateShake)
        } else {
          dispatch(setShakeIntensity(0))
          dispatch(setShakeOffset({ x: 0, y: 0 }))
          resolve()
        }
      }

      shakeTimerRef.current = requestAnimationFrame(updateShake)
    })
  }, [dispatch])

  // Zoom camera
  const zoomCamera = useCallback((targetZoom, duration) => {
    return new Promise((resolve) => {
      const startZoom = cameraZoom
      const startTime = Date.now()
      const deltaZoom = targetZoom - startZoom

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Smooth curve
        const eased = 1 - Math.pow(1 - progress, 3)
        const newZoom = startZoom + deltaZoom * eased

        dispatch(setCameraZoom(newZoom))

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          dispatch(setCameraZoom(targetZoom))
          resolve()
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    })
  }, [dispatch, cameraZoom])

  // Focus on a position
  const focusOn = useCallback((position, duration = 500) => {
    return panCamera(cameraPosition, position, duration)
  }, [panCamera, cameraPosition])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (shakeTimerRef.current) {
        cancelAnimationFrame(shakeTimerRef.current)
      }
    }
  }, [])

  return {
    cameraPosition,
    cameraZoom,
    shakeIntensity,
    cameraOverride,
    panCamera,
    shakeScreen,
    zoomCamera,
    focusOn,
  }
}
