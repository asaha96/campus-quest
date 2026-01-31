import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  updateQuestObjective,
  completeQuest,
  startQuest,
  completeChapter,
  setCurrentChapter,
  addStoryXp,
  unlockSprite,
  addBadge,
} from '../features/storySlice'
import { showToast, addXp } from '../features/gameStateSlice'
import { getQuest, isQuestComplete, getChapterQuests } from '../data/story/quests'
import { getChapter, getCurrentChapter, getChapterList } from '../data/story/chapters'

// Hook to automatically track quest objectives based on game events
export default function useQuestTracking() {
  const dispatch = useDispatch()

  // Game state selectors - use safe defaults
  const { currentZone } = useSelector(state => state.map || {})
  const gameState = useSelector(state => state.gameState || {})
  const story = useSelector(state => state.story || {})
  const spriteBattle = useSelector(state => state.spriteBattle || {})

  // Safely destructure with defaults
  const activeQuests = story.activeQuests || []
  const questProgress = story.questProgress || {}
  const completedQuests = story.completedQuests || []
  const completedChapters = story.completedChapters || []
  const dailyStats = gameState.dailyStats || {}
  const habitStreaks = gameState.habitStreaks || {}

  // Check and update quest objectives
  const checkObjectives = useCallback(() => {
    activeQuests.forEach(questId => {
      const quest = getQuest(questId)
      if (!quest) return

      const progress = questProgress[questId] || {}

      quest.objectives.forEach(objective => {
        // Skip already completed objectives
        if (progress[objective.id]) return

        let isComplete = false

        switch (objective.type) {
          case 'visit_zone':
            // Check if player has visited this zone
            isComplete = currentZone === objective.zone
            break

          case 'complete_focus_session':
            // Check focus sessions completed today
            isComplete = dailyStats.focusMinutes >= 15 * (objective.count || 1)
            break

          case 'accumulate_focus':
            // Check total focus minutes
            isComplete = dailyStats.focusMinutes >= objective.minutes
            break

          case 'log_workout':
            // Check workouts logged
            isComplete = dailyStats.workoutsLogged >= (objective.count || 1)
            break

          case 'log_reading':
            // Check pages read
            isComplete = dailyStats.pagesRead >= objective.pages
            break

          case 'log_hydration':
            // Check water glasses
            isComplete = dailyStats.waterGlasses >= objective.glasses
            break

          case 'catch_sprite':
            // Check sprites caught
            const caughtCount = spriteBattle?.caughtSprites?.length || 0
            isComplete = caughtCount >= (objective.count || 1)
            break

          case 'maintain_streak':
            // Check habit streaks
            const streak = habitStreaks[objective.habit]?.current || 0
            isComplete = streak >= objective.days
            break

          case 'all_streaks_active':
            // Check if all habit streaks are at least 1
            isComplete = Object.values(habitStreaks).every(s => s.current >= 1)
            break

          case 'talk_to_npc':
            // This is handled by dialogue system
            break

          case 'defeat_boss':
            // This is handled by battle system
            break

          case 'visit_all_zones':
            // Check if visited all zones in current session
            // This would need additional tracking
            break

          default:
            break
        }

        if (isComplete) {
          dispatch(updateQuestObjective({
            questId,
            objectiveId: objective.id,
            completed: true,
          }))

          dispatch(showToast(`Objective complete: ${objective.description}`))
        }
      })
    })
  }, [activeQuests, questProgress, currentZone, dailyStats, habitStreaks, spriteBattle, dispatch])

  // Check for quest completion
  const checkQuestCompletion = useCallback(() => {
    activeQuests.forEach(questId => {
      const quest = getQuest(questId)
      if (!quest) return

      const progress = questProgress[questId] || {}
      const allComplete = quest.objectives.every(obj => progress[obj.id])

      if (allComplete && !completedQuests.includes(questId)) {
        // Complete the quest
        dispatch(completeQuest(questId))

        // Grant rewards
        if (quest.rewards) {
          if (quest.rewards.xp) {
            dispatch(addXp(quest.rewards.xp))
            dispatch(addStoryXp(quest.rewards.xp))
          }
          if (quest.rewards.unlockSprite) {
            dispatch(unlockSprite(quest.rewards.unlockSprite))
          }
          if (quest.rewards.badge) {
            dispatch(addBadge(quest.rewards.badge))
          }
        }

        dispatch(showToast(`Quest Complete: ${quest.title}!`))

        // Check if we should start the next quest
        const chapterQuests = getChapterQuests(quest.chapter)
        const nextQuest = chapterQuests.find(
          q => q.prerequisite === questId && !completedQuests.includes(q.id)
        )
        if (nextQuest) {
          dispatch(startQuest(nextQuest.id))
          dispatch(showToast(`New Quest: ${nextQuest.title}`))
        }
      }
    })
  }, [activeQuests, questProgress, completedQuests, dispatch])

  // Check for chapter completion
  const checkChapterCompletion = useCallback(() => {
    const chapters = getChapterList()

    chapters.forEach(chapter => {
      if (completedChapters.includes(chapter.id)) return

      const chapterQuests = getChapterQuests(chapter.id)
      const allComplete = chapterQuests.every(q => completedQuests.includes(q.id))

      if (allComplete) {
        dispatch(completeChapter(chapter.id))

        // Grant chapter rewards
        if (chapter.rewards) {
          if (chapter.rewards.xp) {
            dispatch(addXp(chapter.rewards.xp))
          }
          if (chapter.rewards.badge) {
            dispatch(addBadge(chapter.rewards.badge))
          }
          if (chapter.rewards.unlockChapter) {
            dispatch(setCurrentChapter(chapter.rewards.unlockChapter))
            // Start first quest of new chapter
            const newChapterQuests = getChapterQuests(chapter.rewards.unlockChapter)
            if (newChapterQuests.length > 0) {
              dispatch(startQuest(newChapterQuests[0].id))
            }
          }
        }

        dispatch(showToast(`Chapter Complete: ${chapter.title}!`))
      }
    })
  }, [completedQuests, completedChapters, dispatch])

  // Run checks when relevant state changes
  useEffect(() => {
    checkObjectives()
  }, [currentZone, dailyStats, habitStreaks, spriteBattle?.caughtSprites?.length, checkObjectives])

  useEffect(() => {
    checkQuestCompletion()
  }, [questProgress, checkQuestCompletion])

  useEffect(() => {
    checkChapterCompletion()
  }, [completedQuests, checkChapterCompletion])

  // Helper function to manually trigger NPC talk objective
  const completeTalkObjective = useCallback((npcName) => {
    activeQuests.forEach(questId => {
      const quest = getQuest(questId)
      if (!quest) return

      quest.objectives.forEach(objective => {
        if (objective.type === 'talk_to_npc' && objective.npc === npcName) {
          const progress = questProgress[questId] || {}
          if (!progress[objective.id]) {
            dispatch(updateQuestObjective({
              questId,
              objectiveId: objective.id,
              completed: true,
            }))
          }
        }
      })
    })
  }, [activeQuests, questProgress, dispatch])

  // Helper function to mark boss defeated
  const completeBossObjective = useCallback((bossId) => {
    activeQuests.forEach(questId => {
      const quest = getQuest(questId)
      if (!quest) return

      quest.objectives.forEach(objective => {
        if (objective.type === 'defeat_boss' && objective.boss === bossId) {
          const progress = questProgress[questId] || {}
          if (!progress[objective.id]) {
            dispatch(updateQuestObjective({
              questId,
              objectiveId: objective.id,
              completed: true,
            }))
          }
        }
      })
    })
  }, [activeQuests, questProgress, dispatch])

  return {
    completeTalkObjective,
    completeBossObjective,
  }
}
