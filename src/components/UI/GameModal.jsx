import { useSelector, useDispatch } from 'react-redux'
import { closeModal } from '../../features/gameStateSlice'
import LibraryView from '../Zones/LibraryView'
import GymView from '../Zones/GymView'
import CafeView from '../Zones/CafeView'
import DormView from '../Zones/DormView'
import BattleModal from '../Battle/BattleModal'
import SpriteBattleModal from '../Battle/SpriteBattleModal'
import MiniMap from './MiniMap'
import TeamView from '../Zones/TeamView'
import QuestJournal from '../Story/QuestJournal'
import DailyChallenges from '../Productivity/DailyChallenges'
import WeeklyGoals from '../Productivity/WeeklyGoals'
import FocusScheduler from '../Productivity/FocusScheduler'
import FriendManager from '../Social/FriendManager'
import Leaderboard from '../Social/Leaderboard'
import SettingsModal from './SettingsModal'
import { X } from 'lucide-react'

// Wrapper components for zone-specific battles
const LibraryBattle = (props) => <BattleModal bossType="LIBRARY" {...props} />
const GymBattle = (props) => <BattleModal bossType="GYM" {...props} />
const CafeBattle = (props) => <BattleModal bossType="CAFE" {...props} />
const DormBattle = (props) => <BattleModal bossType="DORM" {...props} />

const modalComponents = {
  // Zone views
  LIBRARY: LibraryView,
  GYM: GymView,
  CAFE: CafeView,
  DORM: DormView,

  // Battles
  GYM_BATTLE: GymBattle,
  LIBRARY_BATTLE: LibraryBattle,
  CAFE_BATTLE: CafeBattle,
  DORM_BATTLE: DormBattle,
  SPRITE_BATTLE: SpriteBattleModal,

  // Navigation
  MINIMAP: MiniMap,
  TEAM: TeamView,

  // Story/Quests
  JOURNAL: QuestJournal,

  // Productivity
  CHALLENGES: DailyChallenges,
  WEEKLY_GOALS: WeeklyGoals,
  CALENDAR: FocusScheduler,

  // Social
  FRIENDS: FriendManager,
  LEADERBOARD: Leaderboard,

  // Settings
  SETTINGS: SettingsModal,
}

export default function GameModal() {
  const dispatch = useDispatch()
  const gameState = useSelector(state => state.gameState || {})
  const activeModal = gameState.activeModal || null

  if (!activeModal) return null

  const ModalContent = modalComponents[activeModal]

  if (!ModalContent) return null

  const handleClose = () => {
    dispatch(closeModal())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-gba-dark border-4 border-gba-path rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-2 hover:bg-gba-wall/50 rounded transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal content */}
        <ModalContent onClose={handleClose} />
      </div>
    </div>
  )
}
