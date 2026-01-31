import { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { closeJournal } from '../../features/storySlice'
import { getQuest, getChapterQuests } from '../../data/story/quests'
import { getChapter, getChapterList } from '../../data/story/chapters'
import { X, BookOpen, CheckCircle, Circle, Lock, ChevronRight, Star } from 'lucide-react'

export default function QuestJournal({ onClose }) {
  const dispatch = useDispatch()
  const story = useSelector(state => state.story || {})
  const [selectedTab, setSelectedTab] = useState('quests') // 'quests' | 'chapters' | 'badges'
  const [expandedQuest, setExpandedQuest] = useState(null)

  // Safely destructure with defaults
  const activeQuests = story.activeQuests || []
  const completedQuests = story.completedQuests || []
  const questProgress = story.questProgress || {}
  const currentChapter = story.currentChapter || 'freshman_orientation'
  const completedChapters = story.completedChapters || []
  const badges = story.badges || []

  // Get active quest details
  const activeQuestDetails = useMemo(() => {
    return activeQuests.map(qId => ({
      ...getQuest(qId),
      progress: questProgress[qId] || {},
    }))
  }, [activeQuests, questProgress])

  // Get completed quest details
  const completedQuestDetails = useMemo(() => {
    return completedQuests.map(qId => getQuest(qId)).filter(Boolean)
  }, [completedQuests])

  // Get chapter progress
  const chapterProgress = useMemo(() => {
    const chapters = getChapterList()
    return chapters.map(ch => {
      const chapterQuests = getChapterQuests(ch.id)
      const completed = chapterQuests.filter(q => completedQuests.includes(q.id)).length
      return {
        ...ch,
        totalQuests: chapterQuests.length,
        completedQuests: completed,
        isComplete: completedChapters.includes(ch.id),
        isCurrent: currentChapter === ch.id,
        isLocked: ch.order > 1 && !completedChapters.includes(
          getChapterList().find(c => c.order === ch.order - 1)?.id
        ),
      }
    })
  }, [completedQuests, completedChapters, currentChapter])

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      dispatch(closeJournal())
    }
  }

  return (
    <div className="text-gba-light">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-gba-accent" />
          <h2 className="text-lg font-bold">Quest Journal</h2>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-gba-wall/50 rounded transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gba-path/30 pb-2">
        {['quests', 'chapters', 'badges'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-3 py-1 text-sm rounded-t transition-colors capitalize
              ${selectedTab === tab
                ? 'bg-gba-path/50 text-gba-light'
                : 'text-gba-light/60 hover:text-gba-light'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {/* Quests Tab */}
        {selectedTab === 'quests' && (
          <div className="space-y-3">
            {/* Active Quests */}
            <div>
              <h3 className="text-xs text-gba-accent mb-2 uppercase tracking-wider">
                Active Quests ({activeQuestDetails.length})
              </h3>
              {activeQuestDetails.length === 0 ? (
                <p className="text-sm text-gba-light/50 italic">No active quests</p>
              ) : (
                <div className="space-y-2">
                  {activeQuestDetails.map(quest => (
                    <QuestItem
                      key={quest.id}
                      quest={quest}
                      isExpanded={expandedQuest === quest.id}
                      onToggle={() => setExpandedQuest(
                        expandedQuest === quest.id ? null : quest.id
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Completed Quests */}
            {completedQuestDetails.length > 0 && (
              <div>
                <h3 className="text-xs text-gba-light/50 mb-2 uppercase tracking-wider mt-4">
                  Completed ({completedQuestDetails.length})
                </h3>
                <div className="space-y-1">
                  {completedQuestDetails.map(quest => (
                    <div
                      key={quest.id}
                      className="flex items-center gap-2 text-sm text-gba-light/50"
                    >
                      <CheckCircle size={14} className="text-green-500" />
                      <span className="line-through">{quest.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chapters Tab */}
        {selectedTab === 'chapters' && (
          <div className="space-y-2">
            {chapterProgress.map(chapter => (
              <ChapterItem key={chapter.id} chapter={chapter} />
            ))}
          </div>
        )}

        {/* Badges Tab */}
        {selectedTab === 'badges' && (
          <div>
            {badges.length === 0 ? (
              <p className="text-sm text-gba-light/50 italic text-center py-4">
                Complete quests to earn badges!
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {badges.map(badge => (
                  <BadgeItem key={badge} badgeId={badge} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Quest item component
function QuestItem({ quest, isExpanded, onToggle }) {
  const completedObjectives = quest.objectives.filter(
    obj => quest.progress[obj.id]
  ).length

  return (
    <div className="bg-gba-wall/20 rounded border border-gba-path/30">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2 text-left"
      >
        <div className="flex items-center gap-2">
          <ChevronRight
            size={14}
            className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          />
          <span className="text-sm font-medium">{quest.title}</span>
        </div>
        <span className="text-xs text-gba-light/50">
          {completedObjectives}/{quest.objectives.length}
        </span>
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 border-t border-gba-path/20">
          <p className="text-xs text-gba-light/70 mt-2 mb-3">
            {quest.description}
          </p>

          <div className="space-y-1.5">
            {quest.objectives.map(obj => (
              <div
                key={obj.id}
                className="flex items-center gap-2 text-xs"
              >
                {quest.progress[obj.id] ? (
                  <CheckCircle size={12} className="text-green-500" />
                ) : (
                  <Circle size={12} className="text-gba-light/30" />
                )}
                <span className={quest.progress[obj.id] ? 'text-gba-light/50 line-through' : ''}>
                  {obj.description}
                </span>
              </div>
            ))}
          </div>

          {quest.rewards && (
            <div className="mt-3 pt-2 border-t border-gba-path/20">
              <span className="text-xs text-gba-accent">
                Reward: +{quest.rewards.xp} XP
                {quest.rewards.unlockSprite && ` | Unlock: ${quest.rewards.unlockSprite}`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Chapter item component
function ChapterItem({ chapter }) {
  const progressPercent = chapter.totalQuests > 0
    ? (chapter.completedQuests / chapter.totalQuests) * 100
    : 0

  return (
    <div
      className={`p-3 rounded border ${
        chapter.isLocked
          ? 'bg-gba-wall/10 border-gba-path/20 opacity-50'
          : chapter.isCurrent
          ? 'bg-gba-path/20 border-gba-accent'
          : chapter.isComplete
          ? 'bg-green-900/20 border-green-700/50'
          : 'bg-gba-wall/20 border-gba-path/30'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {chapter.isLocked ? (
            <Lock size={14} className="text-gba-light/30" />
          ) : chapter.isComplete ? (
            <CheckCircle size={14} className="text-green-500" />
          ) : (
            <Star size={14} className={chapter.isCurrent ? 'text-gba-accent' : 'text-gba-light/50'} />
          )}
          <span className="text-sm font-medium">{chapter.title}</span>
        </div>
        <span className="text-xs text-gba-light/50">
          {chapter.completedQuests}/{chapter.totalQuests}
        </span>
      </div>

      <p className="text-xs text-gba-light/50 mb-2">{chapter.subtitle}</p>

      {/* Progress bar */}
      <div className="h-1.5 bg-gba-wall/30 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${
            chapter.isComplete ? 'bg-green-500' : 'bg-gba-accent'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}

// Badge item component
function BadgeItem({ badgeId }) {
  const BADGE_INFO = {
    freshman_complete: { name: 'Freshman', icon: '🎓' },
    sophomore_complete: { name: 'Sophomore', icon: '📚' },
    junior_complete: { name: 'Junior', icon: '⭐' },
    senior_complete: { name: 'Senior', icon: '🏆' },
    graduate: { name: 'Graduate', icon: '👨‍🎓' },
    phantom_slayer: { name: 'Phantom Slayer', icon: '⚔️' },
    dragon_tamer: { name: 'Dragon Tamer', icon: '🐉' },
    beast_slayer: { name: 'Beast Slayer', icon: '🦁' },
    renaissance: { name: 'Renaissance', icon: '🎨' },
    beloved: { name: 'Beloved', icon: '❤️' },
  }

  const badge = BADGE_INFO[badgeId] || { name: badgeId, icon: '🏅' }

  return (
    <div className="flex flex-col items-center p-2 bg-gba-wall/20 rounded border border-gba-path/30">
      <span className="text-2xl mb-1">{badge.icon}</span>
      <span className="text-[10px] text-center">{badge.name}</span>
    </div>
  )
}
