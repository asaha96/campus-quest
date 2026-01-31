import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { completeTutorial } from '../../features/storySlice'
import { ArrowRight, ArrowLeft } from 'lucide-react'

const TUTORIAL_STEPS = [
  {
    title: 'Welcome to Campus Quest!',
    content: 'Your journey to becoming a productivity champion starts here. This RPG will help you build better habits through play.',
    image: '🎮',
  },
  {
    title: 'Move Around',
    content: 'Use WASD or Arrow Keys to move around campus. Press Space or Enter to interact with people and objects.',
    image: '🕹️',
  },
  {
    title: 'Focus Sessions',
    content: 'Visit the Library to start focus sessions. Complete them to earn XP and level up!',
    image: '📚',
  },
  {
    title: 'Catch Sprites',
    content: 'Walk through the grass on campus to encounter productivity sprites. Build your collection!',
    image: '✨',
  },
  {
    title: 'Complete Quests',
    content: 'Press J to open your Quest Journal. Complete quests to progress through the story.',
    image: '📜',
  },
  {
    title: 'Daily Challenges',
    content: 'Press C to view daily challenges. Complete them for bonus XP and build streaks!',
    image: '🎯',
  },
  {
    title: 'Quick Keys',
    content: 'M - Map | T - Team | J - Journal | C - Challenges. Master these shortcuts!',
    image: '⌨️',
  },
  {
    title: 'Ready to Begin!',
    content: 'Your adventure awaits. Explore the campus, meet NPCs, and become the ultimate Campus Champion!',
    image: '🏆',
  },
]

export default function TutorialOverlay({ onComplete }) {
  const dispatch = useDispatch()
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = useCallback(() => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      dispatch(completeTutorial())
      onComplete?.()
    }
  }, [currentStep, dispatch, onComplete])

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  const handleSkip = useCallback(() => {
    dispatch(completeTutorial())
    onComplete?.()
  }, [dispatch, onComplete])

  const step = TUTORIAL_STEPS[currentStep]
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center">
      <div className="bg-gba-dark border-4 border-gba-accent rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-4">
          {TUTORIAL_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentStep
                  ? 'bg-gba-accent'
                  : idx < currentStep
                  ? 'bg-gba-accent/50'
                  : 'bg-gba-wall/50'
              }`}
            />
          ))}
        </div>

        {/* Image */}
        <div className="text-6xl text-center mb-4 animate-bounce">
          {step.image}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gba-light text-center mb-2">
          {step.title}
        </h2>

        {/* Content */}
        <p className="text-gba-light/80 text-center mb-6">
          {step.content}
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center gap-1 px-4 py-2 rounded transition-colors
              ${currentStep === 0
                ? 'text-gba-light/30 cursor-not-allowed'
                : 'text-gba-light hover:bg-gba-wall/30'
              }`}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            onClick={handleSkip}
            className="text-xs text-gba-light/40 hover:text-gba-light/60"
          >
            Skip Tutorial
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 bg-gba-accent text-gba-dark
                     font-medium rounded hover:bg-gba-accent/80 transition-colors"
          >
            {isLastStep ? 'Start Game!' : 'Next'}
            {!isLastStep && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
