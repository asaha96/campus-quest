import { useState, useCallback } from 'react'
import WorldMap from './components/Map/WorldMap'
import GameModal from './components/UI/GameModal'
import Toast from './components/UI/Toast'
import HUD from './components/UI/HUD'
import ZoneTransition from './components/UI/ZoneTransition'
import CutscenePlayer from './components/Cutscene/CutscenePlayer'
import DialogueBox from './components/Story/DialogueBox'
import AchievementPopup from './components/UI/AchievementPopup'
import TutorialOverlay from './components/Tutorial/TutorialOverlay'
import useMovement from './hooks/useMovement'
import useQuestTracking from './hooks/useQuestTracking'
import { useSelector } from 'react-redux'

function GameContainer() {
  // Initialize movement controls
  useMovement()

  // Initialize quest tracking
  useQuestTracking()

  // Check for active dialogue
  const { currentDialogue, tutorialComplete } = useSelector(state => state.story || {})
  const [showTutorial, setShowTutorial] = useState(!tutorialComplete)

  const handleTutorialComplete = useCallback(() => {
    setShowTutorial(false)
  }, [])

  return (
    <div className="relative">
      <HUD />
      <WorldMap />
      <GameModal />
      <Toast />
      <ZoneTransition />
      <CutscenePlayer />
      <AchievementPopup />
      {currentDialogue && <DialogueBox />}
      {showTutorial && <TutorialOverlay onComplete={handleTutorialComplete} />}

      {/* Controls hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gba-dark/80 border border-gba-path/50 rounded-lg px-4 py-2">
        <p className="text-[8px] text-gba-light/60 text-center">
          WASD/Arrows to move | Space/Enter to interact | M for map | J for journal | C for challenges
        </p>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="app-container flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-lg text-gba-light mb-4 tracking-wider">
        Campus Quest
      </h1>
      <GameContainer />
    </div>
  )
}

export default App
