'use client'

import { useState, useEffect } from 'react'

interface CalorieEntry {
  id: string
  calories: number
  date: string
}

export default function CalorieLog() {
  const [calories, setCalories] = useState('')
  const [error, setError] = useState('')
  const [entries, setEntries] = useState<CalorieEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('calorieEntries')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('calorieEntries', JSON.stringify(entries))
  }, [entries])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!calories.trim()) {
      setError('Calories eaten is required!')
      return
    }

    const caloriesNum = parseInt(calories)
    if (isNaN(caloriesNum) || caloriesNum <= 0) {
      setError('Please enter a valid number of calories')
      return
    }

    const newEntry: CalorieEntry = {
      id: Date.now().toString(),
      calories: caloriesNum,
      date: new Date().toISOString()
    }

    setEntries(prev => [newEntry, ...prev])
    setCalories('')
    setError('')
  }

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0)
  const averageCalories = entries.length > 0 ? Math.round(totalCalories / entries.length) : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Calorie Log</h1>
          
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-2">
                  Calories Consumed
                </label>
                <input
                  type="number"
                  id="calories"
                  value={calories}
                  onChange={(e) => {
                    setCalories(e.target.value)
                    if (error) setError('')
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter calories"
                  min="1"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Log Calories
                </button>
              </div>
            </div>
          </form>

          {/* Summary Stats */}
          {entries.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-600">Total Entries</h3>
                <p className="text-2xl font-bold text-blue-900">{entries.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-600">Total Calories</h3>
                <p className="text-2xl font-bold text-green-900">{totalCalories.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-600">Average Daily</h3>
                <p className="text-2xl font-bold text-purple-900">{averageCalories.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Entries List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Calorie History</h2>
          
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No calorie entries yet. Start logging your calories above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {entry.calories}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(entry.date)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete entry"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
