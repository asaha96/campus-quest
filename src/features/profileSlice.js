import { createSlice } from '@reduxjs/toolkit'

// Generate a random 6-character friend code
const generateFriendCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// Generate a unique player ID
const generatePlayerId = () => {
  return 'player_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

const initialState = {
  // Player identity
  playerId: generatePlayerId(),
  friendCode: generateFriendCode(),
  displayName: 'New Player',
  avatarSpriteId: 'player',
  createdAt: Date.now(),

  // Friends list
  friends: [], // { friendCode, displayName, lastSnapshot, addedAt }

  // Profile settings
  isPublic: true, // Whether to share stats
  showOnLeaderboard: true,

  // Imported snapshots (for leaderboard)
  importedSnapshots: [], // { friendCode, displayName, stats, timestamp }

  // Last exported snapshot
  lastExportTimestamp: null,

  // Social stats
  totalFriendsAdded: 0,
  snapshotsShared: 0,
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Update display name
    setDisplayName: (state, action) => {
      state.displayName = action.payload
    },

    // Update avatar sprite
    setAvatarSprite: (state, action) => {
      state.avatarSpriteId = action.payload
    },

    // Add a friend
    addFriend: (state, action) => {
      const { friendCode, displayName, snapshot } = action.payload

      // Don't add self
      if (friendCode === state.friendCode) return

      // Check if already friends
      if (state.friends.find(f => f.friendCode === friendCode)) return

      state.friends.push({
        friendCode,
        displayName,
        lastSnapshot: snapshot,
        addedAt: Date.now(),
      })

      state.totalFriendsAdded += 1
    },

    // Remove a friend
    removeFriend: (state, action) => {
      state.friends = state.friends.filter(f => f.friendCode !== action.payload)
    },

    // Update friend's snapshot
    updateFriendSnapshot: (state, action) => {
      const { friendCode, snapshot } = action.payload
      const friend = state.friends.find(f => f.friendCode === friendCode)
      if (friend) {
        friend.lastSnapshot = snapshot
      }
    },

    // Import a snapshot (for leaderboard)
    importSnapshot: (state, action) => {
      const { friendCode, displayName, stats, timestamp } = action.payload

      // Update existing or add new
      const existing = state.importedSnapshots.findIndex(s => s.friendCode === friendCode)
      if (existing >= 0) {
        state.importedSnapshots[existing] = { friendCode, displayName, stats, timestamp }
      } else {
        state.importedSnapshots.push({ friendCode, displayName, stats, timestamp })
      }
    },

    // Toggle public profile
    togglePublic: (state) => {
      state.isPublic = !state.isPublic
    },

    // Toggle leaderboard visibility
    toggleLeaderboardVisibility: (state) => {
      state.showOnLeaderboard = !state.showOnLeaderboard
    },

    // Track export
    recordExport: (state) => {
      state.lastExportTimestamp = Date.now()
      state.snapshotsShared += 1
    },

    // Regenerate friend code (in case of issues)
    regenerateFriendCode: (state) => {
      state.friendCode = generateFriendCode()
    },

    // Load saved state
    loadProfileState: (state, action) => {
      return { ...state, ...action.payload }
    },
  },
})

export const {
  setDisplayName,
  setAvatarSprite,
  addFriend,
  removeFriend,
  updateFriendSnapshot,
  importSnapshot,
  togglePublic,
  toggleLeaderboardVisibility,
  recordExport,
  regenerateFriendCode,
  loadProfileState,
} = profileSlice.actions

export default profileSlice.reducer
