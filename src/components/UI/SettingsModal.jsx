import { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleNotifications, setDefaultDurations } from '../../features/calendarSlice'
import { togglePublic, toggleLeaderboardVisibility } from '../../features/profileSlice'
import { showToast } from '../../features/gameStateSlice'
import { Settings, Volume2, VolumeX, Bell, BellOff, Eye, EyeOff, Download, Trash2, RotateCcw } from 'lucide-react'

export default function SettingsModal({ onClose }) {
  const dispatch = useDispatch()
  const calendar = useSelector(state => state.calendar || {})
  const profile = useSelector(state => state.profile || {})

  // Safely get defaults
  const defaultFocusDuration = calendar.defaultFocusDuration || 25
  const defaultBreakDuration = calendar.defaultBreakDuration || 5
  const notificationsEnabled = calendar.notificationsEnabled || false
  const isPublic = profile.isPublic || false
  const showOnLeaderboard = profile.showOnLeaderboard !== undefined ? profile.showOnLeaderboard : true

  const [soundEnabled, setSoundEnabled] = useState(true)
  const [focusDuration, setFocusDuration] = useState(defaultFocusDuration)
  const [breakDuration, setBreakDuration] = useState(defaultBreakDuration)

  // Export save data
  const handleExport = useCallback(() => {
    try {
      const saveData = localStorage.getItem('campus-quest-save')
      if (saveData) {
        const blob = new Blob([saveData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `campus-quest-save-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
        dispatch(showToast('Save data exported!'))
      }
    } catch (e) {
      dispatch(showToast('Export failed'))
    }
  }, [dispatch])

  // Import save data
  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const data = event.target?.result
            if (typeof data === 'string') {
              JSON.parse(data) // Validate JSON
              localStorage.setItem('campus-quest-save', data)
              dispatch(showToast('Save data imported! Refresh to apply.'))
            }
          } catch (err) {
            dispatch(showToast('Invalid save file'))
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }, [dispatch])

  // Reset game data
  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure? This will delete ALL your progress!')) {
      if (window.confirm('This cannot be undone. Really delete everything?')) {
        localStorage.removeItem('campus-quest-save')
        dispatch(showToast('Game reset! Refresh to start fresh.'))
      }
    }
  }, [dispatch])

  // Save duration settings
  const handleSaveDurations = () => {
    dispatch(setDefaultDurations({ focus: focusDuration, break: breakDuration }))
    dispatch(showToast('Settings saved!'))
  }

  return (
    <div className="text-gba-light">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Settings className="text-gba-accent" size={20} />
        <h2 className="text-lg font-bold">Settings</h2>
      </div>

      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
        {/* Audio settings */}
        <div className="p-3 bg-gba-wall/20 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Audio</h3>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 p-2 rounded w-full
              ${soundEnabled ? 'bg-gba-accent/20' : 'bg-gba-wall/30'}`}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>Sound Effects</span>
            <span className={`ml-auto text-xs ${soundEnabled ? 'text-green-400' : 'text-gba-light/50'}`}>
              {soundEnabled ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* Notification settings */}
        <div className="p-3 bg-gba-wall/20 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Notifications</h3>
          <button
            onClick={() => dispatch(toggleNotifications())}
            className={`flex items-center gap-2 p-2 rounded w-full
              ${notificationsEnabled ? 'bg-gba-accent/20' : 'bg-gba-wall/30'}`}
          >
            {notificationsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
            <span>Focus Reminders</span>
            <span className={`ml-auto text-xs ${notificationsEnabled ? 'text-green-400' : 'text-gba-light/50'}`}>
              {notificationsEnabled ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* Privacy settings */}
        <div className="p-3 bg-gba-wall/20 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Privacy</h3>
          <div className="space-y-2">
            <button
              onClick={() => dispatch(togglePublic())}
              className={`flex items-center gap-2 p-2 rounded w-full
                ${isPublic ? 'bg-gba-accent/20' : 'bg-gba-wall/30'}`}
            >
              {isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
              <span>Public Profile</span>
              <span className={`ml-auto text-xs ${isPublic ? 'text-green-400' : 'text-gba-light/50'}`}>
                {isPublic ? 'ON' : 'OFF'}
              </span>
            </button>
            <button
              onClick={() => dispatch(toggleLeaderboardVisibility())}
              className={`flex items-center gap-2 p-2 rounded w-full
                ${showOnLeaderboard ? 'bg-gba-accent/20' : 'bg-gba-wall/30'}`}
            >
              <span className="w-4">📊</span>
              <span>Show on Leaderboard</span>
              <span className={`ml-auto text-xs ${showOnLeaderboard ? 'text-green-400' : 'text-gba-light/50'}`}>
                {showOnLeaderboard ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>

        {/* Focus timer settings */}
        <div className="p-3 bg-gba-wall/20 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Focus Timer</h3>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="text-xs text-gba-light/50">Focus (min)</label>
              <input
                type="number"
                value={focusDuration}
                onChange={(e) => setFocusDuration(parseInt(e.target.value) || 25)}
                min={5}
                max={120}
                className="w-full p-2 bg-gba-dark border border-gba-path/50 rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gba-light/50">Break (min)</label>
              <input
                type="number"
                value={breakDuration}
                onChange={(e) => setBreakDuration(parseInt(e.target.value) || 5)}
                min={1}
                max={30}
                className="w-full p-2 bg-gba-dark border border-gba-path/50 rounded text-sm"
              />
            </div>
          </div>
          <button
            onClick={handleSaveDurations}
            className="w-full py-1.5 bg-gba-accent/80 hover:bg-gba-accent text-gba-dark
                     text-sm font-medium rounded transition-colors"
          >
            Save Timer Settings
          </button>
        </div>

        {/* Data management */}
        <div className="p-3 bg-gba-wall/20 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Data Management</h3>
          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 p-2 w-full bg-gba-path/20 hover:bg-gba-path/40
                       rounded transition-colors"
            >
              <Download size={16} />
              <span>Export Save Data</span>
            </button>
            <button
              onClick={handleImport}
              className="flex items-center gap-2 p-2 w-full bg-gba-path/20 hover:bg-gba-path/40
                       rounded transition-colors"
            >
              <RotateCcw size={16} />
              <span>Import Save Data</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 p-2 w-full bg-red-900/30 hover:bg-red-900/50
                       text-red-400 rounded transition-colors"
            >
              <Trash2 size={16} />
              <span>Reset All Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Version info */}
      <div className="mt-4 text-center text-[10px] text-gba-light/30">
        Campus Quest v1.0.0
      </div>
    </div>
  )
}
