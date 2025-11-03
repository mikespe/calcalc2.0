'use client'

import { useState } from 'react'

interface FormData {
  weight: string
  height: string
  age: string
  activity: string
  gender: string
  goal: string
}

interface FormErrors {
  weight: string
  height: string
  age: string
  activity: string
  gender: string
}

interface Results {
  show: boolean
  maintenance: number
  goal: number
}

export default function CalorieCalculator() {
  const [formData, setFormData] = useState<FormData>({
    weight: '',
    height: '',
    age: '',
    activity: '',
    gender: '',
    goal: 'maintain'
  })

  const [errors, setErrors] = useState<FormErrors>({
    weight: '',
    height: '',
    age: '',
    activity: '',
    gender: ''
  })

  const [results, setResults] = useState<Results>({
    show: false,
    maintenance: 0,
    goal: 0
  })

  const activityLevels = [
    { value: '1.2', label: 'Sedentary', description: 'Little or no exercise' },
    { value: '1.375', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
    { value: '1.55', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
    { value: '1.725', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
    { value: '1.9', label: 'Extra Active', description: 'Very hard exercise & physical job' }
  ]

  const calculateCalories = (weight: number, height: number, age: number, activity: number, gender: string): number => {
    let bmr: number
    if (gender.toLowerCase() === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }
    return Math.round(bmr * activity)
  }

  const getWeightGoalCalories = (maintenanceCalories: number, goal: string): number => {
    switch (goal) {
      case 'lose':
        return Math.round(maintenanceCalories * 0.8) // 20% deficit
      case 'gain':
        return Math.round(maintenanceCalories * 1.15) // 15% surplus
      default:
        return maintenanceCalories
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      weight: '',
      height: '',
      age: '',
      activity: '',
      gender: ''
    }

    if (!formData.weight) newErrors.weight = 'Weight is required!'
    if (!formData.height) newErrors.height = 'Height is required!'
    if (!formData.age) newErrors.age = 'Age is required!'
    if (!formData.activity) newErrors.activity = 'Activity level is required!'
    if (!formData.gender) newErrors.gender = 'Gender is required!'

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== '')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      const maintenance = calculateCalories(
        parseFloat(formData.weight),
        parseFloat(formData.height),
        parseInt(formData.age),
        parseFloat(formData.activity),
        formData.gender
      )
      
      const goal = getWeightGoalCalories(maintenance, formData.goal)
      
      setResults({
        show: true,
        maintenance,
        goal
      })
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getActivityDescription = (activityLevel: string): string => {
    const activity = activityLevels.find(a => a.value === activityLevel)
    return activity ? `${activity.label} (${activity.description})` : ''
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Calorie Calculator</h1>
          <p className="text-gray-600 mb-6">
            Calculate your daily calorie needs based on your body metrics and activity level.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.weight ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="50"
                  max="500"
                  step="0.1"
                />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                  Height (inches)
                </label>
                <input
                  type="number"
                  id="height"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.height ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="36"
                  max="96"
                  step="0.1"
                />
                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  Age (years)
                </label>
                <input
                  type="number"
                  id="age"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.age ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="18"
                  max="120"
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.gender ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>

              <div>
                <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Level
                </label>
                <select
                  id="activity"
                  value={formData.activity}
                  onChange={(e) => handleInputChange('activity', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.activity ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Activity Level</option>
                  {activityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {errors.activity && <p className="text-red-500 text-sm mt-1">{errors.activity}</p>}
                {formData.activity && (
                  <p className="text-sm text-gray-600 mt-1">
                    {getActivityDescription(formData.activity)}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight Goal</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="goal"
                    value="lose"
                    checked={formData.goal === 'lose'}
                    onChange={(e) => handleInputChange('goal', e.target.value)}
                    className="mr-2"
                  />
                  <span>Lose Weight (20% calorie deficit)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="goal"
                    value="maintain"
                    checked={formData.goal === 'maintain'}
                    onChange={(e) => handleInputChange('goal', e.target.value)}
                    className="mr-2"
                  />
                  <span>Maintain Weight</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="goal"
                    value="gain"
                    checked={formData.goal === 'gain'}
                    onChange={(e) => handleInputChange('goal', e.target.value)}
                    className="mr-2"
                  />
                  <span>Gain Weight (15% calorie surplus)</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Calculate Calories
            </button>
          </form>

          {results.show && (
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Maintenance Calories</h3>
                  <p className="text-3xl font-bold text-blue-600">{results.maintenance}</p>
                  <p className="text-sm text-gray-600">calories per day</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Goal Calories</h3>
                  <p className="text-3xl font-bold text-green-600">{results.goal}</p>
                  <p className="text-sm text-gray-600">calories per day</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
