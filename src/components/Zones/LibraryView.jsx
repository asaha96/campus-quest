import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addXp, updateStat, addSprite, showToast, logReading, updateStreak } from '../../features/gameStateSlice'
import { getRandomSprite } from '../../data/sprites'
import { Book, Play, Square, Clock, BookOpen } from 'lucide-react'
import useSound from '../../hooks/useSound'

const FOCUS_DURATION = 25 * 60 // 25 minutes in seconds

export default function LibraryView({ onClose }) {
  const dispatch = useDispatch()
  const gameState = useSelector(state => state.gameState || {})
  const { playSuccess, playCollect, playError } = useSound()

  // Safely destructure with defaults
  const collectedSprites = gameState.collectedSprites || []
  const dailyStats = gameState.dailyStats || { focusMinutes: 0, pagesRead: 0 }

  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION)
  const [isActive, setIsActive] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [showReadingLog, setShowReadingLog] = useState(false)
  const [pagesInput, setPagesInput] = useState('')
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      // Session complete!
      setIsActive(false)
      setSessionComplete(true)
      handleSessionComplete()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, timeLeft])

  const handleSessionComplete = () => {
    // Award XP
    dispatch(addXp(50))
    dispatch(updateStat({ stat: 'focusMinutes', value: 25 }))

    // Chance to collect a sprite
    if (Math.random() > 0.3) {
      const sprite = getRandomSprite(collectedSprites)
      if (sprite) {
        dispatch(addSprite(sprite.id))
        dispatch(showToast(`${sprite.emoji} ${sprite.name} joined your collection!`))
        playCollect()
      } else {
        dispatch(showToast('Focus session complete! +50 XP'))
        playSuccess()
      }
    } else {
      dispatch(showToast('Focus session complete! +50 XP'))
      playSuccess()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    setIsActive(true)
    setSessionComplete(false)
  }

  const handleStop = () => {
    setIsActive(false)
    setTimeLeft(FOCUS_DURATION)
    playError()
  }

  const handleCloseAndReset = () => {
    setTimeLeft(FOCUS_DURATION)
    setIsActive(false)
    setSessionComplete(false)
    onClose()
  }

  const progress = ((FOCUS_DURATION - timeLeft) / FOCUS_DURATION) * 100

  const handleLogReading = (e) => {
    e.preventDefault()
    const pages = parseInt(pagesInput) || 0
    if (pages <= 0) {
      dispatch(showToast('Please enter a valid number of pages!'))
      playError()
      return
    }

    // 5 XP per 10 pages
    const xpEarned = Math.floor(pages / 10) * 5
    dispatch(logReading(pages))
    dispatch(addXp(xpEarned > 0 ? xpEarned : 5)) // Minimum 5 XP
    dispatch(updateStreak({ habit: 'reading', increment: true }))
    dispatch(showToast(`Logged ${pages} pages! +${xpEarned > 0 ? xpEarned : 5} XP`))
    playSuccess()
    setPagesInput('')
    setShowReadingLog(false)
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Book size={24} className="text-blue-400" />
        <h2 className="text-sm font-bold text-gba-light">University Library</h2>
      </div>

      <p className="text-[10px] text-gba-light/70 mb-4">
        Focus on your studies to unlock Knowledge Sprites!
      </p>

      {/* Tab buttons */}
      <div className="flex gap-2 mb-4 justify-center">
        <button
          onClick={() => setShowReadingLog(false)}
          className={`px-3 py-1 text-[10px] rounded transition-colors ${
            !showReadingLog
              ? 'bg-blue-600 text-white'
              : 'bg-gba-wall/30 text-gba-light/70 hover:bg-gba-wall/50'
          }`}
        >
          Focus Timer
        </button>
        <button
          onClick={() => setShowReadingLog(true)}
          className={`px-3 py-1 text-[10px] rounded transition-colors ${
            showReadingLog
              ? 'bg-blue-600 text-white'
              : 'bg-gba-wall/30 text-gba-light/70 hover:bg-gba-wall/50'
          }`}
        >
          Log Reading
        </button>
      </div>

      {/* Reading Log Form */}
      {showReadingLog ? (
        <div className="mb-6">
          <div className="text-4xl mb-4">📖</div>
          <p className="text-[10px] text-gba-light/70 mb-4">
            Today's pages read: <span className="text-blue-400 font-bold">{dailyStats.pagesRead}</span>
          </p>
          <form onSubmit={handleLogReading} className="space-y-3">
            <div>
              <label className="block text-[10px] text-gba-light/70 mb-2 text-left">
                Pages read today
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={pagesInput}
                onChange={(e) => setPagesInput(e.target.value)}
                placeholder="10"
                className="w-full px-3 py-2 bg-gba-wall/30 border border-gba-path rounded-lg text-xs text-gba-light focus:outline-none focus:border-blue-400 placeholder:text-gba-light/30"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-xs"
            >
              <BookOpen size={14} />
              Log Pages (+5 XP per 10 pages)
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Original Focus Timer content */}

      {/* Timer Display */}
      <div className="relative mb-6">
        {/* Progress ring */}
        <div className="w-32 h-32 mx-auto relative">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gba-wall"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
              className="text-blue-400 transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gba-light font-mono">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Status */}
      {isActive && (
        <div className="mb-4 flex items-center justify-center gap-2">
          <Clock size={14} className="text-blue-400 animate-pulse" />
          <span className="text-[10px] text-gba-light">Focusing...</span>
        </div>
      )}

      {sessionComplete && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-500 rounded-lg">
          <p className="text-xs text-green-400">Session Complete! +50 XP</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isActive && !sessionComplete && (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-xs"
          >
            <Play size={14} />
            Start Focus
          </button>
        )}

        {isActive && (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors text-xs"
          >
            <Square size={14} />
            Give Up
          </button>
        )}

        {sessionComplete && (
          <button
            onClick={handleCloseAndReset}
            className="px-4 py-2 bg-gba-path text-gba-dark rounded-lg transition-colors text-xs hover:bg-gba-path/80"
          >
            Continue Exploring
          </button>
        )}
      </div>
        </>
      )}
    </div>
  )
}
