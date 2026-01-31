import WorldMap from './components/Map/WorldMap'
import GameModal from './components/UI/GameModal'
import Toast from './components/UI/Toast'
import HUD from './components/UI/HUD'
import useMovement from './hooks/useMovement'

function GameContainer() {
  // Initialize movement controls
  useMovement()

  return (
    <div className="relative">
      <HUD />
      <WorldMap />
      <GameModal />
      <Toast />

      {/* Controls hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gba-dark/80 border border-gba-path/50 rounded-lg px-4 py-2">
        <p className="text-[8px] text-gba-light/60 text-center">
          WASD/Arrows to move | Space/Enter to interact
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
