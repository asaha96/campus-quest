import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addSubject, removeSubject } from '../../features/calendarSlice'
import { BookOpen, Plus, Trash2, Target } from 'lucide-react'

const SUBJECT_COLORS = [
  '#4a90d9', '#e74c3c', '#2ecc71', '#9b59b6',
  '#f39c12', '#1abc9c', '#e91e63', '#00bcd4',
]

export default function StudyPlanner({ onClose }) {
  const dispatch = useDispatch()
  const calendar = useSelector(state => state.calendar || {})

  // Safely destructure with defaults
  const subjects = calendar.subjects || []
  const focusBlocks = calendar.focusBlocks || []

  const [isAddingSubject, setIsAddingSubject] = useState(false)
  const [newSubject, setNewSubject] = useState({ name: '', color: SUBJECT_COLORS[0] })

  // Calculate time spent per subject
  const subjectStats = subjects.map(subject => {
    const blocks = focusBlocks.filter(b => b.subject === subject.name)
    const totalMinutes = blocks.reduce((acc, b) => {
      const start = new Date(`2000-01-01T${b.startTime}`)
      const end = new Date(`2000-01-01T${b.endTime}`)
      return acc + (end - start) / 60000
    }, 0)
    const completedMinutes = blocks
      .filter(b => b.completed)
      .reduce((acc, b) => {
        const start = new Date(`2000-01-01T${b.startTime}`)
        const end = new Date(`2000-01-01T${b.endTime}`)
        return acc + (end - start) / 60000
      }, 0)

    return {
      ...subject,
      totalMinutes,
      completedMinutes,
      blockCount: blocks.length,
    }
  })

  const handleAddSubject = () => {
    if (newSubject.name.trim()) {
      dispatch(addSubject(newSubject))
      setIsAddingSubject(false)
      setNewSubject({ name: '', color: SUBJECT_COLORS[0] })
    }
  }

  return (
    <div className="text-gba-light">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="text-gba-accent" size={20} />
          <h2 className="text-lg font-bold">Study Planner</h2>
        </div>
        <button
          onClick={() => setIsAddingSubject(!isAddingSubject)}
          className="p-1.5 bg-gba-path/30 hover:bg-gba-path/50 rounded transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Add subject form */}
      {isAddingSubject && (
        <div className="mb-4 p-3 bg-gba-wall/20 rounded-lg border border-gba-path/30">
          <h3 className="text-sm font-medium mb-2">Add Subject</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newSubject.name}
              onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
              placeholder="Subject name"
              className="flex-1 p-2 bg-gba-dark border border-gba-path/50 rounded text-sm"
            />
          </div>
          <div className="flex gap-1 mb-3">
            {SUBJECT_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setNewSubject({ ...newSubject, color })}
                className={`w-6 h-6 rounded ${newSubject.color === color ? 'ring-2 ring-white' : ''}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            onClick={handleAddSubject}
            disabled={!newSubject.name.trim()}
            className="w-full py-2 bg-gba-accent/80 hover:bg-gba-accent text-gba-dark
                     font-medium rounded transition-colors disabled:opacity-50"
          >
            Add Subject
          </button>
        </div>
      )}

      {/* Subject list */}
      <div className="space-y-2 max-h-[250px] overflow-y-auto">
        {subjectStats.map(subject => (
          <div
            key={subject.id}
            className="p-3 bg-gba-wall/20 rounded-lg border-l-4"
            style={{ borderColor: subject.color }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{subject.name}</span>
              {subject.id !== 'default' && (
                <button
                  onClick={() => dispatch(removeSubject(subject.id))}
                  className="p-1 hover:bg-red-500/30 rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="font-medium">{subject.blockCount}</div>
                <div className="text-gba-light/50">Sessions</div>
              </div>
              <div>
                <div className="font-medium">{subject.totalMinutes}</div>
                <div className="text-gba-light/50">Scheduled</div>
              </div>
              <div>
                <div className="font-medium text-green-400">{subject.completedMinutes}</div>
                <div className="text-gba-light/50">Completed</div>
              </div>
            </div>

            {/* Progress bar */}
            {subject.totalMinutes > 0 && (
              <div className="mt-2 h-1.5 bg-gba-wall/30 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${(subject.completedMinutes / subject.totalMinutes) * 100}%`,
                    backgroundColor: subject.color,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-4 p-3 bg-gba-path/10 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Target size={14} className="text-gba-accent" />
          <span className="text-xs font-medium">Pro Tips</span>
        </div>
        <ul className="text-[10px] text-gba-light/60 space-y-1">
          <li>Create subjects for different courses or projects</li>
          <li>Schedule focus blocks in the Calendar view</li>
          <li>Track your progress over time</li>
        </ul>
      </div>
    </div>
  )
}
