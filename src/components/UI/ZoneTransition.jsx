import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function ZoneTransition() {
  const mapState = useSelector((state) => state.map || {})

  // Safely destructure with defaults
  const isTransitioning = mapState.isTransitioning || false
  const transitionType = mapState.transitionType || null
  const targetZoneName = mapState.targetZoneName || ''

  const [phase, setPhase] = useState('idle') // 'idle', 'fade-out', 'text', 'fade-in'
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    if (isTransitioning) {
      setDisplayText(targetZoneName || '')
      setPhase('fade-out')

      // Quick flash - show text briefly
      const textTimer = setTimeout(() => {
        setPhase('text')
      }, 50)

      // Fade in almost immediately
      const fadeInTimer = setTimeout(() => {
        setPhase('fade-in')
      }, 150)

      // Complete
      const completeTimer = setTimeout(() => {
        setPhase('idle')
      }, 250)

      return () => {
        clearTimeout(textTimer)
        clearTimeout(fadeInTimer)
        clearTimeout(completeTimer)
      }
    } else {
      // When transition ends, ensure we reset to idle
      // This handles when isTransitioning is set to false before animation completes
      setPhase('idle')
    }
  }, [isTransitioning, targetZoneName])

  if (phase === 'idle' && !isTransitioning) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none transition-opacity duration-75 ${
        phase === 'fade-out' || phase === 'text'
          ? 'opacity-100'
          : 'opacity-0'
      }`}
      style={{ backgroundColor: '#1a1a2e' }}
    >
      {/* Zone name text - quick flash */}
      <p className={`text-xl font-bold text-white transition-opacity duration-50 ${
        phase === 'text' ? 'opacity-100' : 'opacity-0'
      }`}>
        {displayText}
      </p>
    </div>
  )
}
