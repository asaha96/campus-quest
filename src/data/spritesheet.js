// Sprite sheet layout configuration
// Defines frame positions, animation sequences, and sprite metadata

export const SPRITE_SIZE = 32 // 32x32 pixel sprites

// Animation states and their frame counts
export const ANIMATIONS = {
  idle: { frames: 2, speed: 500 }, // 2 frames, 500ms per frame
  walk: { frames: 4, speed: 150 }, // 4 frames, 150ms per frame
  run: { frames: 4, speed: 100 },
  talk: { frames: 2, speed: 300 },
  action: { frames: 4, speed: 200 },
}

// Direction row mapping (in sprite sheet)
export const DIRECTIONS = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
}

// Character sprite definitions
// Each character has a sprite sheet with rows for each direction
// and columns for animation frames
export const CHARACTER_SPRITES = {
  player: {
    name: 'Student',
    sheetUrl: '/sprites/player.png',
    // CSS fallback colors for generating placeholder sprites
    colors: {
      primary: '#4a90d9',
      secondary: '#2d5a87',
      skin: '#ffd5b5',
      hair: '#4a3728',
    },
  },
  librarian_ada: {
    name: 'Librarian Ada',
    sheetUrl: '/sprites/librarian.png',
    colors: {
      primary: '#8b4513',
      secondary: '#654321',
      skin: '#deb887',
      hair: '#2f1a0a',
    },
  },
  coach_thunder: {
    name: 'Coach Thunder',
    sheetUrl: '/sprites/coach.png',
    colors: {
      primary: '#cc0000',
      secondary: '#990000',
      skin: '#d2691e',
      hair: '#1a1a1a',
    },
  },
  barista_blitz: {
    name: 'Barista Blitz',
    sheetUrl: '/sprites/barista.png',
    colors: {
      primary: '#2d5016',
      secondary: '#1a2e0d',
      skin: '#f5deb3',
      hair: '#8b0000',
    },
  },
  ra_restless: {
    name: 'RA Restless',
    sheetUrl: '/sprites/ra.png',
    colors: {
      primary: '#4b0082',
      secondary: '#2e004f',
      skin: '#ffe4c4',
      hair: '#483d8b',
    },
  },
  professor_byte: {
    name: 'Professor Byte',
    sheetUrl: '/sprites/professor.png',
    colors: {
      primary: '#2c3e50',
      secondary: '#1a252f',
      skin: '#ffefd5',
      hair: '#c0c0c0',
    },
  },
  dean_wisdom: {
    name: 'Dean Wisdom',
    sheetUrl: '/sprites/dean.png',
    colors: {
      primary: '#800020',
      secondary: '#4a0012',
      skin: '#deb887',
      hair: '#ffffff',
    },
  },
}

// NPC sprite mapping from zone NPC names to sprite IDs
export const NPC_SPRITE_MAP = {
  'Librarian Ada': 'librarian_ada',
  'Coach Thunder': 'coach_thunder',
  'Barista Blitz': 'barista_blitz',
  'RA Restless': 'ra_restless',
  'Professor Byte': 'professor_byte',
  'Dean Wisdom': 'dean_wisdom',
}

// Get sprite frame position (for background-position in CSS)
export const getSpriteFrame = (direction, frame, animation = 'walk') => {
  const row = DIRECTIONS[direction] || 0
  const animData = ANIMATIONS[animation] || ANIMATIONS.walk
  const col = frame % animData.frames

  return {
    x: -col * SPRITE_SIZE,
    y: -row * SPRITE_SIZE,
  }
}

// Generate CSS pixel art sprite placeholder (when PNG not available)
// This creates a simple 8x8 "super pixel" representation
export const generatePlaceholderSprite = (colors, direction = 'down', frame = 0) => {
  const { primary, secondary, skin, hair } = colors

  // Simple 8x8 pixel art pattern (will be scaled to 32x32)
  // Each character in the pattern represents a color:
  // . = transparent, P = primary, S = secondary, K = skin, H = hair
  const patterns = {
    down: [
      '..HHHH..',
      '.HHHHHH.',
      '.HKKKH..',
      '.KKKKK..',
      '..PPP...',
      '.PPPPP..',
      '.P.PP.P.',
      '..SS.SS.',
    ],
    up: [
      '..HHHH..',
      '.HHHHHH.',
      '.HHHHHH.',
      '..HHH...',
      '..PPP...',
      '.PPPPP..',
      '.P.PP.P.',
      '..SS.SS.',
    ],
    left: [
      '..HHHH..',
      '.HHHHHH.',
      '..KKKH..',
      '..KKKK..',
      '..PPP...',
      '.PPPPP..',
      '.P.PP...',
      '..SS.S..',
    ],
    right: [
      '..HHHH..',
      '.HHHHHH.',
      '..HKKK..',
      '..KKKK..',
      '...PPP..',
      '..PPPPP.',
      '...PP.P.',
      '..S.SS..',
    ],
  }

  const colorMap = {
    '.': 'transparent',
    P: primary,
    S: secondary,
    K: skin,
    H: hair,
  }

  const pattern = patterns[direction] || patterns.down
  const pixelSize = 4 // 8 * 4 = 32px

  // Generate CSS gradient for the sprite
  const gradients = []
  pattern.forEach((row, y) => {
    row.split('').forEach((char, x) => {
      if (char !== '.') {
        const color = colorMap[char]
        gradients.push(
          `linear-gradient(${color}, ${color}) ${x * pixelSize}px ${y * pixelSize}px / ${pixelSize}px ${pixelSize}px no-repeat`
        )
      }
    })
  })

  return gradients.join(', ')
}

// Walking animation frame offsets (for bouncy walk effect)
export const WALK_OFFSETS = {
  0: { y: 0 },
  1: { y: -2 },
  2: { y: 0 },
  3: { y: -2 },
}

export default {
  SPRITE_SIZE,
  ANIMATIONS,
  DIRECTIONS,
  CHARACTER_SPRITES,
  NPC_SPRITE_MAP,
  getSpriteFrame,
  generatePlaceholderSprite,
  WALK_OFFSETS,
}
