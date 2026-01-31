import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { advanceDialogue, endDialogue, setDialoguePage } from '../../features/storySlice'
import { addXp, addWaterGlass, showToast } from '../../features/gameStateSlice'
import { getDialogue } from '../../data/story/dialogues'
import { CharacterPortrait } from '../Sprites/CharacterSprite'

const TYPEWRITER_SPEED = 30 // ms per character

export default function DialogueBox() {
  const dispatch = useDispatch()
  const storyState = useSelector(state => state.story || {})
  const currentDialogue = storyState.currentDialogue || null
  const dialoguePageIndex = storyState.dialoguePageIndex || 0
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showChoices, setShowChoices] = useState(false)

  const dialogue = currentDialogue ? getDialogue(currentDialogue) : null
  const currentPage = dialogue?.pages?.[dialoguePageIndex]

  // Typewriter effect
  useEffect(() => {
    if (!currentPage?.text) return

    setDisplayedText('')
    setIsTyping(true)
    setShowChoices(false)

    let index = 0
    const text = currentPage.text

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setIsTyping(false)
        // Show choices after text is complete
        if (currentPage.choices) {
          setShowChoices(true)
        }
      }
    }, TYPEWRITER_SPEED)

    return () => clearInterval(timer)
  }, [currentPage])

  // Handle advancing dialogue
  const handleAdvance = useCallback(() => {
    if (isTyping) {
      // Skip typewriter, show full text
      setDisplayedText(currentPage?.text || '')
      setIsTyping(false)
      if (currentPage?.choices) {
        setShowChoices(true)
      }
      return
    }

    // Process any actions on the current page
    if (currentPage?.action) {
      processAction(currentPage.action)
    }

    // If there are choices and they're visible, don't auto-advance
    if (currentPage?.choices && showChoices) {
      return
    }

    // Advance to next page or end dialogue
    if (dialogue && dialoguePageIndex < dialogue.pages.length - 1) {
      dispatch(advanceDialogue())
    } else {
      dispatch(endDialogue())
    }
  }, [dispatch, currentPage, dialogue, dialoguePageIndex, isTyping, showChoices])

  // Process dialogue actions
  const processAction = useCallback((action) => {
    switch (action.type) {
      case 'grant_xp':
        dispatch(addXp(action.amount))
        dispatch(showToast(`+${action.amount} XP!`))
        break
      case 'add_water':
        dispatch(addWaterGlass())
        dispatch(showToast('Hydration +1!'))
        break
      default:
        break
    }
  }, [dispatch])

  // Handle choice selection
  const handleChoice = useCallback((choice) => {
    // Process choice action if any
    if (choice.action) {
      processAction(choice.action)
    }

    // Navigate to next dialogue or end
    if (choice.next) {
      // Switch to a different dialogue tree
      dispatch(endDialogue())
      // The next dialogue would be started by the quest system
    } else {
      dispatch(endDialogue())
    }
  }, [dispatch, processAction])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault()
        if (e.key === 'Escape') {
          dispatch(endDialogue())
        } else {
          handleAdvance()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleAdvance, dispatch])

  if (!dialogue || !currentPage) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-8">
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={handleAdvance} />

      {/* Dialogue box */}
      <div className="relative w-full max-w-2xl mx-4">
        {/* Speaker portrait and name */}
        <div className="flex items-end mb-2">
          {dialogue.spriteId && (
            <CharacterPortrait
              characterId={dialogue.spriteId}
              size={64}
              className="mr-3"
            />
          )}
          <div className="bg-gba-dark border-2 border-gba-path rounded-t-lg px-4 py-1">
            <span className="text-sm text-gba-light font-bold">
              {dialogue.speaker}
            </span>
          </div>
        </div>

        {/* Main text box */}
        <div className="bg-gba-dark border-4 border-gba-path rounded-lg p-4 min-h-[120px]">
          {/* Dialogue text with typewriter effect */}
          <p className="text-gba-light text-sm leading-relaxed mb-4">
            {displayedText}
            {isTyping && <span className="animate-pulse">|</span>}
          </p>

          {/* Choices */}
          {showChoices && currentPage.choices && (
            <div className="flex flex-col gap-2 mt-4 border-t border-gba-path/30 pt-4">
              {currentPage.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  className="text-left px-3 py-2 bg-gba-wall/30 hover:bg-gba-path/50
                           border border-gba-path/50 rounded transition-colors
                           text-gba-light text-sm"
                >
                  <span className="text-gba-accent mr-2">{'>'}</span>
                  {choice.text}
                </button>
              ))}
            </div>
          )}

          {/* Continue indicator */}
          {!isTyping && !showChoices && (
            <div className="absolute bottom-2 right-4 animate-bounce">
              <span className="text-gba-accent text-lg">▼</span>
            </div>
          )}
        </div>

        {/* Page indicator */}
        {dialogue.pages.length > 1 && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gba-light/50">
            {dialoguePageIndex + 1} / {dialogue.pages.length}
          </div>
        )}
      </div>
    </div>
  )
}
