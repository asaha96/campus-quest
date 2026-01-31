import { useSelector, useDispatch } from 'react-redux'
import { closeModal } from '../../features/gameStateSlice'
import LibraryView from '../Zones/LibraryView'
import GymView from '../Zones/GymView'
import CafeView from '../Zones/CafeView'
import DormView from '../Zones/DormView'
import { X } from 'lucide-react'

const modalComponents = {
  LIBRARY: LibraryView,
  GYM: GymView,
  CAFE: CafeView,
  DORM: DormView,
}

export default function GameModal() {
  const dispatch = useDispatch()
  const { activeModal } = useSelector(state => state.gameState)

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
