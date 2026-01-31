import { createSlice } from '@reduxjs/toolkit'

// Get current week's dates
const getWeekDates = () => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))

  const dates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

const initialState = {
  // Focus blocks - scheduled study sessions
  focusBlocks: [], // { id, date, startTime, endTime, subject, completed }

  // Study subjects for organization
  subjects: [
    { id: 'default', name: 'General Study', color: '#4a90d9' },
  ],

  // Current week dates for calendar view
  currentWeekDates: getWeekDates(),

  // Weekly study plan
  weeklyPlan: {
    mondayGoals: [],
    tuesdayGoals: [],
    wednesdayGoals: [],
    thursdayGoals: [],
    fridayGoals: [],
    saturdayGoals: [],
    sundayGoals: [],
  },

  // Reminders (if notifications enabled)
  reminders: [], // { id, focusBlockId, reminderTime, notified }

  // Settings
  notificationsEnabled: false,
  defaultFocusDuration: 25, // minutes
  defaultBreakDuration: 5, // minutes

  // Stats
  totalScheduledMinutes: 0,
  totalCompletedMinutes: 0,
}

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // Add a focus block
    addFocusBlock: (state, action) => {
      const block = {
        id: Date.now().toString(),
        completed: false,
        ...action.payload,
      }
      state.focusBlocks.push(block)

      // Calculate duration and add to total scheduled
      const start = new Date(`2000-01-01T${block.startTime}`)
      const end = new Date(`2000-01-01T${block.endTime}`)
      const minutes = (end - start) / 60000
      if (minutes > 0) {
        state.totalScheduledMinutes += minutes
      }
    },

    // Update a focus block
    updateFocusBlock: (state, action) => {
      const { id, ...updates } = action.payload
      const index = state.focusBlocks.findIndex(b => b.id === id)
      if (index !== -1) {
        state.focusBlocks[index] = { ...state.focusBlocks[index], ...updates }
      }
    },

    // Remove a focus block
    removeFocusBlock: (state, action) => {
      const block = state.focusBlocks.find(b => b.id === action.payload)
      if (block) {
        const start = new Date(`2000-01-01T${block.startTime}`)
        const end = new Date(`2000-01-01T${block.endTime}`)
        const minutes = (end - start) / 60000
        if (minutes > 0) {
          state.totalScheduledMinutes -= minutes
        }
      }
      state.focusBlocks = state.focusBlocks.filter(b => b.id !== action.payload)
    },

    // Mark focus block as completed
    completeFocusBlock: (state, action) => {
      const block = state.focusBlocks.find(b => b.id === action.payload)
      if (block && !block.completed) {
        block.completed = true

        const start = new Date(`2000-01-01T${block.startTime}`)
        const end = new Date(`2000-01-01T${block.endTime}`)
        const minutes = (end - start) / 60000
        if (minutes > 0) {
          state.totalCompletedMinutes += minutes
        }
      }
    },

    // Add a subject
    addSubject: (state, action) => {
      state.subjects.push({
        id: Date.now().toString(),
        ...action.payload,
      })
    },

    // Remove a subject
    removeSubject: (state, action) => {
      state.subjects = state.subjects.filter(s => s.id !== action.payload)
    },

    // Update current week
    updateCurrentWeek: (state) => {
      state.currentWeekDates = getWeekDates()
    },

    // Navigate to next week
    nextWeek: (state) => {
      const firstDate = new Date(state.currentWeekDates[0])
      firstDate.setDate(firstDate.getDate() + 7)
      const dates = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(firstDate)
        date.setDate(firstDate.getDate() + i)
        dates.push(date.toISOString().split('T')[0])
      }
      state.currentWeekDates = dates
    },

    // Navigate to previous week
    prevWeek: (state) => {
      const firstDate = new Date(state.currentWeekDates[0])
      firstDate.setDate(firstDate.getDate() - 7)
      const dates = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(firstDate)
        date.setDate(firstDate.getDate() + i)
        dates.push(date.toISOString().split('T')[0])
      }
      state.currentWeekDates = dates
    },

    // Toggle notifications
    toggleNotifications: (state) => {
      state.notificationsEnabled = !state.notificationsEnabled
    },

    // Update default durations
    setDefaultDurations: (state, action) => {
      const { focus, break: breakTime } = action.payload
      if (focus) state.defaultFocusDuration = focus
      if (breakTime) state.defaultBreakDuration = breakTime
    },

    // Add reminder
    addReminder: (state, action) => {
      state.reminders.push({
        id: Date.now().toString(),
        notified: false,
        ...action.payload,
      })
    },

    // Mark reminder as notified
    markReminderNotified: (state, action) => {
      const reminder = state.reminders.find(r => r.id === action.payload)
      if (reminder) {
        reminder.notified = true
      }
    },

    // Load saved state
    loadCalendarState: (state, action) => {
      return { ...state, ...action.payload }
    },
  },
})

export const {
  addFocusBlock,
  updateFocusBlock,
  removeFocusBlock,
  completeFocusBlock,
  addSubject,
  removeSubject,
  updateCurrentWeek,
  nextWeek,
  prevWeek,
  toggleNotifications,
  setDefaultDurations,
  addReminder,
  markReminderNotified,
  loadCalendarState,
} = calendarSlice.actions

export default calendarSlice.reducer
