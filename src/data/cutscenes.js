// Cutscene definitions with scene sequences
// Supports various scene types: fade, text, camera movement, character movement, dialogue

export const CUTSCENES = {
  game_intro: {
    id: 'game_intro',
    title: 'Welcome to Campus',
    skippable: true,
    scenes: [
      { type: 'fade_in', duration: 1000 },
      { type: 'show_text', text: 'Campus University', style: 'title', duration: 2000 },
      { type: 'show_text', text: 'Where Legends Are Made', style: 'subtitle', duration: 1500 },
      { type: 'fade_out', duration: 500 },
      { type: 'fade_in', duration: 500 },
      { type: 'camera_pan', from: { x: 30, y: 30 }, to: { x: 50, y: 50 }, duration: 3000 },
      { type: 'spawn_character', characterId: 'player', position: { x: 50, y: 55 } },
      { type: 'show_text', text: 'A new student arrives...', style: 'narration', duration: 1500 },
      { type: 'character_move', characterId: 'player', path: [{ x: 50, y: 52 }, { x: 50, y: 50 }], speed: 200 },
      { type: 'wait', duration: 500 },
      { type: 'dialogue', dialogueId: 'intro_narrator' },
      { type: 'fade_out', duration: 500 },
    ],
  },

  freshman_complete: {
    id: 'freshman_complete',
    title: 'Chapter Complete',
    skippable: true,
    scenes: [
      { type: 'fade_in', duration: 500 },
      { type: 'show_text', text: 'Freshman Year Complete!', style: 'title', duration: 2000 },
      { type: 'show_text', text: 'You\'ve proven yourself worthy.', style: 'subtitle', duration: 1500 },
      { type: 'show_text', text: 'New challenges await...', style: 'narration', duration: 1500 },
      { type: 'fade_out', duration: 500 },
    ],
  },

  sophomore_intro: {
    id: 'sophomore_intro',
    title: 'Sophomore Year',
    skippable: true,
    scenes: [
      { type: 'fade_in', duration: 500 },
      { type: 'show_text', text: 'Sophomore Year', style: 'title', duration: 2000 },
      { type: 'show_text', text: 'The real challenges begin', style: 'subtitle', duration: 1500 },
      { type: 'fade_out', duration: 500 },
    ],
  },

  midterm_boss_intro: {
    id: 'midterm_boss_intro',
    title: 'Boss Battle',
    skippable: true,
    scenes: [
      { type: 'fade_in', duration: 300 },
      { type: 'screen_shake', intensity: 3, duration: 500 },
      { type: 'show_text', text: 'DANGER', style: 'warning', duration: 1000 },
      { type: 'show_text', text: 'The Procrastination Phantom appears!', style: 'boss_name', duration: 2000 },
      { type: 'screen_shake', intensity: 5, duration: 300 },
      { type: 'fade_out', duration: 300 },
    ],
  },

  junior_intro: {
    id: 'junior_intro',
    title: 'Junior Year',
    skippable: true,
    scenes: [
      { type: 'fade_in', duration: 500 },
      { type: 'show_text', text: 'Junior Year', style: 'title', duration: 2000 },
      { type: 'show_text', text: 'Leadership and growth', style: 'subtitle', duration: 1500 },
      { type: 'fade_out', duration: 500 },
    ],
  },

  professor_trial_intro: {
    id: 'professor_trial_intro',
    title: 'The Trial',
    skippable: true,
    scenes: [
      { type: 'fade_in', duration: 500 },
      { type: 'show_text', text: 'Professor Byte\'s Trial', style: 'title', duration: 2000 },
      { type: 'show_text', text: 'Face the Deadline Dragon!', style: 'boss_name', duration: 1500 },
      { type: 'screen_shake', intensity: 4, duration: 400 },
      { type: 'fade_out', duration: 300 },
    ],
  },

  senior_intro: {
    id: 'senior_intro',
    title: 'Senior Year',
    skippable: true,
    scenes: [
      { type: 'fade_in', duration: 500 },
      { type: 'show_text', text: 'Senior Year', style: 'title', duration: 2000 },
      { type: 'show_text', text: 'The final chapter', style: 'subtitle', duration: 1500 },
      { type: 'fade_out', duration: 500 },
    ],
  },

  dean_meeting: {
    id: 'dean_meeting',
    title: 'The Dean',
    skippable: true,
    scenes: [
      { type: 'fade_in', duration: 500 },
      { type: 'show_text', text: 'Dean\'s Office', style: 'location', duration: 1500 },
      { type: 'spawn_character', characterId: 'dean_wisdom', position: { x: 50, y: 48 } },
      { type: 'wait', duration: 500 },
      { type: 'dialogue', dialogueId: 'dean_wisdom_default' },
      { type: 'fade_out', duration: 500 },
    ],
  },

  final_boss_intro: {
    id: 'final_boss_intro',
    title: 'The Final Battle',
    skippable: false,
    scenes: [
      { type: 'fade_in', duration: 500 },
      { type: 'show_text', text: 'THE ULTIMATE CHALLENGE', style: 'warning', duration: 1500 },
      { type: 'screen_shake', intensity: 6, duration: 800 },
      { type: 'show_text', text: 'The Burnout Beast Awakens', style: 'boss_name', duration: 2500 },
      { type: 'screen_shake', intensity: 8, duration: 500 },
      { type: 'fade_out', duration: 500 },
    ],
  },

  graduation_intro: {
    id: 'graduation_intro',
    title: 'Graduation',
    skippable: true,
    scenes: [
      { type: 'fade_in', duration: 1000 },
      { type: 'show_text', text: 'Graduation Day', style: 'title', duration: 3000 },
      { type: 'show_text', text: 'The culmination of your journey', style: 'subtitle', duration: 2000 },
      { type: 'fade_out', duration: 500 },
    ],
  },

  graduation_ceremony: {
    id: 'graduation_ceremony',
    title: 'Commencement',
    skippable: true,
    scenes: [
      { type: 'fade_in', duration: 500 },
      { type: 'show_text', text: 'CONGRATULATIONS', style: 'title', duration: 2000 },
      { type: 'show_text', text: 'Class of Campus University', style: 'subtitle', duration: 1500 },
      { type: 'spawn_character', characterId: 'player', position: { x: 50, y: 52 } },
      { type: 'character_move', characterId: 'player', path: [{ x: 50, y: 50 }], speed: 300 },
      { type: 'wait', duration: 500 },
      { type: 'show_text', text: 'You have become a true Champion of Productivity!', style: 'narration', duration: 2500 },
      { type: 'fade_out', duration: 1000 },
    ],
  },

  game_ending: {
    id: 'game_ending',
    title: 'The End',
    skippable: true,
    scenes: [
      { type: 'fade_in', duration: 1000 },
      { type: 'show_text', text: 'Thank You For Playing', style: 'title', duration: 3000 },
      { type: 'show_text', text: 'Campus Quest', style: 'subtitle', duration: 2000 },
      { type: 'show_text', text: 'Your journey continues in the real world...', style: 'narration', duration: 2500 },
      { type: 'show_text', text: 'Stay focused. Stay productive.', style: 'narration', duration: 2000 },
      { type: 'fade_out', duration: 2000 },
    ],
  },
}

// Text style configurations
export const TEXT_STYLES = {
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
    animation: 'fadeInUp',
  },
  subtitle: {
    fontSize: '18px',
    fontWeight: 'normal',
    color: '#ccc',
    fontStyle: 'italic',
    animation: 'fadeIn',
  },
  narration: {
    fontSize: '16px',
    fontWeight: 'normal',
    color: '#aaa',
    animation: 'fadeIn',
  },
  warning: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ff4444',
    textShadow: '0 0 10px #ff0000',
    animation: 'pulse',
  },
  boss_name: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ff6600',
    textShadow: '0 0 8px #ff3300',
    animation: 'fadeInUp',
  },
  location: {
    fontSize: '20px',
    fontWeight: 'normal',
    color: '#88ccff',
    animation: 'fadeIn',
  },
}

// Get cutscene by ID
export const getCutscene = (cutsceneId) => {
  return CUTSCENES[cutsceneId] || null
}

// Get text style
export const getTextStyle = (styleName) => {
  return TEXT_STYLES[styleName] || TEXT_STYLES.narration
}

export default CUTSCENES
