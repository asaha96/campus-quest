import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // Story progress
  currentChapter: 'freshman_orientation',
  completedChapters: [],

  // Quest tracking
  activeQuests: ['quest_welcome'], // Quests currently in progress
  completedQuests: [],
  questProgress: {}, // { questId: { objectiveId: true/false } }

  // Dialogue state
  currentDialogue: null,
  dialoguePageIndex: 0,
  dialogueHistory: [], // Record of all dialogues seen

  // Story flags (for branching narratives)
  storyFlags: {},

  // Journal open state
  isJournalOpen: false,

  // Tutorial completed
  tutorialComplete: false,

  // Total story XP earned
  storyXp: 0,

  // Unlocked story sprites
  unlockedSprites: [],

  // Badges earned
  badges: [],
}

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    // Quest management
    startQuest: (state, action) => {
      const questId = action.payload
      if (!state.activeQuests.includes(questId) && !state.completedQuests.includes(questId)) {
        state.activeQuests.push(questId)
        state.questProgress[questId] = {}
      }
    },

    updateQuestObjective: (state, action) => {
      const { questId, objectiveId, completed } = action.payload
      if (!state.questProgress[questId]) {
        state.questProgress[questId] = {}
      }
      state.questProgress[questId][objectiveId] = completed
    },

    completeQuest: (state, action) => {
      const questId = action.payload
      if (!state.completedQuests.includes(questId)) {
        state.completedQuests.push(questId)
        state.activeQuests = state.activeQuests.filter(q => q !== questId)
      }
    },

    // Chapter management
    completeChapter: (state, action) => {
      const chapterId = action.payload
      if (!state.completedChapters.includes(chapterId)) {
        state.completedChapters.push(chapterId)
      }
    },

    setCurrentChapter: (state, action) => {
      state.currentChapter = action.payload
    },

    // Dialogue management
    startDialogue: (state, action) => {
      const { dialogueId, pageIndex = 0 } = action.payload
      state.currentDialogue = dialogueId
      state.dialoguePageIndex = pageIndex
      if (!state.dialogueHistory.includes(dialogueId)) {
        state.dialogueHistory.push(dialogueId)
      }
    },

    advanceDialogue: (state) => {
      state.dialoguePageIndex += 1
    },

    setDialoguePage: (state, action) => {
      state.dialoguePageIndex = action.payload
    },

    endDialogue: (state) => {
      state.currentDialogue = null
      state.dialoguePageIndex = 0
    },

    // Story flags
    setStoryFlag: (state, action) => {
      const { flag, value } = action.payload
      state.storyFlags[flag] = value
    },

    // Journal
    toggleJournal: (state) => {
      state.isJournalOpen = !state.isJournalOpen
    },

    openJournal: (state) => {
      state.isJournalOpen = true
    },

    closeJournal: (state) => {
      state.isJournalOpen = false
    },

    // Tutorial
    completeTutorial: (state) => {
      state.tutorialComplete = true
    },

    // Rewards
    addStoryXp: (state, action) => {
      state.storyXp += action.payload
    },

    unlockSprite: (state, action) => {
      const spriteId = action.payload
      if (!state.unlockedSprites.includes(spriteId)) {
        state.unlockedSprites.push(spriteId)
      }
    },

    addBadge: (state, action) => {
      const badgeId = action.payload
      if (!state.badges.includes(badgeId)) {
        state.badges.push(badgeId)
      }
    },

    // Bulk update for loading saved state
    loadStoryState: (state, action) => {
      return { ...state, ...action.payload }
    },

    // Reset story (new game)
    resetStory: () => {
      return initialState
    },
  },
})

export const {
  startQuest,
  updateQuestObjective,
  completeQuest,
  completeChapter,
  setCurrentChapter,
  startDialogue,
  advanceDialogue,
  setDialoguePage,
  endDialogue,
  setStoryFlag,
  toggleJournal,
  openJournal,
  closeJournal,
  completeTutorial,
  addStoryXp,
  unlockSprite,
  addBadge,
  loadStoryState,
  resetStory,
} = storySlice.actions

export default storySlice.reducer
