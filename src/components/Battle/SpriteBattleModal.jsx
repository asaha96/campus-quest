import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, addXp, addSprite, showToast } from '../../features/gameStateSlice'
import {
  startWildEncounter,
  selectMove,
  enemyMove,
  attemptCatch,
  runFromBattle,
  endBattle,
  setBattlePhase,
} from '../../features/spriteBattleSlice'
import {
  sprites,
  getRandomWildSprite,
  calculateSpriteDamage,
  checkAccuracy,
} from '../../data/sprites'
import useSound from '../../hooks/useSound'

export default function SpriteBattleModal({ onClose }) {
  const dispatch = useDispatch()
  const spriteBattle = useSelector((state) => state.spriteBattle || {})
  const gameState = useSelector((state) => state.gameState || {})
  const { playSuccess, playError, playCollect, playStep } = useSound()

  // Safely destructure with defaults
  const isInBattle = spriteBattle.isInBattle || false
  const battlePhase = spriteBattle.battlePhase || 'idle'
  const activeSprite = spriteBattle.activeSprite || null
  const activeSpriteHp = spriteBattle.activeSpriteHp || 0
  const wildSprite = spriteBattle.wildSprite || null
  const wildSpriteHp = spriteBattle.wildSpriteHp || 0
  const battleLog = spriteBattle.battleLog || []
  const caughtSprites = spriteBattle.caughtSprites || []
  const collectedSprites = gameState.collectedSprites || []
  const currentZone = gameState.currentZone || 'campus'

  const [showMoves, setShowMoves] = useState(false)

  // Initialize battle on mount
  useEffect(() => {
    if (!isInBattle) {
      // Get player's first sprite, or use a default
      const playerSprite = sprites.find((s) => collectedSprites.includes(s.id)) || sprites[0]
      const wild = getRandomWildSprite(currentZone, caughtSprites)

      if (wild && playerSprite) {
        dispatch(startWildEncounter({ activeSprite: playerSprite, wildSprite: wild }))
        playCollect()
      } else {
        // No sprites available
        dispatch(showToast('No wild sprites nearby...'))
        onClose()
      }
    }
  }, [])

  // Handle enemy turn
  useEffect(() => {
    if (battlePhase === 'enemy_turn' && wildSprite) {
      const timer = setTimeout(() => {
        // Enemy picks a random move
        const move = wildSprite.moves[Math.floor(Math.random() * wildSprite.moves.length)]
        const hit = checkAccuracy(move)
        const damage = hit ? calculateSpriteDamage(wildSprite, move, activeSprite) : 0

        dispatch(enemyMove({ move, damage, hit }))
        if (hit && move.type === 'attack') {
          playError()
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [battlePhase, wildSprite, activeSprite, dispatch, playError])

  // Handle victory/defeat/caught
  useEffect(() => {
    if (battlePhase === 'victory') {
      playSuccess()
      dispatch(addXp(wildSprite?.xpReward || 20))
      dispatch(showToast(`Victory! +${wildSprite?.xpReward || 20} XP`))
    } else if (battlePhase === 'caught') {
      playCollect()
      dispatch(addSprite(wildSprite.id))
      dispatch(addXp(wildSprite?.xpReward * 2 || 40))
      dispatch(showToast(`${wildSprite.name} caught! +${wildSprite?.xpReward * 2 || 40} XP`))
    } else if (battlePhase === 'defeat') {
      playError()
      dispatch(showToast('Your sprite fainted...'))
    }
  }, [battlePhase, wildSprite, dispatch, playSuccess, playCollect, playError])

  const handleMove = (move) => {
    if (battlePhase !== 'player_turn') return

    const hit = checkAccuracy(move)
    const damage = hit ? calculateSpriteDamage(activeSprite, move, wildSprite) : 0

    dispatch(selectMove({ move, damage, hit }))
    setShowMoves(false)

    if (hit) {
      move.type === 'attack' ? playStep() : playSuccess()
    }
  }

  const handleCatch = () => {
    if (battlePhase !== 'player_turn') return

    // Calculate catch chance based on wild sprite HP and catch rate
    const hpFactor = 1 - wildSpriteHp / wildSprite.stats.hp
    const catchChance = wildSprite.catchRate * (1 + hpFactor)
    const success = Math.random() < catchChance

    dispatch(attemptCatch({ success }))

    if (!success) {
      playError()
    }
  }

  const handleRun = () => {
    dispatch(runFromBattle())
    onClose()
  }

  const handleEnd = () => {
    dispatch(endBattle())
    onClose()
  }

  if (!wildSprite || !activeSprite) {
    return (
      <div className="text-center p-4">
        <p className="text-gba-light">Loading battle...</p>
      </div>
    )
  }

  const isActionDisabled = battlePhase !== 'player_turn'
  const isBattleOver = ['victory', 'defeat', 'caught'].includes(battlePhase)

  return (
    <div className="flex flex-col gap-3 text-gba-dark">
      <h2 className="text-lg font-bold text-center text-gba-light border-b border-gba-path pb-2">
        Wild Sprite Battle!
      </h2>

      {/* Battle arena */}
      <div className="relative bg-gradient-to-b from-green-900/30 to-green-800/20 rounded-lg p-4 border border-green-700/30">
        {/* Wild sprite (top right) */}
        <div className="flex justify-end mb-4">
          <div className="bg-gba-dark/60 rounded-lg p-2 w-36">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{wildSprite.emoji}</span>
              <span className="text-xs text-gba-light font-bold">{wildSprite.name}</span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded">
              <div
                className="bg-red-500 h-full rounded transition-all duration-300"
                style={{ width: `${(wildSpriteHp / wildSprite.stats.hp) * 100}%` }}
              />
            </div>
            <div className="text-[8px] text-gba-light/70 text-right">
              {wildSpriteHp}/{wildSprite.stats.hp}
            </div>
          </div>
        </div>

        {/* Sprites visualization */}
        <div className="flex justify-between items-end px-4 py-2">
          <span className="text-4xl animate-bounce">{activeSprite.emoji}</span>
          <span
            className={`text-5xl ${
              battlePhase === 'enemy_turn' ? 'animate-pulse' : ''
            }`}
          >
            {wildSprite.emoji}
          </span>
        </div>

        {/* Player sprite (bottom left) */}
        <div className="flex justify-start mt-2">
          <div className="bg-gba-dark/60 rounded-lg p-2 w-36">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{activeSprite.emoji}</span>
              <span className="text-xs text-gba-light font-bold">{activeSprite.name}</span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded">
              <div
                className="bg-green-500 h-full rounded transition-all duration-300"
                style={{
                  width: `${(activeSpriteHp / activeSprite.stats.hp) * 100}%`,
                }}
              />
            </div>
            <div className="text-[8px] text-gba-light/70 text-right">
              {activeSpriteHp}/{activeSprite.stats.hp}
            </div>
          </div>
        </div>
      </div>

      {/* Battle log */}
      <div className="bg-gba-dark border border-gba-path rounded p-2 min-h-[50px] max-h-20 overflow-y-auto">
        {battleLog.slice(-3).map((log, i) => (
          <p
            key={i}
            className={`text-[10px] ${
              i === battleLog.length - 1 ? 'text-gba-light font-bold' : 'text-gba-light/60'
            }`}
          >
            {log}
          </p>
        ))}
      </div>

      {/* Actions */}
      {!isBattleOver ? (
        <div className="space-y-2">
          {showMoves ? (
            <div className="grid grid-cols-2 gap-2">
              {activeSprite.moves.map((move) => (
                <button
                  key={move.name}
                  onClick={() => handleMove(move)}
                  disabled={isActionDisabled}
                  className={`p-2 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                    move.type === 'heal'
                      ? 'bg-green-600/80 hover:bg-green-500'
                      : 'bg-red-600/80 hover:bg-red-500'
                  }`}
                >
                  {move.name}
                  <span className="block text-[8px] opacity-70">
                    {move.type === 'heal' ? '❤️' : '⚔️'} {move.power}
                  </span>
                </button>
              ))}
              <button
                onClick={() => setShowMoves(false)}
                className="col-span-2 p-1 text-[10px] text-gba-light/50 hover:text-gba-light"
              >
                Back
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowMoves(true)}
                disabled={isActionDisabled}
                className="p-2 bg-red-600/80 hover:bg-red-500 rounded text-xs font-bold disabled:opacity-50"
              >
                ⚔️ Fight
              </button>
              <button
                onClick={handleCatch}
                disabled={isActionDisabled}
                className="p-2 bg-blue-600/80 hover:bg-blue-500 rounded text-xs font-bold disabled:opacity-50"
              >
                🎯 Catch
              </button>
              <button
                onClick={handleRun}
                disabled={isActionDisabled}
                className="col-span-2 p-1 text-xs text-gba-light/50 hover:text-gba-light"
              >
                🏃 Run
              </button>
            </div>
          )}

          {battlePhase === 'enemy_turn' && (
            <div className="text-center text-[10px] text-gba-light/50 animate-pulse">
              Enemy turn...
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleEnd}
          className={`w-full p-3 rounded font-bold text-sm ${
            battlePhase === 'defeat'
              ? 'bg-red-600/80 hover:bg-red-500'
              : 'bg-green-600/80 hover:bg-green-500'
          }`}
        >
          {battlePhase === 'victory' && 'Collect XP & Continue'}
          {battlePhase === 'caught' && `Welcome ${wildSprite.name}!`}
          {battlePhase === 'defeat' && 'Retreat...'}
        </button>
      )}
    </div>
  )
}
