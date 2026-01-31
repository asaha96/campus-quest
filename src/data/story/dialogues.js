// Dialogue trees for NPC conversations
// Supports branching choices, conditions, and quest triggers

export const DIALOGUES = {
  // ===== LIBRARIAN ADA =====
  librarian_ada_default: {
    id: 'librarian_ada_default',
    speaker: 'Librarian Ada',
    spriteId: 'librarian_ada',
    pages: [
      {
        text: 'Welcome to the library! This is where knowledge becomes power.',
        choices: [
          { text: 'How can I study effectively?', next: 'librarian_ada_study_tips' },
          { text: 'Tell me about sprites.', next: 'librarian_ada_sprites' },
          { text: 'Goodbye.', next: null },
        ],
      },
    ],
  },

  librarian_ada_study_tips: {
    id: 'librarian_ada_study_tips',
    speaker: 'Librarian Ada',
    spriteId: 'librarian_ada',
    pages: [
      {
        text: 'The key to effective studying is focused work. Use the focus timer to train your concentration.',
      },
      {
        text: 'Start with short sessions - even 15 minutes helps. Gradually increase as you build your focus muscle.',
      },
      {
        text: 'Remember: consistency beats intensity. A little each day goes further than cramming.',
        choices: [
          { text: 'Thanks for the advice!', next: null },
          { text: 'Tell me about sprites.', next: 'librarian_ada_sprites' },
        ],
      },
    ],
  },

  librarian_ada_sprites: {
    id: 'librarian_ada_sprites',
    speaker: 'Librarian Ada',
    spriteId: 'librarian_ada',
    pages: [
      {
        text: 'Ah, the productivity sprites! They\'re magical creatures drawn to focused minds.',
      },
      {
        text: 'Walk through the campus grounds and you might encounter them. The more you focus, the stronger sprites you\'ll attract!',
      },
      {
        text: 'Collect them all to become a true Campus Champion.',
        choices: [
          { text: 'I\'ll catch them all!', next: null },
          { text: 'How do I study effectively?', next: 'librarian_ada_study_tips' },
        ],
      },
    ],
  },

  ada_wisdom: {
    id: 'ada_wisdom',
    speaker: 'Librarian Ada',
    spriteId: 'librarian_ada',
    questReward: 'quest_meet_ada',
    pages: [
      {
        text: 'I see you\'ve completed your first focus session. Impressive!',
      },
      {
        text: 'Let me share a secret: the library holds ancient knowledge about productivity.',
      },
      {
        text: 'Those who master focus can achieve anything. Keep practicing, and rare sprites will appear.',
      },
      {
        text: 'Here, take this as a token of my appreciation.',
        action: { type: 'grant_xp', amount: 50 },
      },
    ],
  },

  // ===== COACH THUNDER =====
  coach_thunder_default: {
    id: 'coach_thunder_default',
    speaker: 'Coach Thunder',
    spriteId: 'coach_thunder',
    pages: [
      {
        text: 'WELCOME TO THE GYM! A healthy body means a healthy mind!',
        choices: [
          { text: 'How do I get started?', next: 'coach_thunder_start' },
          { text: 'Why is exercise important?', next: 'coach_thunder_benefits' },
          { text: 'Maybe later...', next: null },
        ],
      },
    ],
  },

  coach_thunder_start: {
    id: 'coach_thunder_start',
    speaker: 'Coach Thunder',
    spriteId: 'coach_thunder',
    pages: [
      {
        text: 'Starting is simple! Log any physical activity - walking, running, sports, whatever moves your body!',
      },
      {
        text: 'Even 10 minutes counts. The goal is consistency, not perfection!',
      },
      {
        text: 'Track your workouts here and watch your energy levels soar!',
        choices: [
          { text: 'I\'m ready to train!', next: null },
          { text: 'What are the benefits?', next: 'coach_thunder_benefits' },
        ],
      },
    ],
  },

  coach_thunder_benefits: {
    id: 'coach_thunder_benefits',
    speaker: 'Coach Thunder',
    spriteId: 'coach_thunder',
    pages: [
      {
        text: 'Exercise boosts brain power! Studies show it improves focus, memory, and mood.',
      },
      {
        text: 'When you work out, your body releases endorphins - nature\'s energy drink!',
      },
      {
        text: 'Plus, maintaining a workout streak earns you bonus XP and rare sprite encounters!',
        choices: [
          { text: 'Let\'s do this!', next: null },
          { text: 'How do I start?', next: 'coach_thunder_start' },
        ],
      },
    ],
  },

  // ===== BARISTA BLITZ =====
  barista_blitz_default: {
    id: 'barista_blitz_default',
    speaker: 'Barista Blitz',
    spriteId: 'barista_blitz',
    pages: [
      {
        text: 'Welcome to the Cozy Cafe! Need a caffeine boost or just a place to chill?',
        choices: [
          { text: 'What\'s on the menu?', next: 'barista_blitz_menu' },
          { text: 'Tell me about this place.', next: 'barista_blitz_about' },
          { text: 'Just browsing, thanks!', next: null },
        ],
      },
    ],
  },

  barista_blitz_menu: {
    id: 'barista_blitz_menu',
    speaker: 'Barista Blitz',
    spriteId: 'barista_blitz',
    pages: [
      {
        text: 'We\'ve got coffee, tea, and the most important drink of all... WATER!',
      },
      {
        text: 'Staying hydrated is crucial for focus. Track your water intake here!',
      },
      {
        text: 'Pro tip: 8 glasses a day keeps the brain fog away!',
        choices: [
          { text: 'I\'ll have some water!', next: null, action: { type: 'add_water' } },
          { text: 'Tell me about the cafe.', next: 'barista_blitz_about' },
        ],
      },
    ],
  },

  barista_blitz_about: {
    id: 'barista_blitz_about',
    speaker: 'Barista Blitz',
    spriteId: 'barista_blitz',
    pages: [
      {
        text: 'The Cozy Cafe is the social hub of campus! Students come here to relax and recharge.',
      },
      {
        text: 'It\'s also where you can view your sprite collection and chat with friends.',
      },
      {
        text: 'Think of it as your reward spot after a hard study session!',
        choices: [
          { text: 'Sounds great!', next: null },
          { text: 'What\'s on the menu?', next: 'barista_blitz_menu' },
        ],
      },
    ],
  },

  // ===== RA RESTLESS =====
  ra_restless_default: {
    id: 'ra_restless_default',
    speaker: 'RA Restless',
    spriteId: 'ra_restless',
    pages: [
      {
        text: 'Hey there, roomie! This is your dorm room. It\'s your personal sanctuary.',
        choices: [
          { text: 'What can I do here?', next: 'ra_restless_dorm_info' },
          { text: 'Any tips for dorm life?', next: 'ra_restless_tips' },
          { text: 'I need some rest.', next: 'ra_restless_rest' },
        ],
      },
    ],
  },

  ra_restless_dorm_info: {
    id: 'ra_restless_dorm_info',
    speaker: 'RA Restless',
    spriteId: 'ra_restless',
    pages: [
      {
        text: 'Your dorm is where you rest and reset. Sleep is crucial for productivity!',
      },
      {
        text: 'You can log your sleep hours here. Aim for 7-9 hours for optimal performance.',
      },
      {
        text: 'The bed also lets you reset daily challenges if needed.',
        choices: [
          { text: 'Good to know!', next: null },
          { text: 'Any other tips?', next: 'ra_restless_tips' },
        ],
      },
    ],
  },

  ra_restless_tips: {
    id: 'ra_restless_tips',
    speaker: 'RA Restless',
    spriteId: 'ra_restless',
    pages: [
      {
        text: 'Dorm life pro tips: Keep a consistent sleep schedule!',
      },
      {
        text: 'Your body has a natural rhythm. Work with it, not against it.',
      },
      {
        text: 'And don\'t forget: balance is key. Work hard, rest hard!',
        choices: [
          { text: 'Thanks for the advice!', next: null },
          { text: 'I\'d like to rest now.', next: 'ra_restless_rest' },
        ],
      },
    ],
  },

  ra_restless_rest: {
    id: 'ra_restless_rest',
    speaker: 'RA Restless',
    spriteId: 'ra_restless',
    pages: [
      {
        text: 'Smart choice! A well-rested mind is a powerful mind.',
      },
      {
        text: 'Sweet dreams! You\'ll wake up refreshed and ready for new challenges.',
        action: { type: 'show_sleep_log' },
      },
    ],
  },

  // ===== PROFESSOR BYTE =====
  professor_byte_default: {
    id: 'professor_byte_default',
    speaker: 'Professor Byte',
    spriteId: 'professor_byte',
    pages: [
      {
        text: 'Ah, a student! I am Professor Byte, keeper of advanced knowledge.',
        choices: [
          { text: 'What do you teach?', next: 'professor_byte_teach' },
          { text: 'I seek a challenge!', next: 'professor_byte_challenge' },
          { text: 'I should go.', next: null },
        ],
      },
    ],
  },

  professor_byte_teach: {
    id: 'professor_byte_teach',
    speaker: 'Professor Byte',
    spriteId: 'professor_byte',
    pages: [
      {
        text: 'I teach the art of deep work - sustained focus on cognitively demanding tasks.',
      },
      {
        text: 'In our distracted world, the ability to focus deeply is a superpower.',
      },
      {
        text: 'Master it, and you\'ll achieve things others think impossible.',
        choices: [
          { text: 'Teach me more!', next: 'professor_byte_challenge' },
          { text: 'I\'ll practice.', next: null },
        ],
      },
    ],
  },

  professor_byte_challenge: {
    id: 'professor_byte_challenge',
    speaker: 'Professor Byte',
    spriteId: 'professor_byte',
    pages: [
      {
        text: 'You want a challenge? Very well.',
      },
      {
        text: 'Complete 5 focus sessions and accumulate 60 minutes of deep work.',
      },
      {
        text: 'Do this, and I\'ll teach you secrets known only to the Masters of Productivity.',
        action: { type: 'start_quest', quest: 'quest_research_project' },
      },
    ],
  },

  // ===== DEAN WISDOM =====
  dean_wisdom_default: {
    id: 'dean_wisdom_default',
    speaker: 'Dean Wisdom',
    spriteId: 'dean_wisdom',
    pages: [
      {
        text: 'Welcome, young scholar. I am Dean Wisdom, overseer of all campus endeavors.',
      },
      {
        text: 'I\'ve been watching your progress. You show great potential.',
        choices: [
          { text: 'Thank you, Dean.', next: 'dean_wisdom_advice' },
          { text: 'What lies ahead?', next: 'dean_wisdom_future' },
        ],
      },
    ],
  },

  dean_wisdom_advice: {
    id: 'dean_wisdom_advice',
    speaker: 'Dean Wisdom',
    spriteId: 'dean_wisdom',
    pages: [
      {
        text: 'Remember this: true success is not just about achievements.',
      },
      {
        text: 'It\'s about the habits you build and the person you become along the way.',
      },
      {
        text: 'Keep growing, keep learning, keep pushing your limits.',
        choices: [
          { text: 'I will, Dean.', next: null },
        ],
      },
    ],
  },

  dean_wisdom_future: {
    id: 'dean_wisdom_future',
    speaker: 'Dean Wisdom',
    spriteId: 'dean_wisdom',
    pages: [
      {
        text: 'Your journey here is just the beginning. Beyond these walls lies a world of opportunity.',
      },
      {
        text: 'The skills you develop here - focus, discipline, balance - will serve you for life.',
      },
      {
        text: 'Make the most of your time at Campus University. It goes faster than you think.',
        choices: [
          { text: 'I understand.', next: null },
        ],
      },
    ],
  },

  // ===== SPECIAL DIALOGUES =====
  welcome_complete: {
    id: 'welcome_complete',
    speaker: 'System',
    pages: [
      {
        text: 'Quest Complete: Welcome to Campus!',
        action: { type: 'quest_complete', quest: 'quest_welcome' },
      },
      {
        text: 'You\'ve explored the campus and found your way around. Time to start your real journey!',
      },
    ],
  },

  intro_narrator: {
    id: 'intro_narrator',
    speaker: 'Narrator',
    pages: [
      {
        text: 'The bus pulls up to the grand gates of Campus University...',
      },
      {
        text: 'A new chapter of your life begins today.',
      },
      {
        text: 'Will you become a legend of productivity? Or succumb to the forces of procrastination?',
      },
      {
        text: 'Your story starts now.',
      },
    ],
  },
}

// Get dialogue by ID
export const getDialogue = (dialogueId) => {
  return DIALOGUES[dialogueId] || null
}

// Get default dialogue for NPC
export const getDefaultDialogue = (npcName) => {
  const npcKey = npcName.toLowerCase().replace(/\s+/g, '_')
  return DIALOGUES[`${npcKey}_default`] || null
}

// Process dialogue action
export const processDialogueAction = (action, dispatch) => {
  if (!action) return

  switch (action.type) {
    case 'grant_xp':
      // Dispatch XP action
      break
    case 'add_water':
      // Dispatch water action
      break
    case 'show_sleep_log':
      // Open sleep log modal
      break
    case 'start_quest':
      // Activate quest
      break
    case 'quest_complete':
      // Complete quest
      break
    default:
      break
  }
}

export default DIALOGUES
