import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createSnapshot, compareStats, formatTimestamp } from '../../utils/socialExport'
import { Trophy, Medal, TrendingUp, Users, Target, BookOpen, Zap } from 'lucide-react'

const CATEGORIES = [
  { id: 'level', name: 'Level', icon: TrendingUp },
  { id: 'focus', name: 'Focus', icon: Target },
  { id: 'sprites', name: 'Sprites', icon: Zap },
  { id: 'quests', name: 'Quests', icon: BookOpen },
  { id: 'streaks', name: 'Streaks', icon: Trophy },
]

export default function Leaderboard({ onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('level')
  const profile = useSelector(state => state.profile || {})
  const fullState = useSelector(state => state)

  // Safely get friends with default
  const friends = profile.friends || []

  // Get your own snapshot
  const mySnapshot = useMemo(() => createSnapshot(fullState), [fullState])

  // Combine your snapshot with friends' snapshots
  const allSnapshots = useMemo(() => {
    const snapshots = [{ ...mySnapshot, isMe: true }]

    friends.forEach(friend => {
      if (friend.lastSnapshot) {
        snapshots.push({
          ...friend.lastSnapshot,
          isMe: false,
        })
      }
    })

    return snapshots.sort((a, b) => compareStats(a, b, selectedCategory))
  }, [mySnapshot, friends, selectedCategory])

  // Get stat value for display
  const getStatDisplay = (snapshot, category) => {
    switch (category) {
      case 'level':
        return `Lv.${snapshot.stats.level} (${snapshot.stats.xp} XP)`
      case 'focus':
        return `${snapshot.stats.totalFocusMinutes} min`
      case 'sprites':
        return `${snapshot.stats.spritesCollected} caught`
      case 'quests':
        return `${snapshot.stats.questsCompleted} done`
      case 'streaks':
        return `${Object.values(snapshot.streaks).reduce((a, b) => a + b, 0)} total`
      default:
        return snapshot.stats.level
    }
  }

  // Get rank medal
  const getRankMedal = (rank) => {
    switch (rank) {
      case 1:
        return <Medal className="text-yellow-400" size={18} />
      case 2:
        return <Medal className="text-gray-300" size={18} />
      case 3:
        return <Medal className="text-orange-400" size={18} />
      default:
        return <span className="w-[18px] text-center text-sm text-gba-light/50">{rank}</span>
    }
  }

  return (
    <div className="text-gba-light">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-gba-accent" size={20} />
        <h2 className="text-lg font-bold">Leaderboard</h2>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs whitespace-nowrap
                ${selectedCategory === cat.id
                  ? 'bg-gba-accent/30 text-gba-accent'
                  : 'text-gba-light/60 hover:text-gba-light'
                }`}
            >
              <Icon size={12} />
              {cat.name}
            </button>
          )
        })}
      </div>

      {/* Rankings */}
      <div className="space-y-2 max-h-[250px] overflow-y-auto">
        {allSnapshots.map((snapshot, index) => {
          const rank = index + 1
          const isMe = snapshot.isMe

          return (
            <div
              key={snapshot.friendCode}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                isMe
                  ? 'bg-gba-accent/20 border border-gba-accent/30'
                  : 'bg-gba-wall/20'
              }`}
            >
              {/* Rank */}
              <div className="w-8 flex justify-center">
                {getRankMedal(rank)}
              </div>

              {/* Player info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium truncate ${isMe ? 'text-gba-accent' : ''}`}>
                    {snapshot.displayName}
                  </span>
                  {isMe && (
                    <span className="text-[10px] bg-gba-accent/30 px-1 rounded">YOU</span>
                  )}
                </div>
                <div className="text-[10px] text-gba-light/50">
                  {snapshot.friendCode}
                  {!isMe && snapshot.timestamp && (
                    <> • {formatTimestamp(snapshot.timestamp)}</>
                  )}
                </div>
              </div>

              {/* Stat value */}
              <div className="text-right">
                <div className="text-sm font-medium">
                  {getStatDisplay(snapshot, selectedCategory)}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {allSnapshots.length === 1 && (
        <div className="mt-4 p-4 bg-gba-wall/10 rounded-lg text-center">
          <Users className="mx-auto mb-2 text-gba-light/30" size={32} />
          <p className="text-sm text-gba-light/50">
            Add friends to compare progress!
          </p>
          <p className="text-xs text-gba-light/30 mt-1">
            Share your progress code in the Friends menu
          </p>
        </div>
      )}

      {/* Stats summary */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 bg-gba-wall/20 rounded">
          <div className="font-medium">{mySnapshot.stats.level}</div>
          <div className="text-gba-light/50">Your Level</div>
        </div>
        <div className="p-2 bg-gba-wall/20 rounded">
          <div className="font-medium">
            #{allSnapshots.findIndex(s => s.isMe) + 1}
          </div>
          <div className="text-gba-light/50">Your Rank</div>
        </div>
        <div className="p-2 bg-gba-wall/20 rounded">
          <div className="font-medium">{friends.length}</div>
          <div className="text-gba-light/50">Friends</div>
        </div>
      </div>
    </div>
  )
}
