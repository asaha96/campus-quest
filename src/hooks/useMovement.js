import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { movePlayer, setDirection, setMoving } from '../features/playerSlice'
import { openModal } from '../features/gameStateSlice'
import { isWalkable, getTileAt, TILES } from '../data/maps'
import { getInteraction } from '../data/interactions'
import useSound from './useSound'

const MOVE_KEYS = {
  ArrowUp: { dx: 0, dy: -1, dir: 'up' },
  ArrowDown: { dx: 0, dy: 1, dir: 'down' },
  ArrowLeft: { dx: -1, dy: 0, dir: 'left' },
  ArrowRight: { dx: 1, dy: 0, dir: 'right' },
  w: { dx: 0, dy: -1, dir: 'up' },
  W: { dx: 0, dy: -1, dir: 'up' },
  s: { dx: 0, dy: 1, dir: 'down' },
  S: { dx: 0, dy: 1, dir: 'down' },
  a: { dx: -1, dy: 0, dir: 'left' },
  A: { dx: -1, dy: 0, dir: 'left' },
  d: { dx: 1, dy: 0, dir: 'right' },
  D: { dx: 1, dy: 0, dir: 'right' },
}

const INTERACT_KEYS = ['Enter', ' ']

export default function useMovement() {
  const dispatch = useDispatch()
  const { position, direction } = useSelector(state => state.player)
  const { activeModal } = useSelector(state => state.gameState)
  const { playStep, playMenuOpen } = useSound()

  const getFacingTile = useCallback(() => {
    const dirs = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    }
    const delta = dirs[direction]
    return {
      x: position.x + delta.x,
      y: position.y + delta.y,
    }
  }, [position, direction])

  const handleInteract = useCallback(() => {
    // Check the tile we're standing on
    const currentInteraction = getInteraction(position.x, position.y)
    if (currentInteraction) {
      playMenuOpen()
      dispatch(openModal(currentInteraction.type))
      return
    }

    // Check the tile we're facing
    const facing = getFacingTile()
    const facingInteraction = getInteraction(facing.x, facing.y)
    if (facingInteraction) {
      playMenuOpen()
      dispatch(openModal(facingInteraction.type))
      return
    }

    // Check if we're facing a door tile
    const facingTile = getTileAt(facing.x, facing.y)
    if (facingTile === TILES.DOOR) {
      const doorInteraction = getInteraction(facing.x, facing.y)
      if (doorInteraction) {
        playMenuOpen()
        dispatch(openModal(doorInteraction.type))
      }
    }
  }, [dispatch, position, getFacingTile, playMenuOpen])

  const handleKeyDown = useCallback((e) => {
    // Don't process movement if a modal is open
    if (activeModal) return

    // Handle movement
    const moveData = MOVE_KEYS[e.key]
    if (moveData) {
      e.preventDefault()
      const { dx, dy, dir } = moveData
      const newX = position.x + dx
      const newY = position.y + dy

      dispatch(setDirection(dir))

      if (isWalkable(newX, newY)) {
        dispatch(setMoving(true))
        dispatch(movePlayer({ x: newX, y: newY }))
        playStep()

        // Reset moving state after animation
        setTimeout(() => {
          dispatch(setMoving(false))
        }, 150)
      }
      return
    }

    // Handle interaction
    if (INTERACT_KEYS.includes(e.key)) {
      e.preventDefault()
      handleInteract()
    }
  }, [dispatch, position, activeModal, handleInteract, playStep])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return { position, direction }
}
