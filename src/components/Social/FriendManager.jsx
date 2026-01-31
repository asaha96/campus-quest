import { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  addFriend,
  removeFriend,
  setDisplayName,
  recordExport,
} from '../../features/profileSlice'
import { showToast } from '../../features/gameStateSlice'
import { generateShareCode, parseShareCode, formatTimestamp } from '../../utils/socialExport'
import { copyToClipboard, readFromClipboard } from '../../utils/syncService'
import { Users, Copy, UserPlus, Trash2, Share2, Edit2, Check } from 'lucide-react'

export default function FriendManager({ onClose }) {
  const dispatch = useDispatch()
  const profile = useSelector(state => state.profile || {})
  const fullState = useSelector(state => state)

  // Safely destructure with defaults
  const friendCode = profile.friendCode || ''
  const displayName = profile.displayName || 'Player'
  const friends = profile.friends || []

  const [importCode, setImportCode] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState(displayName)

  // Copy friend code to clipboard
  const handleCopyFriendCode = async () => {
    const result = await copyToClipboard(friendCode)
    if (result.success) {
      dispatch(showToast('Friend code copied!'))
    } else {
      dispatch(showToast('Failed to copy'))
    }
  }

  // Generate and copy share code
  const handleShareProgress = async () => {
    const shareCode = generateShareCode(fullState)
    if (shareCode) {
      const result = await copyToClipboard(shareCode)
      if (result.success) {
        dispatch(recordExport())
        dispatch(showToast('Progress code copied! Share with friends.'))
      }
    }
  }

  // Import friend's progress
  const handleImport = useCallback(() => {
    if (!importCode.trim()) return

    const { valid, snapshot, error } = parseShareCode(importCode.trim())

    if (!valid) {
      dispatch(showToast('Invalid share code'))
      return
    }

    // Check if it's self
    if (snapshot.friendCode === friendCode) {
      dispatch(showToast("That's your own code!"))
      return
    }

    // Add friend
    dispatch(addFriend({
      friendCode: snapshot.friendCode,
      displayName: snapshot.displayName,
      snapshot,
    }))

    dispatch(showToast(`Added ${snapshot.displayName} as friend!`))
    setImportCode('')
    setIsImporting(false)
  }, [importCode, friendCode, dispatch])

  // Paste from clipboard
  const handlePaste = async () => {
    const result = await readFromClipboard()
    if (result.success) {
      setImportCode(result.text)
    }
  }

  // Update display name
  const handleSaveName = () => {
    if (newName.trim()) {
      dispatch(setDisplayName(newName.trim()))
      setIsEditingName(false)
      dispatch(showToast('Name updated!'))
    }
  }

  return (
    <div className="text-gba-light">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Users className="text-gba-accent" size={20} />
        <h2 className="text-lg font-bold">Friends</h2>
      </div>

      {/* Your profile */}
      <div className="p-3 bg-gba-wall/20 rounded-lg mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gba-light/50">Your Profile</span>
          <button
            onClick={() => setIsEditingName(!isEditingName)}
            className="p-1 hover:bg-gba-path/30 rounded"
          >
            <Edit2 size={12} />
          </button>
        </div>

        {isEditingName ? (
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 p-2 bg-gba-dark border border-gba-path/50 rounded text-sm"
              maxLength={20}
            />
            <button
              onClick={handleSaveName}
              className="p-2 bg-gba-accent/80 hover:bg-gba-accent rounded"
            >
              <Check size={14} className="text-gba-dark" />
            </button>
          </div>
        ) : (
          <div className="font-medium mb-2">{displayName}</div>
        )}

        {/* Friend code */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gba-light/70">Friend Code:</span>
          <code className="px-2 py-1 bg-gba-dark rounded text-gba-accent font-mono">
            {friendCode}
          </code>
          <button
            onClick={handleCopyFriendCode}
            className="p-1.5 hover:bg-gba-path/30 rounded transition-colors"
            title="Copy friend code"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>

      {/* Share progress button */}
      <button
        onClick={handleShareProgress}
        className="w-full mb-4 p-3 bg-gba-accent/20 hover:bg-gba-accent/30
                 border border-gba-accent/50 rounded-lg transition-colors
                 flex items-center justify-center gap-2"
      >
        <Share2 size={16} className="text-gba-accent" />
        <span>Share Progress Code</span>
      </button>

      {/* Import friend */}
      <div className="mb-4">
        {isImporting ? (
          <div className="p-3 bg-gba-wall/20 rounded-lg border border-gba-path/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Import Friend</span>
              <button
                onClick={() => setIsImporting(false)}
                className="text-xs text-gba-light/50 hover:text-gba-light"
              >
                Cancel
              </button>
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={importCode}
                onChange={(e) => setImportCode(e.target.value)}
                placeholder="Paste share code here..."
                className="flex-1 p-2 bg-gba-dark border border-gba-path/50 rounded text-xs"
              />
              <button
                onClick={handlePaste}
                className="px-2 bg-gba-path/30 hover:bg-gba-path/50 rounded"
                title="Paste from clipboard"
              >
                <Copy size={14} />
              </button>
            </div>
            <button
              onClick={handleImport}
              disabled={!importCode.trim()}
              className="w-full py-2 bg-gba-accent/80 hover:bg-gba-accent text-gba-dark
                       font-medium rounded transition-colors disabled:opacity-50"
            >
              Add Friend
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsImporting(true)}
            className="w-full p-2 border border-gba-path/30 border-dashed rounded
                     text-gba-light/50 hover:text-gba-light hover:border-gba-path/50
                     flex items-center justify-center gap-2 transition-colors"
          >
            <UserPlus size={16} />
            <span>Add Friend</span>
          </button>
        )}
      </div>

      {/* Friends list */}
      <div className="space-y-2 max-h-[150px] overflow-y-auto">
        {friends.length === 0 ? (
          <p className="text-center text-gba-light/40 text-sm py-4">
            No friends yet. Share your progress code to connect!
          </p>
        ) : (
          friends.map(friend => (
            <div
              key={friend.friendCode}
              className="flex items-center justify-between p-2 bg-gba-wall/20 rounded"
            >
              <div>
                <div className="font-medium text-sm">{friend.displayName}</div>
                <div className="text-[10px] text-gba-light/50">
                  {friend.friendCode} • {formatTimestamp(friend.addedAt)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {friend.lastSnapshot && (
                  <span className="text-xs text-gba-accent">
                    Lv.{friend.lastSnapshot.stats.level}
                  </span>
                )}
                <button
                  onClick={() => dispatch(removeFriend(friend.friendCode))}
                  className="p-1 hover:bg-red-500/30 rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
