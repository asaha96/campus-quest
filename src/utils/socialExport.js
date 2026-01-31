// Social export/import utilities
// Handles encoding and decoding progress snapshots for sharing

// Create a progress snapshot from current state
export const createSnapshot = (state) => {
  const { profile, gameState, story, challenge, spriteBattle } = state

  const snapshot = {
    // Identity
    friendCode: profile.friendCode,
    displayName: profile.displayName,

    // Core stats
    stats: {
      level: gameState.level,
      xp: gameState.xp,
      totalFocusMinutes: gameState.dailyStats?.focusMinutes || 0,
      totalWorkouts: gameState.dailyStats?.workoutsLogged || 0,
      spritesCollected: spriteBattle?.caughtSprites?.length || 0,
      questsCompleted: story?.completedQuests?.length || 0,
      chaptersCompleted: story?.completedChapters?.length || 0,
      badges: story?.badges?.length || 0,
    },

    // Streaks
    streaks: {
      focus: gameState.habitStreaks?.focus?.current || 0,
      workout: gameState.habitStreaks?.workout?.current || 0,
      reading: gameState.habitStreaks?.reading?.current || 0,
      hydration: gameState.habitStreaks?.hydration?.current || 0,
    },

    // Challenge progress
    challenges: {
      dailyStreak: challenge?.dailyChallengeStreak || 0,
      weeklyStreak: challenge?.weeklyGoalStreak || 0,
      totalCompleted: challenge?.totalChallengesCompleted || 0,
    },

    // Timestamp
    timestamp: Date.now(),
    version: 1,
  }

  return snapshot
}

// Encode snapshot to shareable string
export const encodeSnapshot = (snapshot) => {
  try {
    const json = JSON.stringify(snapshot)
    // Use base64 encoding
    const encoded = btoa(encodeURIComponent(json))
    // Add prefix for easy identification
    return `CQ1-${encoded}`
  } catch (e) {
    console.error('Failed to encode snapshot:', e)
    return null
  }
}

// Decode shareable string to snapshot
export const decodeSnapshot = (shareCode) => {
  try {
    // Check prefix
    if (!shareCode.startsWith('CQ1-')) {
      throw new Error('Invalid share code format')
    }

    // Remove prefix and decode
    const encoded = shareCode.slice(4)
    const json = decodeURIComponent(atob(encoded))
    const snapshot = JSON.parse(json)

    // Validate required fields
    if (!snapshot.friendCode || !snapshot.stats) {
      throw new Error('Invalid snapshot data')
    }

    return snapshot
  } catch (e) {
    console.error('Failed to decode snapshot:', e)
    return null
  }
}

// Generate a full share code from current state
export const generateShareCode = (state) => {
  const snapshot = createSnapshot(state)
  return encodeSnapshot(snapshot)
}

// Parse a share code and validate
export const parseShareCode = (shareCode) => {
  const snapshot = decodeSnapshot(shareCode)
  if (!snapshot) {
    return { valid: false, error: 'Invalid share code' }
  }

  return { valid: true, snapshot }
}

// Compare two players for leaderboard ranking
export const compareStats = (a, b, category = 'level') => {
  const getStatValue = (snapshot, cat) => {
    switch (cat) {
      case 'level':
        return snapshot.stats.level * 1000 + snapshot.stats.xp
      case 'focus':
        return snapshot.stats.totalFocusMinutes
      case 'sprites':
        return snapshot.stats.spritesCollected
      case 'quests':
        return snapshot.stats.questsCompleted
      case 'streaks':
        return Object.values(snapshot.streaks).reduce((a, b) => a + b, 0)
      case 'challenges':
        return snapshot.challenges.totalCompleted
      default:
        return snapshot.stats.level
    }
  }

  return getStatValue(b, category) - getStatValue(a, category)
}

// Format timestamp for display
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  // Less than a minute
  if (diff < 60000) {
    return 'Just now'
  }

  // Less than an hour
  if (diff < 3600000) {
    const mins = Math.floor(diff / 60000)
    return `${mins}m ago`
  }

  // Less than a day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}h ago`
  }

  // Less than a week
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000)
    return `${days}d ago`
  }

  // Show date
  return date.toLocaleDateString()
}

export default {
  createSnapshot,
  encodeSnapshot,
  decodeSnapshot,
  generateShareCode,
  parseShareCode,
  compareStats,
  formatTimestamp,
}
