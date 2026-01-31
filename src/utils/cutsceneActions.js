// Scene execution functions for cutscene system
// Each function handles a specific scene type and returns a promise

import { getCutscene, getTextStyle } from '../data/cutscenes'
import {
  advanceScene,
  endCutscene,
  setFadeOpacity,
  setDisplayText,
  clearDisplayText,
  spawnCutsceneCharacter,
  moveCutsceneCharacter,
  setCameraPosition,
} from '../features/cutsceneSlice'
import { startDialogue } from '../features/storySlice'

// Wait for specified duration
const wait = (duration) => {
  return new Promise(resolve => setTimeout(resolve, duration))
}

// Animate a value from start to end over duration
const animate = (start, end, duration, onUpdate) => {
  return new Promise((resolve) => {
    const startTime = Date.now()
    const delta = end - start

    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease-in-out
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      const value = start + delta * eased
      onUpdate(value)

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        onUpdate(end)
        resolve()
      }
    }

    requestAnimationFrame(tick)
  })
}

// Execute a single scene
export const executeScene = async (scene, dispatch, cinematicCamera) => {
  switch (scene.type) {
    case 'fade_in':
      await animate(1, 0, scene.duration, (opacity) => {
        dispatch(setFadeOpacity(opacity))
      })
      break

    case 'fade_out':
      await animate(0, 1, scene.duration, (opacity) => {
        dispatch(setFadeOpacity(opacity))
      })
      break

    case 'show_text':
      dispatch(setDisplayText({
        text: scene.text,
        style: scene.style,
      }))
      await wait(scene.duration)
      dispatch(clearDisplayText())
      break

    case 'camera_pan':
      if (cinematicCamera) {
        await cinematicCamera.panCamera(scene.from, scene.to, scene.duration)
      } else {
        // Fallback if camera hook not available
        dispatch(setCameraPosition(scene.to))
        await wait(scene.duration)
      }
      break

    case 'spawn_character':
      dispatch(spawnCutsceneCharacter({
        characterId: scene.characterId,
        position: scene.position,
        direction: scene.direction || 'down',
      }))
      break

    case 'character_move':
      // Move character along path
      for (const point of scene.path) {
        // Calculate direction based on movement
        const char = scene.characterId
        dispatch(moveCutsceneCharacter({
          characterId: char,
          position: point,
        }))
        await wait(scene.speed || 200)
      }
      break

    case 'screen_shake':
      if (cinematicCamera) {
        await cinematicCamera.shakeScreen(scene.intensity, scene.duration)
      } else {
        await wait(scene.duration)
      }
      break

    case 'wait':
      await wait(scene.duration)
      break

    case 'dialogue':
      dispatch(startDialogue({ dialogueId: scene.dialogueId }))
      // Wait for dialogue to complete - this is handled by the dialogue system
      // For now, just pause briefly
      await wait(500)
      break

    case 'zoom':
      if (cinematicCamera) {
        await cinematicCamera.zoomCamera(scene.level, scene.duration)
      }
      break

    default:
      console.warn(`Unknown scene type: ${scene.type}`)
      break
  }
}

// Run complete cutscene
export const runCutscene = async (cutsceneId, dispatch, cinematicCamera) => {
  const cutscene = getCutscene(cutsceneId)
  if (!cutscene) {
    console.error(`Cutscene not found: ${cutsceneId}`)
    dispatch(endCutscene())
    return
  }

  for (let i = 0; i < cutscene.scenes.length; i++) {
    const scene = cutscene.scenes[i]
    await executeScene(scene, dispatch, cinematicCamera)
    dispatch(advanceScene())
  }

  dispatch(endCutscene())
}

// Create cutscene runner that can be cancelled
export const createCutsceneRunner = (cutsceneId, dispatch, cinematicCamera) => {
  let cancelled = false

  const run = async () => {
    const cutscene = getCutscene(cutsceneId)
    if (!cutscene) {
      dispatch(endCutscene())
      return
    }

    for (let i = 0; i < cutscene.scenes.length; i++) {
      if (cancelled) {
        dispatch(endCutscene())
        return
      }

      const scene = cutscene.scenes[i]
      await executeScene(scene, dispatch, cinematicCamera)

      if (!cancelled) {
        dispatch(advanceScene())
      }
    }

    if (!cancelled) {
      dispatch(endCutscene())
    }
  }

  const cancel = () => {
    cancelled = true
  }

  return { run, cancel }
}

export default {
  executeScene,
  runCutscene,
  createCutsceneRunner,
}
