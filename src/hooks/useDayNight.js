import { useState, useEffect } from 'react'

// Returns a filter style based on the current time of day
// Creates a day/night cycle effect

export default function useDayNight() {
  const [timeOfDay, setTimeOfDay] = useState('day')
  const [filterStyle, setFilterStyle] = useState({}) // Force no filter

  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours()

      let period = 'day'
      let filter = {}

      if (hour >= 6 && hour < 8) {
        // Dawn
        period = 'dawn'
        filter = {
          filter: 'brightness(0.9) sepia(0.2) hue-rotate(-10deg)',
        }
      } else if (hour >= 8 && hour < 17) {
        // Day
        period = 'day'
        filter = {}
      } else if (hour >= 17 && hour < 19) {
        // Dusk
        period = 'dusk'
        filter = {
          filter: 'brightness(0.85) sepia(0.3) hue-rotate(15deg)',
        }
      } else if (hour >= 19 && hour < 21) {
        // Evening
        period = 'evening'
        filter = {
          filter: 'brightness(0.7) saturate(0.8) hue-rotate(20deg)',
        }
      } else {
        // Night (21:00 - 06:00)
        period = 'night'
        filter = {
          filter: 'brightness(0.8) saturate(0.8) hue-rotate(15deg)',
        }
      }

      setTimeOfDay(period)
      setFilterStyle(filter)
    }

    updateTime()
    // const interval = setInterval(updateTime, 60000) // Update every minute
    // return () => clearInterval(interval)
  }, [])

  return { timeOfDay, filterStyle }
}
