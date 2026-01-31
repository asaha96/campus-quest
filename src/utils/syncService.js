// Sync service abstraction layer
// Provides a clean interface for future backend integration
// Currently uses localStorage, but can be swapped for API calls

const STORAGE_PREFIX = 'campus_quest_sync_'

// Save data locally (simulates sync)
export const saveToCloud = async (key, data) => {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify({
      data,
      timestamp: Date.now(),
    }))
    return { success: true }
  } catch (e) {
    console.error('Sync save failed:', e)
    return { success: false, error: e.message }
  }
}

// Load data from local storage (simulates sync)
export const loadFromCloud = async (key) => {
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + key)
    if (!stored) {
      return { success: true, data: null }
    }
    const parsed = JSON.parse(stored)
    return { success: true, data: parsed.data, timestamp: parsed.timestamp }
  } catch (e) {
    console.error('Sync load failed:', e)
    return { success: false, error: e.message }
  }
}

// Check if online (for future use)
export const isOnline = () => {
  return navigator.onLine
}

// Sync status
export const getSyncStatus = () => {
  const lastSync = localStorage.getItem(STORAGE_PREFIX + 'last_sync')
  return {
    lastSync: lastSync ? parseInt(lastSync) : null,
    isOnline: isOnline(),
    syncEnabled: false, // Set to true when backend is available
  }
}

// Record sync timestamp
export const recordSync = () => {
  localStorage.setItem(STORAGE_PREFIX + 'last_sync', Date.now().toString())
}

// Copy text to clipboard (for share codes)
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return { success: true }
  } catch (e) {
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return { success: true }
    } catch (fallbackError) {
      console.error('Copy failed:', fallbackError)
      return { success: false, error: 'Failed to copy' }
    }
  }
}

// Read from clipboard (for importing share codes)
export const readFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    return { success: true, text }
  } catch (e) {
    console.error('Clipboard read failed:', e)
    return { success: false, error: 'Failed to read clipboard' }
  }
}

// Future API endpoints (placeholders)
export const API = {
  // User profile
  async getProfile(userId) {
    // Will call: GET /api/users/:userId
    return { success: false, error: 'Not implemented' }
  },

  async updateProfile(userId, profile) {
    // Will call: PUT /api/users/:userId
    return { success: false, error: 'Not implemented' }
  },

  // Friends
  async getFriends(userId) {
    // Will call: GET /api/users/:userId/friends
    return { success: false, error: 'Not implemented' }
  },

  async addFriend(userId, friendCode) {
    // Will call: POST /api/users/:userId/friends
    return { success: false, error: 'Not implemented' }
  },

  // Leaderboard
  async getLeaderboard(category, limit = 100) {
    // Will call: GET /api/leaderboard?category=:category&limit=:limit
    return { success: false, error: 'Not implemented' }
  },

  async getFriendLeaderboard(userId, category) {
    // Will call: GET /api/users/:userId/leaderboard?category=:category
    return { success: false, error: 'Not implemented' }
  },

  // Progress sync
  async syncProgress(userId, progress) {
    // Will call: POST /api/users/:userId/progress
    return { success: false, error: 'Not implemented' }
  },

  async getProgress(userId) {
    // Will call: GET /api/users/:userId/progress
    return { success: false, error: 'Not implemented' }
  },
}

export default {
  saveToCloud,
  loadFromCloud,
  isOnline,
  getSyncStatus,
  recordSync,
  copyToClipboard,
  readFromClipboard,
  API,
}
