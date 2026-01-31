import { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  addFocusBlock,
  removeFocusBlock,
  completeFocusBlock,
  nextWeek,
  prevWeek,
} from '../../features/calendarSlice'
import { Calendar, Plus, ChevronLeft, ChevronRight, Clock, Check, Trash2 } from 'lucide-react'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
  '20:00', '21:00', '22:00',
]

export default function FocusScheduler({ onClose }) {
  const dispatch = useDispatch()
  const calendar = useSelector(state => state.calendar || {})
  const [isAddingBlock, setIsAddingBlock] = useState(false)
  const [newBlock, setNewBlock] = useState({
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    subject: 'General Study',
  })

  // Safely destructure with defaults
  const focusBlocks = calendar.focusBlocks || []
  const subjects = calendar.subjects || []
  const currentWeekDates = calendar.currentWeekDates || []
  const totalScheduledMinutes = calendar.totalScheduledMinutes || 0
  const totalCompletedMinutes = calendar.totalCompletedMinutes || 0

  // Get blocks for current week
  const weekBlocks = useMemo(() => {
    const blocks = {}
    currentWeekDates.forEach(date => {
      blocks[date] = focusBlocks.filter(b => b.date === date)
    })
    return blocks
  }, [focusBlocks, currentWeekDates])

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.getDate()
  }

  // Check if date is today
  const isToday = (dateStr) => {
    const today = new Date().toISOString().split('T')[0]
    return dateStr === today
  }

  // Handle adding a new block
  const handleAddBlock = () => {
    if (newBlock.date && newBlock.startTime && newBlock.endTime) {
      dispatch(addFocusBlock(newBlock))
      setIsAddingBlock(false)
      setNewBlock({
        date: '',
        startTime: '09:00',
        endTime: '10:00',
        subject: 'General Study',
      })
    }
  }

  // Calculate week range for display
  const weekRange = useMemo(() => {
    if (currentWeekDates.length === 0) return ''
    const start = new Date(currentWeekDates[0])
    const end = new Date(currentWeekDates[6])
    const formatOptions = { month: 'short', day: 'numeric' }
    return `${start.toLocaleDateString('en-US', formatOptions)} - ${end.toLocaleDateString('en-US', formatOptions)}`
  }, [currentWeekDates])

  return (
    <div className="text-gba-light">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-gba-accent" size={20} />
          <h2 className="text-lg font-bold">Focus Schedule</h2>
        </div>
        <button
          onClick={() => setIsAddingBlock(!isAddingBlock)}
          className="p-1.5 bg-gba-path/30 hover:bg-gba-path/50 rounded transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-4 text-center">
        <div className="flex-1 p-2 bg-gba-wall/20 rounded">
          <div className="text-lg font-medium text-gba-accent">{totalScheduledMinutes}</div>
          <div className="text-[10px] text-gba-light/50">Scheduled (min)</div>
        </div>
        <div className="flex-1 p-2 bg-gba-wall/20 rounded">
          <div className="text-lg font-medium text-green-400">{totalCompletedMinutes}</div>
          <div className="text-[10px] text-gba-light/50">Completed (min)</div>
        </div>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => dispatch(prevWeek())}
          className="p-1 hover:bg-gba-wall/30 rounded transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm">{weekRange}</span>
        <button
          onClick={() => dispatch(nextWeek())}
          className="p-1 hover:bg-gba-wall/30 rounded transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Add block form */}
      {isAddingBlock && (
        <div className="mb-4 p-3 bg-gba-wall/20 rounded-lg border border-gba-path/30">
          <h3 className="text-sm font-medium mb-2">New Focus Block</h3>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select
              value={newBlock.date}
              onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })}
              className="p-2 bg-gba-dark border border-gba-path/50 rounded text-sm"
            >
              <option value="">Select Day</option>
              {currentWeekDates.map((date, idx) => (
                <option key={date} value={date}>
                  {DAY_NAMES[idx]} {formatDate(date)}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newBlock.subject}
              onChange={(e) => setNewBlock({ ...newBlock, subject: e.target.value })}
              placeholder="Subject"
              className="p-2 bg-gba-dark border border-gba-path/50 rounded text-sm"
            />
          </div>
          <div className="flex gap-2 mb-2">
            <select
              value={newBlock.startTime}
              onChange={(e) => setNewBlock({ ...newBlock, startTime: e.target.value })}
              className="flex-1 p-2 bg-gba-dark border border-gba-path/50 rounded text-sm"
            >
              {TIME_SLOTS.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            <span className="self-center">to</span>
            <select
              value={newBlock.endTime}
              onChange={(e) => setNewBlock({ ...newBlock, endTime: e.target.value })}
              className="flex-1 p-2 bg-gba-dark border border-gba-path/50 rounded text-sm"
            >
              {TIME_SLOTS.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAddBlock}
            disabled={!newBlock.date}
            className="w-full py-2 bg-gba-accent/80 hover:bg-gba-accent text-gba-dark
                     font-medium rounded transition-colors disabled:opacity-50"
          >
            Add Block
          </button>
        </div>
      )}

      {/* Week calendar view */}
      <div className="grid grid-cols-7 gap-1 max-h-[200px] overflow-y-auto">
        {/* Day headers */}
        {currentWeekDates.map((date, idx) => (
          <div
            key={date}
            className={`text-center p-1 text-[10px] ${
              isToday(date) ? 'text-gba-accent font-bold' : 'text-gba-light/50'
            }`}
          >
            <div>{DAY_NAMES[idx]}</div>
            <div className={`text-sm ${isToday(date) ? 'bg-gba-accent/30 rounded-full w-6 h-6 flex items-center justify-center mx-auto' : ''}`}>
              {formatDate(date)}
            </div>
          </div>
        ))}

        {/* Day blocks */}
        {currentWeekDates.map(date => (
          <div key={`blocks-${date}`} className="min-h-[60px]">
            {weekBlocks[date]?.map(block => (
              <div
                key={block.id}
                className={`text-[8px] p-1 mb-0.5 rounded ${
                  block.completed
                    ? 'bg-green-900/40 border-l-2 border-green-500'
                    : 'bg-gba-path/30 border-l-2 border-gba-accent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{block.subject}</span>
                  <div className="flex gap-0.5">
                    {!block.completed && (
                      <button
                        onClick={() => dispatch(completeFocusBlock(block.id))}
                        className="p-0.5 hover:bg-green-500/30 rounded"
                      >
                        <Check size={10} />
                      </button>
                    )}
                    <button
                      onClick={() => dispatch(removeFocusBlock(block.id))}
                      className="p-0.5 hover:bg-red-500/30 rounded"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
                <div className="text-gba-light/50">
                  {block.startTime}-{block.endTime}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {Object.values(weekBlocks).every(b => b.length === 0) && (
        <div className="text-center py-4 text-gba-light/40 text-sm">
          No focus blocks scheduled this week.
          <br />
          Click + to add one!
        </div>
      )}
    </div>
  )
}
