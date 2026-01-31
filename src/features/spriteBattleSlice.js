import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isInBattle: false,
  battlePhase: 'idle', // 'idle', 'player_turn', 'enemy_turn', 'catching', 'victory', 'defeat', 'caught'
  activeSprite: null,      // Player's current sprite
  activeSpriteHp: 0,
  wildSprite: null,        // The wild sprite being fought
  wildSpriteHp: 0,
  battleLog: [],
  turn: 0,
  lastAction: null,
  caughtSprites: [],       // IDs of wild sprites caught
}

export const spriteBattleSlice = createSlice({
  name: 'spriteBattle',
  initialState,
  reducers: {
    startWildEncounter: (state, action) => {
      const { activeSprite, wildSprite } = action.payload
      state.isInBattle = true
      state.battlePhase = 'player_turn'
      state.activeSprite = activeSprite
      state.activeSpriteHp = activeSprite?.stats?.hp || 50
      state.wildSprite = wildSprite
      state.wildSpriteHp = wildSprite.stats.hp
      state.battleLog = [`A wild ${wildSprite.emoji} ${wildSprite.name} appeared!`]
      state.turn = 1
      state.lastAction = null
    },

    selectMove: (state, action) => {
      const { move, damage, hit } = action.payload
      if (!hit) {
        state.battleLog.push(`${state.activeSprite.name} used ${move.name}... but it missed!`)
      } else if (move.type === 'heal') {
        state.activeSpriteHp = Math.min(
          state.activeSprite.stats.hp,
          state.activeSpriteHp + damage
        )
        state.battleLog.push(`${state.activeSprite.name} used ${move.name}! Healed ${damage} HP!`)
      } else {
        state.wildSpriteHp = Math.max(0, state.wildSpriteHp - damage)
        state.battleLog.push(`${state.activeSprite.name} used ${move.name}! Dealt ${damage} damage!`)
      }
      state.battlePhase = state.wildSpriteHp <= 0 ? 'victory' : 'enemy_turn'
      state.lastAction = { type: 'move', move, damage }
    },

    enemyMove: (state, action) => {
      const { move, damage, hit } = action.payload
      if (!hit) {
        state.battleLog.push(`${state.wildSprite.name} used ${move.name}... but it missed!`)
      } else if (move.type === 'heal') {
        state.wildSpriteHp = Math.min(
          state.wildSprite.stats.hp,
          state.wildSpriteHp + damage
        )
        state.battleLog.push(`${state.wildSprite.name} used ${move.name}! Healed ${damage} HP!`)
      } else {
        state.activeSpriteHp = Math.max(0, state.activeSpriteHp - damage)
        state.battleLog.push(`${state.wildSprite.name} used ${move.name}! Dealt ${damage} damage!`)
      }
      state.turn += 1
      state.battlePhase = state.activeSpriteHp <= 0 ? 'defeat' : 'player_turn'
      state.lastAction = { type: 'enemy_move', move, damage }
    },

    attemptCatch: (state, action) => {
      const { success } = action.payload
      state.battlePhase = 'catching'

      if (success) {
        state.battleLog.push(`You threw a capture orb...`)
        state.battleLog.push(`Gotcha! ${state.wildSprite.name} was caught!`)
        state.caughtSprites.push(state.wildSprite.id)
        state.battlePhase = 'caught'
      } else {
        state.battleLog.push(`You threw a capture orb...`)
        state.battleLog.push(`Oh no! ${state.wildSprite.name} broke free!`)
        state.battlePhase = 'enemy_turn'
      }
      state.lastAction = { type: 'catch', success }
    },

    runFromBattle: (state) => {
      state.battleLog.push('Got away safely!')
      state.battlePhase = 'idle'
      state.isInBattle = false
    },

    endBattle: (state) => {
      state.isInBattle = false
      state.battlePhase = 'idle'
      state.activeSprite = null
      state.wildSprite = null
      state.battleLog = []
      state.turn = 0
    },

    addToBattleLog: (state, action) => {
      state.battleLog.push(action.payload)
      // Keep only last 5 messages
      if (state.battleLog.length > 5) {
        state.battleLog = state.battleLog.slice(-5)
      }
    },

    setBattlePhase: (state, action) => {
      state.battlePhase = action.payload
    },
  },
})

export const {
  startWildEncounter,
  selectMove,
  enemyMove,
  attemptCatch,
  runFromBattle,
  endBattle,
  addToBattleLog,
  setBattlePhase,
} = spriteBattleSlice.actions

export default spriteBattleSlice.reducer
