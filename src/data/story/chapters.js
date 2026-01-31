// Story chapters - the main narrative arc from freshman to graduation

export const CHAPTERS = {
  freshman_orientation: {
    id: 'freshman_orientation',
    title: 'Freshman Orientation',
    subtitle: 'A New Beginning',
    description: 'Your journey at Campus University begins. Learn the ropes, meet your first companions, and discover the secrets of productivity.',
    order: 1,
    unlockRequirement: null, // Always unlocked
    quests: ['quest_welcome', 'quest_first_focus', 'quest_meet_ada', 'quest_first_sprite'],
    rewards: {
      xp: 200,
      unlockChapter: 'sophomore_struggles',
      badge: 'freshman_complete',
    },
    introCutscene: 'game_intro',
    outroCutscene: 'freshman_complete',
  },

  sophomore_struggles: {
    id: 'sophomore_struggles',
    title: 'Sophomore Struggles',
    subtitle: 'Rising Challenges',
    description: 'The honeymoon phase is over. Face tougher challenges, manage your time wisely, and prove you belong here.',
    order: 2,
    unlockRequirement: { type: 'chapter_complete', chapter: 'freshman_orientation' },
    quests: ['quest_time_management', 'quest_gym_routine', 'quest_study_group', 'quest_midterm_boss'],
    rewards: {
      xp: 400,
      unlockChapter: 'junior_journey',
      badge: 'sophomore_complete',
    },
    introCutscene: 'sophomore_intro',
    outroCutscene: 'sophomore_complete',
  },

  junior_journey: {
    id: 'junior_journey',
    title: 'Junior Journey',
    subtitle: 'Finding Your Path',
    description: 'With experience comes responsibility. Take on leadership roles, mentor freshmen, and discover your true calling.',
    order: 3,
    unlockRequirement: { type: 'chapter_complete', chapter: 'sophomore_struggles' },
    quests: ['quest_mentor_freshman', 'quest_research_project', 'quest_cafe_mastery', 'quest_professor_trial'],
    rewards: {
      xp: 600,
      unlockChapter: 'senior_saga',
      badge: 'junior_complete',
    },
    introCutscene: 'junior_intro',
    outroCutscene: 'junior_complete',
  },

  senior_saga: {
    id: 'senior_saga',
    title: 'Senior Saga',
    subtitle: 'The Final Year',
    description: 'Your last year awaits. Complete your thesis, face the ultimate challenges, and prepare for what lies beyond.',
    order: 4,
    unlockRequirement: { type: 'chapter_complete', chapter: 'junior_journey' },
    quests: ['quest_thesis_begin', 'quest_all_areas_mastered', 'quest_dean_meeting', 'quest_final_boss'],
    rewards: {
      xp: 1000,
      unlockChapter: 'graduation',
      badge: 'senior_complete',
    },
    introCutscene: 'senior_intro',
    outroCutscene: 'senior_complete',
  },

  graduation: {
    id: 'graduation',
    title: 'Graduation',
    subtitle: 'Commencement',
    description: 'The culmination of your journey. Celebrate your achievements and step into a new chapter of life.',
    order: 5,
    unlockRequirement: { type: 'chapter_complete', chapter: 'senior_saga' },
    quests: ['quest_graduation_prep', 'quest_final_goodbyes', 'quest_ceremony'],
    rewards: {
      xp: 2000,
      badge: 'graduate',
      ending: true,
    },
    introCutscene: 'graduation_intro',
    outroCutscene: 'game_ending',
  },
}

// Get chapter by ID
export const getChapter = (chapterId) => {
  return CHAPTERS[chapterId] || null
}

// Get all chapters in order
export const getChapterList = () => {
  return Object.values(CHAPTERS).sort((a, b) => a.order - b.order)
}

// Check if chapter is unlocked based on story state
export const isChapterUnlocked = (chapterId, storyState) => {
  const chapter = CHAPTERS[chapterId]
  if (!chapter) return false

  if (!chapter.unlockRequirement) return true

  const { type, chapter: requiredChapter } = chapter.unlockRequirement

  if (type === 'chapter_complete') {
    return storyState.completedChapters?.includes(requiredChapter)
  }

  return false
}

// Get the current active chapter based on story progress
export const getCurrentChapter = (storyState) => {
  const chapters = getChapterList()

  // Find the first incomplete chapter that's unlocked
  for (const chapter of chapters) {
    if (isChapterUnlocked(chapter.id, storyState) &&
        !storyState.completedChapters?.includes(chapter.id)) {
      return chapter
    }
  }

  // All chapters complete, return graduation
  return CHAPTERS.graduation
}

export default CHAPTERS
