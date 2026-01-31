import { useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  movePlayer,
  setDirection,
  setMoving,
  setVisualPosition,
  setInputLocked,
  teleportPlayer,
} from '../features/playerSlice'
import { openModal } from '../features/gameStateSlice'
import { startZoneTransition, completeZoneTransition } from '../features/mapSlice'
import { TILES } from '../data/maps'
import { getZone, getZoneFromDoor, getExitAt, getNpcAt, getInteractableAt } from '../data/zones'
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
const MINIMAP_KEYS = ['m', 'M']
const TEAM_KEYS = ['t', 'T']
const JOURNAL_KEYS = ['j', 'J']
const CHALLENGES_KEYS = ['c', 'C']

const MOVEMENT_DURATION = 150 // ms
const TRANSITION_DURATION = 100 // ms for zone transition
const ENCOUNTER_CHANCE = 0.05 // 5% per step on grass

export default function useMovement() {
  const dispatch = useDispatch()

  // Direct state access with defaults
  const position = useSelector((state) => state.player?.position) || { x: 50, y: 50 }
  const direction = useSelector((state) => state.player?.direction) || 'down'
  const isInputLocked = useSelector((state) => state.player?.isInputLocked) || false
  const visualPosition = useSelector((state) => state.player?.visualPosition) || position
  const activeModal = useSelector((state) => state.gameState?.activeModal) || null
  const grid = useSelector((state) => state.map?.grid) || []
  const width = useSelector((state) => state.map?.width) || 100
  const height = useSelector((state) => state.map?.height) || 100
  const currentZone = useSelector((state) => state.map?.currentZone) || 'campus'
  const isTransitioning = useSelector((state) => state.map?.isTransitioning) || false

  const { playStep, playMenuOpen, playCollect } = useSound()

  const movementTimeoutRef = useRef(null)
  const transitionTimeoutRef = useRef(null)

  // Helper to check walkability
  const isWalkable = useCallback(
    (x, y) => {
      if (x < 0 || x >= width || y < 0 || y >= height) {
        return false
      }
      if (!grid || !grid[y]) {
        return false
      }
      const tile = grid[y][x]
      return tile === TILES.GRASS || tile === TILES.PATH || tile === TILES.DOOR
    },
    [grid, width, height]
  )

  // Helper to get tile type
  const getTileAt = useCallback(
    (x, y) => {
      if (x < 0 || x >= width || y < 0 || y >= height) {
        return null
      }
      return grid[y][x]
    },
    [grid, width, height]
  )

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

  // Check for random encounter
  const checkRandomEncounter = useCallback(
    (tileType) => {
      // Only on campus grass tiles
      if (currentZone === 'campus' && tileType === TILES.GRASS && Math.random() < ENCOUNTER_CHANCE) {
        playCollect()
        dispatch(openModal('SPRITE_BATTLE'))
        return true
      }
      return false
    },
    [dispatch, playCollect, currentZone]
  )

  // Handle zone transition (entering/exiting buildings)
  const handleZoneTransition = useCallback(
    (targetZone, targetPos, transitionType) => {
      dispatch(setInputLocked(true))
      dispatch(startZoneTransition({ targetZone, transitionType }))
      playMenuOpen()

      // After transition animation, complete the zone change
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
      transitionTimeoutRef.current = setTimeout(() => {
        dispatch(completeZoneTransition({ targetZone }))

        // Teleport player to spawn/exit point in new zone
        const zone = getZone(targetZone)
        const newPos = targetPos || zone.spawnPoint
        dispatch(teleportPlayer(newPos))

        // Unlock after a short delay
        setTimeout(() => {
          dispatch(setInputLocked(false))
        }, 100)
      }, TRANSITION_DURATION)
    },
    [dispatch, playMenuOpen]
  )

  // Check if stepping on a door triggers zone transition
  const checkDoorTransition = useCallback(
    (x, y) => {
      if (currentZone === 'campus') {
        // Check if this door leads to an interior zone
        const targetZone = getZoneFromDoor(x, y)
        if (targetZone) {
          handleZoneTransition(targetZone, null, 'enter')
          return true
        }
      } else {
        // Check if this is an exit back to campus
        const exit = getExitAt(currentZone, x, y)
        if (exit) {
          handleZoneTransition(exit.targetZone, exit.targetPos, 'exit')
          return true
        }
      }
      return false
    },
    [currentZone, handleZoneTransition]
  )

  // Simple movement with CSS transition
  const processMovement = useCallback(
    (dir, dx, dy) => {
      if (isTransitioning) return

      const newX = position.x + dx
      const newY = position.y + dy

      dispatch(setDirection(dir))

      if (isWalkable(newX, newY)) {
        dispatch(setInputLocked(true))
        dispatch(setMoving(true))

        // Update logical position immediately
        dispatch(movePlayer({ x: newX, y: newY }))

        // Animate visual position
        dispatch(setVisualPosition({ x: newX, y: newY }))

        playStep()

        // Unlock after animation
        if (movementTimeoutRef.current) {
          clearTimeout(movementTimeoutRef.current)
        }
        movementTimeoutRef.current = setTimeout(() => {
          dispatch(setMoving(false))
          dispatch(setInputLocked(false))

          // Check if we stepped on a door
          const newTile = getTileAt(newX, newY)
          if (newTile === TILES.DOOR) {
            if (checkDoorTransition(newX, newY)) {
              return // Zone transition triggered
            }
          }

          // Check for random encounter after movement completes
          checkRandomEncounter(newTile)
        }, MOVEMENT_DURATION)
      }
    },
    [dispatch, position, isWalkable, playStep, getTileAt, checkRandomEncounter, checkDoorTransition, isTransitioning]
  )

  // Handle interaction
  const handleInteract = useCallback(() => {
    const facing = getFacingTile()
    const facingTile = getTileAt(facing.x, facing.y)

    // Check for NPC interaction
    const npc = getNpcAt(currentZone, facing.x, facing.y)
    if (npc) {
      playMenuOpen()
      // Open a dialogue modal with the NPC
      dispatch(openModal('NPC_DIALOGUE'))
      return
    }

    // Check for interactable objects
    const interactable = getInteractableAt(currentZone, facing.x, facing.y)
    if (interactable) {
      playMenuOpen()
      // Open appropriate modal based on interactable type
      switch (interactable.type) {
        case 'STUDY_DESK':
        case 'BOOKSHELF':
          dispatch(openModal('LIBRARY'))
          break
        case 'TREADMILL':
        case 'WEIGHTS':
          dispatch(openModal('GYM'))
          break
        case 'TABLE':
        case 'MENU':
          dispatch(openModal('CAFE'))
          break
        case 'BED':
        case 'DESK':
          dispatch(openModal('DORM'))
          break
        default:
          dispatch(openModal('INTERACT'))
      }
      return
    }

    // Check for door interaction (for entering zones via interact key)
    if (facingTile === TILES.DOOR) {
      if (currentZone === 'campus') {
        // Enter building
        const targetZone = getZoneFromDoor(facing.x, facing.y)
        if (targetZone) {
          handleZoneTransition(targetZone, null, 'enter')
        }
      } else {
        // Exit building
        const exit = getExitAt(currentZone, facing.x, facing.y)
        if (exit) {
          handleZoneTransition(exit.targetZone, exit.targetPos, 'exit')
        }
      }
    }
  }, [dispatch, getFacingTile, playMenuOpen, getTileAt, currentZone, handleZoneTransition])

  const handleKeyDown = useCallback(
    (e) => {
      if (activeModal) return

      // Minimap
      if (MINIMAP_KEYS.includes(e.key)) {
        e.preventDefault()
        playMenuOpen()
        dispatch(openModal('MINIMAP'))
        return
      }

      // Team view
      if (TEAM_KEYS.includes(e.key)) {
        e.preventDefault()
        playMenuOpen()
        dispatch(openModal('TEAM'))
        return
      }

      // Quest journal
      if (JOURNAL_KEYS.includes(e.key)) {
        e.preventDefault()
        playMenuOpen()
        dispatch(openModal('JOURNAL'))
        return
      }

      // Daily challenges
      if (CHALLENGES_KEYS.includes(e.key)) {
        e.preventDefault()
        playMenuOpen()
        dispatch(openModal('CHALLENGES'))
        return
      }

      // Movement
      const moveData = MOVE_KEYS[e.key]
      if (moveData) {
        e.preventDefault()
        if (!isInputLocked) {
          processMovement(moveData.dir, moveData.dx, moveData.dy)
        }
        return
      }

      // Interact
      if (INTERACT_KEYS.includes(e.key)) {
        e.preventDefault()
        if (!isInputLocked) {
          handleInteract()
        }
      }
    },
    [dispatch, activeModal, handleInteract, playMenuOpen, isInputLocked, processMovement]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (movementTimeoutRef.current) {
        clearTimeout(movementTimeoutRef.current)
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  return { position, direction, visualPosition }
}
