import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addXp, updateStat, addSprite, showToast } from '../../features/gameStateSlice'
import { getRandomSprite } from '../../data/sprites'
import { Dumbbell, Plus } from 'lucide-react'
import useSound from '../../hooks/useSound'

const EXERCISE_TYPES = [
  'Running',
  'Walking',
  'Weights',
  'Yoga',
  'Swimming',
  'Cycling',
  'HIIT',
  'Other',
]

export default function GymView({ onClose }) {
  const dispatch = useDispatch()
  const { collectedSprites, dailyStats } = useSelector(state => state.gameState)
  const { playSuccess, playCollect, playError } = useSound()

  const [exerciseName, setExerciseName] = useState('')
  const [duration, setDuration] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    const durationNum = parseInt(duration) || 0
    if (!exerciseName || durationNum <= 0) {
      dispatch(showToast('Please enter exercise and duration!'))
      playError()
      return
    }

    // Award XP based on duration
    const xpEarned = Math.min(durationNum * 2, 100) // 2 XP per minute, max 100
    dispatch(addXp(xpEarned))
    dispatch(updateStat({ stat: 'workoutsLogged', value: 1 }))

    // First workout of the day bonus
    const isFirstWorkout = dailyStats.workoutsLogged === 0
    if (isFirstWorkout) {
      dispatch(addXp(25)) // Bonus XP
    }

    // Chance to collect a fitness sprite
    if (Math.random() > 0.4) {
      const sprite = getRandomSprite(collectedSprites)
      if (sprite) {
        dispatch(addSprite(sprite.id))
        dispatch(showToast(`${sprite.emoji} ${sprite.name} was inspired by your workout!`))
        playCollect()
      } else {
        playSuccess()
      }
    } else {
      const message = isFirstWorkout
        ? `First workout today! +${xpEarned + 25} XP`
        : `Workout logged! +${xpEarned} XP`
      dispatch(showToast(message))
      playSuccess()
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Dumbbell size={24} className="text-red-400" />
          <h2 className="text-sm font-bold text-gba-light">Campus Gym</h2>
        </div>

        <div className="mb-6 p-4 bg-green-900/30 border border-green-500 rounded-lg">
          <p className="text-xs text-green-400 mb-2">Workout Logged!</p>
          <p className="text-[10px] text-gba-light">
            {exerciseName} - {duration} minutes
          </p>
        </div>

        <div className="text-4xl mb-4 animate-bounce">
          💪
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-gba-path text-gba-dark rounded-lg transition-colors text-xs hover:bg-gba-path/80"
        >
          Continue Exploring
        </button>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Dumbbell size={24} className="text-red-400" />
        <h2 className="text-sm font-bold text-gba-light">Campus Gym</h2>
      </div>

      <p className="text-[10px] text-gba-light/70 mb-6">
        Log your workout to earn XP and collect Fitness Sprites!
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Exercise Type */}
        <div className="text-left">
          <label className="block text-[10px] text-gba-light/70 mb-2">
            Exercise Type
          </label>
          <select
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            className="w-full px-3 py-2 bg-gba-wall/30 border border-gba-path rounded-lg text-xs text-gba-light focus:outline-none focus:border-red-400"
          >
            <option value="">Select exercise...</option>
            {EXERCISE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div className="text-left">
          <label className="block text-[10px] text-gba-light/70 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            max="180"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="30"
            className="w-full px-3 py-2 bg-gba-wall/30 border border-gba-path rounded-lg text-xs text-gba-light focus:outline-none focus:border-red-400 placeholder:text-gba-light/30"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600 hover:bg-red-500 rounded-lg transition-colors text-xs"
        >
          <Plus size={14} />
          Log Workout
        </button>
      </form>

      {dailyStats.workoutsLogged === 0 && (
        <p className="mt-4 text-[8px] text-yellow-400">
          First workout of the day = bonus XP!
        </p>
      )}
    </div>
  )
}
