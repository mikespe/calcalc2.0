'use client'

import { useState, useEffect } from 'react'

interface FoodItem {
  fdcId: number
  description: string
  brandName?: string
  brandOwner?: string
}

interface NutritionFacts {
  fdcId: number
  description: string
  brandName?: string
  nutrients: {
    name: string
    amount: number
    unit: string
  }[]
}

export default function NutritionSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FoodItem[]>([])
  const [selectedFood, setSelectedFood] = useState<NutritionFacts | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentFoodSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const searchFood = async (query: string) => {
    if (!query.trim()) return

    setIsLoading(true)
    setError('')

    try {
      // For demo purposes, we'll use a mock API response
      // In a real app, you'd use the USDA API with an API key
      const mockResults: FoodItem[] = [
        {
          fdcId: 1,
          description: 'Apple, raw, with skin',
          brandName: 'Generic'
        },
        {
          fdcId: 2,
          description: 'Chicken breast, boneless, skinless, raw',
          brandName: 'Generic'
        },
        {
          fdcId: 3,
          description: 'Oatmeal, cooked, plain',
          brandName: 'Generic'
        },
        {
          fdcId: 4,
          description: 'Banana, raw',
          brandName: 'Generic'
        },
        {
          fdcId: 5,
          description: 'Salmon, Atlantic, farmed, raw',
          brandName: 'Generic'
        }
      ]

      // Filter results based on search query
      const filteredResults = mockResults.filter(food =>
        food.description.toLowerCase().includes(query.toLowerCase())
      )

      setSearchResults(filteredResults)
      
      // Add to recent searches
      if (!recentSearches.includes(query)) {
        const newRecentSearches = [query, ...recentSearches.slice(0, 4)]
        setRecentSearches(newRecentSearches)
        localStorage.setItem('recentFoodSearches', JSON.stringify(newRecentSearches))
      }
    } catch (err) {
      setError('Failed to search for food. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getNutritionFacts = async (fdcId: number) => {
    setIsLoading(true)
    setError('')

    try {
      // Mock nutrition facts data
      const mockNutritionFacts: NutritionFacts = {
        fdcId,
        description: searchResults.find(food => food.fdcId === fdcId)?.description || '',
        nutrients: [
          { name: 'Calories', amount: 95, unit: 'kcal' },
          { name: 'Protein', amount: 0.5, unit: 'g' },
          { name: 'Total Fat', amount: 0.3, unit: 'g' },
          { name: 'Carbohydrates', amount: 25, unit: 'g' },
          { name: 'Fiber', amount: 4.4, unit: 'g' },
          { name: 'Sugar', amount: 19, unit: 'g' },
          { name: 'Sodium', amount: 1, unit: 'mg' },
          { name: 'Potassium', amount: 195, unit: 'mg' },
          { name: 'Vitamin C', amount: 8.4, unit: 'mg' },
          { name: 'Calcium', amount: 6, unit: 'mg' },
          { name: 'Iron', amount: 0.2, unit: 'mg' }
        ]
      }

      setSelectedFood(mockNutritionFacts)
    } catch (err) {
      setError('Failed to load nutrition facts. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchFood(searchQuery)
  }

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query)
    searchFood(query)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Nutrition Search</h1>
          
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Example: apple, chicken breast, oatmeal..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  Enter a food to see its nutritional information
                </p>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </form>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearch(query)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search Results */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Results</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Searching...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map((food) => (
                  <button
                    key={food.fdcId}
                    onClick={() => getNutritionFacts(food.fdcId)}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{food.description}</h3>
                    {food.brandName && (
                      <p className="text-sm text-gray-600">{food.brandName}</p>
                    )}
                  </button>
                ))}
              </div>
            ) : searchQuery && !isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No results found for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Search for a food to see results</p>
              </div>
            )}
          </div>

          {/* Nutrition Facts */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nutrition Facts</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading nutrition facts...</span>
              </div>
            ) : selectedFood ? (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedFood.description}</h3>
                  {selectedFood.brandName && (
                    <p className="text-sm text-gray-600">{selectedFood.brandName}</p>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Nutrition Facts</h4>
                  <div className="space-y-2">
                    {selectedFood.nutrients.map((nutrient, index) => (
                      <div key={index} className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-700">{nutrient.name}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {nutrient.amount} {nutrient.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Select a food to view nutrition facts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
