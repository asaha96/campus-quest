import { useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getCutscene, getTextStyle } from '../../data/cutscenes'
import { skipCutscene, endCutscene } from '../../features/cutsceneSlice'
import { createCutsceneRunner } from '../../utils/cutsceneActions'
import useCinematicCamera from '../../hooks/useCinematicCamera'
import CharacterSprite from '../Sprites/CharacterSprite'
import { TILE_SIZE } from '../../data/maps'

export default function CutscenePlayer() {
  const dispatch = useDispatch()
  const cutsceneState = useSelector(state => state.cutscene || {})
  const cinematicCamera = useCinematicCamera()
  const runnerRef = useRef(null)

  // Safely destructure with defaults
  const isPlaying = cutsceneState.isPlaying || false
  const currentCutscene = cutsceneState.currentCutscene || null
  const fadeOpacity = cutsceneState.fadeOpacity || 0
  const shakeOffset = cutsceneState.shakeOffset || { x: 0, y: 0 }
  const displayText = cutsceneState.displayText || null
  const textStyle = cutsceneState.textStyle || null
  const cutsceneCharacters = cutsceneState.cutsceneCharacters || []
  const canSkip = cutsceneState.canSkip !== undefined ? cutsceneState.canSkip : true

  const cutscene = currentCutscene ? getCutscene(currentCutscene) : null

  // Start cutscene when it changes
  useEffect(() => {
    if (isPlaying && currentCutscene && !runnerRef.current) {
      const runner = createCutsceneRunner(currentCutscene, dispatch, cinematicCamera)
      runnerRef.current = runner
      runner.run()
    }

    return () => {
      if (runnerRef.current) {
        runnerRef.current.cancel()
        runnerRef.current = null
      }
    }
  }, [isPlaying, currentCutscene, dispatch, cinematicCamera])

  // Handle skip
  const handleSkip = useCallback(() => {
    if (canSkip && runnerRef.current) {
      runnerRef.current.cancel()
      runnerRef.current = null
      dispatch(skipCutscene())
    }
  }, [canSkip, dispatch])

  // Keyboard controls
  useEffect(() => {
    if (!isPlaying) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (canSkip) {
          handleSkip()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, canSkip, handleSkip])

  if (!isPlaying) return null

  const textStyleObj = textStyle ? getTextStyle(textStyle) : null

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto">
      {/* Fade overlay */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{ opacity: fadeOpacity }}
      />

      {/* Shake container */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${shakeOffset.x}px, ${shakeOffset.y}px)`,
        }}
      >
        {/* Cutscene characters */}
        <div className="absolute inset-0 flex items-center justify-center">
          {cutsceneCharacters.map((char) => (
            <div
              key={char.id}
              className="absolute transition-all duration-200"
              style={{
                left: `calc(50% + ${(char.position.x - 50) * TILE_SIZE}px)`,
                top: `calc(50% + ${(char.position.y - 50) * TILE_SIZE}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <CharacterSprite
                characterId={char.id}
                direction={char.direction}
                isMoving={false}
                scale={1.5}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Text display */}
      {displayText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`text-center px-8 py-4 animate-fade-in ${
              textStyle === 'warning' ? 'animate-pulse' : ''
            }`}
            style={{
              fontSize: textStyleObj?.fontSize || '24px',
              fontWeight: textStyleObj?.fontWeight || 'normal',
              color: textStyleObj?.color || '#fff',
              textShadow: textStyleObj?.textShadow || '2px 2px 4px rgba(0,0,0,0.8)',
              fontStyle: textStyleObj?.fontStyle || 'normal',
            }}
          >
            {displayText}
          </div>
        </div>
      )}

      {/* Skip prompt */}
      {canSkip && (
        <div className="absolute bottom-4 right-4">
          <button
            onClick={handleSkip}
            className="px-4 py-2 bg-gba-dark/80 border border-gba-path/50 rounded
                     text-gba-light/70 text-sm hover:bg-gba-path/30 transition-colors"
          >
            Press ESC to skip
          </button>
        </div>
      )}

      {/* Cutscene title (optional) */}
      {cutscene?.title && fadeOpacity < 0.5 && (
        <div className="absolute top-4 left-4">
          <span className="text-xs text-gba-light/30 bg-gba-dark/50 px-2 py-1 rounded">
            {cutscene.title}
          </span>
        </div>
      )}
    </div>
  )
}
