import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { hideToast } from '../../features/gameStateSlice'

export default function Toast() {
  const dispatch = useDispatch()
  const { toastMessage } = useSelector(state => state.gameState)

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        dispatch(hideToast())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage, dispatch])

  if (!toastMessage) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-gba-dark border-2 border-gba-path rounded-lg px-6 py-3 shadow-lg">
        <p className="text-gba-light text-xs text-center">
          {toastMessage}
        </p>
      </div>
    </div>
  )
}
