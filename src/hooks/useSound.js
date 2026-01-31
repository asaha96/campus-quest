import { useCallback, useRef } from 'react'

// Simple audio context for playing sound effects
// Using Web Audio API for better control

export default function useSound() {
  const audioContextRef = useRef(null)

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  // Generate 8-bit style beep sounds
  const playTone = useCallback((frequency, duration, volume = 0.1, type = 'square') => {
    try {
      const ctx = getAudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

      gainNode.gain.setValueAtTime(volume, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    } catch (e) {
      // Audio not supported or blocked
      console.log('Audio not available')
    }
  }, [getAudioContext])

  // Movement sound - very quiet step
  const playStep = useCallback(() => {
    playTone(200, 0.05, 0.03)
  }, [playTone])

  // Menu open sound
  const playMenuOpen = useCallback(() => {
    playTone(440, 0.1, 0.08)
    setTimeout(() => playTone(550, 0.1, 0.08), 50)
  }, [playTone])

  // Success fanfare
  const playSuccess = useCallback(() => {
    const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.15, 0.12), i * 100)
    })
  }, [playTone])

  // Error/failure sound
  const playError = useCallback(() => {
    playTone(200, 0.2, 0.08)
    setTimeout(() => playTone(150, 0.3, 0.08), 100)
  }, [playTone])

  // Collect sprite sound
  const playCollect = useCallback(() => {
    playTone(880, 0.08, 0.1)
    setTimeout(() => playTone(1100, 0.08, 0.1), 60)
    setTimeout(() => playTone(1320, 0.15, 0.1), 120)
  }, [playTone])

  // Level up fanfare
  const playLevelUp = useCallback(() => {
    const notes = [392, 440, 494, 523, 587, 659, 698, 784] // G4 to G5
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.12, 0.15), i * 80)
    })
  }, [playTone])

  // Achievement unlock sound
  const playAchievement = useCallback(() => {
    const notes = [523, 659, 784, 659, 784, 1047] // Special pattern
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.15, 0.12), i * 100)
    })
  }, [playTone])

  // Dialogue blip
  const playDialogueBlip = useCallback(() => {
    playTone(600 + Math.random() * 100, 0.03, 0.05)
  }, [playTone])

  // Cutscene dramatic sound
  const playCutsceneEffect = useCallback((type = 'fade') => {
    switch (type) {
      case 'fade':
        playTone(100, 0.5, 0.1, 'sine')
        break
      case 'dramatic':
        playTone(150, 0.3, 0.15)
        setTimeout(() => playTone(100, 0.5, 0.15), 200)
        break
      case 'boss':
        for (let i = 0; i < 5; i++) {
          setTimeout(() => playTone(80 + i * 20, 0.15, 0.12), i * 100)
        }
        break
      default:
        break
    }
  }, [playTone])

  // Quest complete sound
  const playQuestComplete = useCallback(() => {
    const notes = [392, 494, 587, 784, 987, 784, 987, 1175]
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 0.1), i * 120)
    })
  }, [playTone])

  // Chapter complete fanfare
  const playChapterComplete = useCallback(() => {
    const melody = [
      { freq: 523, dur: 0.2 },
      { freq: 659, dur: 0.2 },
      { freq: 784, dur: 0.2 },
      { freq: 1047, dur: 0.4 },
      { freq: 784, dur: 0.2 },
      { freq: 1047, dur: 0.6 },
    ]
    let time = 0
    melody.forEach(({ freq, dur }) => {
      setTimeout(() => playTone(freq, dur, 0.12), time)
      time += dur * 800
    })
  }, [playTone])

  return {
    playStep,
    playMenuOpen,
    playSuccess,
    playError,
    playCollect,
    playTone,
    playLevelUp,
    playAchievement,
    playDialogueBlip,
    playCutsceneEffect,
    playQuestComplete,
    playChapterComplete,
  }
}
