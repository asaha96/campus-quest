// Quest definitions with objectives and rewards

export const QUESTS = {
  // ===== CHAPTER 1: Freshman Orientation =====
  quest_welcome: {
    id: 'quest_welcome',
    title: 'Welcome to Campus',
    description: 'Get acquainted with your new home. Explore the campus grounds and find the main buildings.',
    chapter: 'freshman_orientation',
    order: 1,
    objectives: [
      { id: 'obj_explore_campus', type: 'visit_zone', zone: 'campus', description: 'Walk around the campus', completed: false },
      { id: 'obj_find_library', type: 'visit_zone', zone: 'library', description: 'Find the Library', completed: false },
      { id: 'obj_find_dorm', type: 'visit_zone', zone: 'dorm', description: 'Locate your Dorm room', completed: false },
    ],
    rewards: { xp: 50 },
    unlockDialogue: 'welcome_complete',
  },

  quest_first_focus: {
    id: 'quest_first_focus',
    title: 'Mind Over Matter',
    description: 'Learn the art of focus. Complete your first focus session to prove your dedication.',
    chapter: 'freshman_orientation',
    order: 2,
    objectives: [
      { id: 'obj_focus_1', type: 'complete_focus_session', count: 1, description: 'Complete a focus session', completed: false },
    ],
    rewards: { xp: 100, unlockSprite: 'syntaxia' },
    prerequisite: 'quest_welcome',
  },

  quest_meet_ada: {
    id: 'quest_meet_ada',
    title: 'The Librarian\'s Wisdom',
    description: 'Seek out Librarian Ada in the library. She has valuable advice for new students.',
    chapter: 'freshman_orientation',
    order: 3,
    objectives: [
      { id: 'obj_talk_ada', type: 'talk_to_npc', npc: 'Librarian Ada', description: 'Talk to Librarian Ada', completed: false },
    ],
    rewards: { xp: 75 },
    prerequisite: 'quest_first_focus',
    unlockDialogue: 'ada_wisdom',
  },

  quest_first_sprite: {
    id: 'quest_first_sprite',
    title: 'Sprite Seeker',
    description: 'Campus grounds are home to magical productivity sprites. Catch your first one!',
    chapter: 'freshman_orientation',
    order: 4,
    objectives: [
      { id: 'obj_catch_sprite', type: 'catch_sprite', count: 1, description: 'Catch a sprite', completed: false },
    ],
    rewards: { xp: 100, item: 'sprite_badge' },
    prerequisite: 'quest_meet_ada',
  },

  // ===== CHAPTER 2: Sophomore Struggles =====
  quest_time_management: {
    id: 'quest_time_management',
    title: 'Master of Time',
    description: 'Juggling classes, study, and life. Prove you can manage your time effectively.',
    chapter: 'sophomore_struggles',
    order: 1,
    objectives: [
      { id: 'obj_focus_30', type: 'accumulate_focus', minutes: 30, description: 'Accumulate 30 focus minutes', completed: false },
      { id: 'obj_daily_challenge', type: 'complete_daily_challenge', count: 1, description: 'Complete a daily challenge', completed: false },
    ],
    rewards: { xp: 150, unlockSprite: 'chronokeeper' },
  },

  quest_gym_routine: {
    id: 'quest_gym_routine',
    title: 'Body and Mind',
    description: 'A healthy body supports a healthy mind. Start your fitness journey.',
    chapter: 'sophomore_struggles',
    order: 2,
    objectives: [
      { id: 'obj_visit_gym', type: 'visit_zone', zone: 'gym', description: 'Visit the Gym', completed: false },
      { id: 'obj_workout', type: 'log_workout', count: 1, description: 'Log a workout', completed: false },
      { id: 'obj_talk_coach', type: 'talk_to_npc', npc: 'Coach Thunder', description: 'Talk to Coach Thunder', completed: false },
    ],
    rewards: { xp: 125 },
    prerequisite: 'quest_time_management',
  },

  quest_study_group: {
    id: 'quest_study_group',
    title: 'Strength in Numbers',
    description: 'Form a study group. Together, you can achieve more.',
    chapter: 'sophomore_struggles',
    order: 3,
    objectives: [
      { id: 'obj_focus_streak', type: 'maintain_streak', habit: 'focus', days: 3, description: 'Maintain a 3-day focus streak', completed: false },
    ],
    rewards: { xp: 200, unlockSprite: 'studybuddy' },
    prerequisite: 'quest_gym_routine',
  },

  quest_midterm_boss: {
    id: 'quest_midterm_boss',
    title: 'Midterm Mayhem',
    description: 'The first major boss battle. Defeat the Procrastination Phantom!',
    chapter: 'sophomore_struggles',
    order: 4,
    objectives: [
      { id: 'obj_defeat_boss', type: 'defeat_boss', boss: 'procrastination_phantom', description: 'Defeat the Procrastination Phantom', completed: false },
    ],
    rewards: { xp: 300, badge: 'phantom_slayer' },
    prerequisite: 'quest_study_group',
    triggersCutscene: 'midterm_boss_intro',
  },

  // ===== CHAPTER 3: Junior Journey =====
  quest_mentor_freshman: {
    id: 'quest_mentor_freshman',
    title: 'Passing the Torch',
    description: 'Now you\'re the experienced one. Help a new freshman find their way.',
    chapter: 'junior_journey',
    order: 1,
    objectives: [
      { id: 'obj_complete_focus_10', type: 'accumulate_focus', minutes: 60, description: 'Accumulate 60 focus minutes', completed: false },
    ],
    rewards: { xp: 200 },
  },

  quest_research_project: {
    id: 'quest_research_project',
    title: 'The Research Path',
    description: 'Begin your first major research project. It will test all your skills.',
    chapter: 'junior_journey',
    order: 2,
    objectives: [
      { id: 'obj_read_pages', type: 'log_reading', pages: 50, description: 'Read 50 pages', completed: false },
      { id: 'obj_focus_sessions', type: 'complete_focus_session', count: 5, description: 'Complete 5 focus sessions', completed: false },
    ],
    rewards: { xp: 250, unlockSprite: 'biblioworm' },
    prerequisite: 'quest_mentor_freshman',
  },

  quest_cafe_mastery: {
    id: 'quest_cafe_mastery',
    title: 'Caffeinated Scholar',
    description: 'Master the art of productive cafe study sessions.',
    chapter: 'junior_journey',
    order: 3,
    objectives: [
      { id: 'obj_visit_cafe', type: 'visit_zone', zone: 'cafe', description: 'Visit the Cafe', completed: false },
      { id: 'obj_hydration', type: 'log_hydration', glasses: 8, description: 'Stay hydrated (8 glasses)', completed: false },
    ],
    rewards: { xp: 175 },
    prerequisite: 'quest_research_project',
  },

  quest_professor_trial: {
    id: 'quest_professor_trial',
    title: 'Professor\'s Challenge',
    description: 'Professor Byte has a special trial for advanced students.',
    chapter: 'junior_journey',
    order: 4,
    objectives: [
      { id: 'obj_talk_prof', type: 'talk_to_npc', npc: 'Professor Byte', description: 'Speak with Professor Byte', completed: false },
      { id: 'obj_defeat_boss', type: 'defeat_boss', boss: 'deadline_dragon', description: 'Defeat the Deadline Dragon', completed: false },
    ],
    rewards: { xp: 350, badge: 'dragon_tamer' },
    prerequisite: 'quest_cafe_mastery',
    triggersCutscene: 'professor_trial_intro',
  },

  // ===== CHAPTER 4: Senior Saga =====
  quest_thesis_begin: {
    id: 'quest_thesis_begin',
    title: 'Thesis: The Beginning',
    description: 'Your magnum opus awaits. Begin the thesis that will define your academic career.',
    chapter: 'senior_saga',
    order: 1,
    objectives: [
      { id: 'obj_mega_focus', type: 'accumulate_focus', minutes: 120, description: 'Accumulate 120 focus minutes', completed: false },
      { id: 'obj_read_100', type: 'log_reading', pages: 100, description: 'Read 100 pages', completed: false },
    ],
    rewards: { xp: 400, unlockSprite: 'thesismaster' },
  },

  quest_all_areas_mastered: {
    id: 'quest_all_areas_mastered',
    title: 'Renaissance Student',
    description: 'Prove mastery across all areas of campus life.',
    chapter: 'senior_saga',
    order: 2,
    objectives: [
      { id: 'obj_all_streaks', type: 'all_streaks_active', description: 'Have all habit streaks active', completed: false },
      { id: 'obj_sprites_10', type: 'catch_sprite', count: 10, description: 'Catch 10 sprites', completed: false },
    ],
    rewards: { xp: 500, badge: 'renaissance' },
    prerequisite: 'quest_thesis_begin',
  },

  quest_dean_meeting: {
    id: 'quest_dean_meeting',
    title: 'Audience with the Dean',
    description: 'The Dean of Students wishes to meet you. Prepare yourself.',
    chapter: 'senior_saga',
    order: 3,
    objectives: [
      { id: 'obj_talk_dean', type: 'talk_to_npc', npc: 'Dean Wisdom', description: 'Meet with Dean Wisdom', completed: false },
    ],
    rewards: { xp: 200 },
    prerequisite: 'quest_all_areas_mastered',
    triggersCutscene: 'dean_meeting',
  },

  quest_final_boss: {
    id: 'quest_final_boss',
    title: 'The Ultimate Challenge',
    description: 'Face the Burnout Beast, the ultimate challenge of your academic career.',
    chapter: 'senior_saga',
    order: 4,
    objectives: [
      { id: 'obj_final_boss', type: 'defeat_boss', boss: 'burnout_beast', description: 'Defeat the Burnout Beast', completed: false },
    ],
    rewards: { xp: 1000, badge: 'beast_slayer' },
    prerequisite: 'quest_dean_meeting',
    triggersCutscene: 'final_boss_intro',
  },

  // ===== CHAPTER 5: Graduation =====
  quest_graduation_prep: {
    id: 'quest_graduation_prep',
    title: 'Preparation Day',
    description: 'The big day approaches. Make your final preparations.',
    chapter: 'graduation',
    order: 1,
    objectives: [
      { id: 'obj_visit_all', type: 'visit_all_zones', description: 'Visit all campus areas one last time', completed: false },
    ],
    rewards: { xp: 300 },
  },

  quest_final_goodbyes: {
    id: 'quest_final_goodbyes',
    title: 'Fond Farewells',
    description: 'Say goodbye to the friends and mentors who helped you along the way.',
    chapter: 'graduation',
    order: 2,
    objectives: [
      { id: 'obj_talk_all', type: 'talk_to_all_npcs', description: 'Talk to all NPCs', completed: false },
    ],
    rewards: { xp: 400, badge: 'beloved' },
    prerequisite: 'quest_graduation_prep',
  },

  quest_ceremony: {
    id: 'quest_ceremony',
    title: 'Commencement',
    description: 'Walk across the stage and receive your diploma.',
    chapter: 'graduation',
    order: 3,
    objectives: [
      { id: 'obj_ceremony', type: 'attend_ceremony', description: 'Attend the graduation ceremony', completed: false },
    ],
    rewards: { xp: 1000, badge: 'graduate', ending: true },
    prerequisite: 'quest_final_goodbyes',
    triggersCutscene: 'graduation_ceremony',
  },
}

// Get quest by ID
export const getQuest = (questId) => {
  return QUESTS[questId] || null
}

// Get all quests for a chapter
export const getChapterQuests = (chapterId) => {
  return Object.values(QUESTS)
    .filter(q => q.chapter === chapterId)
    .sort((a, b) => a.order - b.order)
}

// Check if quest is available (prerequisites met)
export const isQuestAvailable = (questId, storyState) => {
  const quest = QUESTS[questId]
  if (!quest) return false

  // Check if already completed
  if (storyState.completedQuests?.includes(questId)) return false

  // Check prerequisite
  if (quest.prerequisite) {
    if (!storyState.completedQuests?.includes(quest.prerequisite)) {
      return false
    }
  }

  return true
}

// Check if all objectives in a quest are complete
export const isQuestComplete = (questId, storyState) => {
  const progress = storyState.questProgress?.[questId]
  if (!progress) return false

  const quest = QUESTS[questId]
  return quest.objectives.every((obj) => progress[obj.id])
}

export default QUESTS
