'use client'

import { useState, useEffect } from 'react'

interface LogEntry {
  id: string
  date: string
  calories?: number
  weight?: number
  activity?: string
}

interface CalendarProps {
  onDateSelect: (date: Date, hasCalorieLog: boolean, hasWeightLog: boolean, hasActivityLog: boolean) => void
}

export default function Calendar({ onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [logs, setLogs] = useState<{ calorieLogs: LogEntry[], weightLogs: LogEntry[], activityLogs: LogEntry[] }>({
    calorieLogs: [],
    weightLogs: [],
    activityLogs: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/logs')
      const data = await response.json()
      setLogs(data)
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getLogsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const calorieLog = logs.calorieLogs?.find(log => 
      log.date.startsWith(dateStr)
    )
    const weightLog = logs.weightLogs?.find(log => 
      log.date.startsWith(dateStr)
    )
    const activityLog = logs.activityLogs?.find(log => 
      log.date.startsWith(dateStr)
    )
    
    return { calorieLog, weightLog, activityLog }
  }

  const handleDateClick = (date: Date) => {
    const { calorieLog, weightLog, activityLog } = getLogsForDate(date)
    onDateSelect(date, !!calorieLog, !!weightLog, !!activityLog)
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const days = getDaysInMonth(currentDate)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading calendar...</span>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-xl font-semibold text-gray-900">
          {formatMonthYear(currentDate)}
        </h2>
        
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="p-2" />
          }

          const { calorieLog, weightLog, activityLog } = getLogsForDate(day)
          const isToday = day.toDateString() === new Date().toDateString()
          const hasLogs = calorieLog || weightLog || activityLog

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                p-2 text-sm rounded-md transition-colors relative
                ${isToday ? 'bg-blue-100 text-blue-900 font-semibold' : 'hover:bg-gray-100'}
                ${hasLogs ? 'ring-2 ring-green-500' : ''}
              `}
            >
              <span>{day.getDate()}</span>
              
              {/* Log indicators */}
              <div className="flex justify-center mt-1 space-x-1">
                {calorieLog && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" title="Calorie log"></div>
                )}
                {weightLog && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" title="Weight log"></div>
                )}
                {activityLog && (
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Activity log"></div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-4 text-xs text-gray-600">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
          <span>Calorie Log</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
          <span>Weight Log</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
          <span>Activity Log</span>
        </div>
      </div>
    </div>
  )
}
