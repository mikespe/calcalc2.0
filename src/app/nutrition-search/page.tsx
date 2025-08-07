'use client'

import { useState, useEffect } from 'react'

interface FoodItem {
  fdcId: number
  description: string
  brandOwner?: string
  dataType?: string
}

interface NutritionFacts {
  fdcId: number
  description: string
  brandOwner?: string
  servingSize?: string
  servingSizeUnit?: string
  nutrients: {
    name: string
    amount: number | string
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
      const response = await fetch(`/api/nutrition-search?q=${encodeURIComponent(query)}`)
      
      if (!response.ok) {
        throw new Error('Failed to search for food')
      }

      const data = await response.json()
      
      if (!data.foods || data.foods.length === 0) {
        setSearchResults([])
        setError('No results found. Try a different search term.')
        return
      }

      // Limit results for better performance
      const foods = data.foods.slice(0, 15).map((food: any) => ({
        fdcId: food.fdcId,
        description: food.description || food.allHighlightFields || food.foodCode,
        brandOwner: food.brandOwner,
        dataType: food.dataType
      }))

      setSearchResults(foods)
      setError('')
      
      // Add to recent searches
      if (!recentSearches.includes(query)) {
        const newRecentSearches = [query, ...recentSearches.slice(0, 4)]
        setRecentSearches(newRecentSearches)
        localStorage.setItem('recentFoodSearches', JSON.stringify(newRecentSearches))
      }
    } catch (err) {
      setError('Failed to search for food. Please try again.')
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const getNutritionFacts = async (fdcId: number) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/nutrition-search?fdcId=${fdcId}`)
      
      if (!response.ok) {
        throw new Error('Failed to load nutrition facts')
      }

      const data = await response.json()
      const nutritionFacts = extractNutrients(data)
      setSelectedFood(nutritionFacts)
    } catch (err) {
      setError('Failed to load nutrition facts. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const extractNutrients = (data: any): NutritionFacts => {
    const nutrients: { name: string; amount: number | string; unit: string }[] = []
    
    // Check if we have label nutrients (Branded Foods)
    if (data.labelNutrients) {
      if (data.labelNutrients.calories?.value) {
        nutrients.push({ name: 'Calories', amount: data.labelNutrients.calories.value, unit: 'kcal' })
      }
      if (data.labelNutrients.protein?.value) {
        nutrients.push({ name: 'Protein', amount: data.labelNutrients.protein.value, unit: 'g' })
      }
      if (data.labelNutrients.fat?.value) {
        nutrients.push({ name: 'Total Fat', amount: data.labelNutrients.fat.value, unit: 'g' })
      }
      if (data.labelNutrients.carbohydrates?.value) {
        nutrients.push({ name: 'Carbohydrates', amount: data.labelNutrients.carbohydrates.value, unit: 'g' })
      }
      if (data.labelNutrients.fiber?.value) {
        nutrients.push({ name: 'Fiber', amount: data.labelNutrients.fiber.value, unit: 'g' })
      }
      if (data.labelNutrients.sugars?.value) {
        nutrients.push({ name: 'Sugar', amount: data.labelNutrients.sugars.value, unit: 'g' })
      }
      if (data.labelNutrients.sodium?.value) {
        nutrients.push({ name: 'Sodium', amount: data.labelNutrients.sodium.value, unit: 'mg' })
      }
    } 
    // Otherwise look in foodNutrients (Survey Foods, Foundation Foods, etc)
    else if (data.foodNutrients) {
      // Map nutrient IDs to their values
      const nutrientMap: { [key: number]: { name: string; unit: string } } = {
        1008: { name: 'Calories', unit: 'kcal' },      // Energy (kcal)
        1003: { name: 'Protein', unit: 'g' },          // Protein
        1004: { name: 'Total Fat', unit: 'g' },        // Total lipid (fat)
        1005: { name: 'Carbohydrates', unit: 'g' },    // Carbohydrate, by difference
        1079: { name: 'Fiber', unit: 'g' },            // Fiber, total dietary
        2000: { name: 'Sugar', unit: 'g' },            // Sugars, total
        1093: { name: 'Sodium', unit: 'mg' }           // Sodium, Na
      }
      
      data.foodNutrients.forEach((nutrient: any) => {
        const nutrientId = nutrient.nutrient?.id || nutrient.nutrientId
        const value = nutrient.amount || nutrient.value
        
        if (nutrientMap[nutrientId] && value !== null && value !== undefined) {
          nutrients.push({
            name: nutrientMap[nutrientId].name,
            amount: value,
            unit: nutrientMap[nutrientId].unit
          })
        }
      })
    }

    return {
      fdcId: data.fdcId,
      description: data.description || '',
      brandOwner: data.brandOwner,
      servingSize: data.servingSize,
      servingSizeUnit: data.servingSizeUnit,
      nutrients
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
                  className="w-full sm:w-auto bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search
                    </>
                  )}
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
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{food.description}</h3>
                        {food.brandOwner && (
                          <p className="text-sm text-gray-600">{food.brandOwner}</p>
                        )}
                      </div>
                      {food.dataType && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {food.dataType}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery && !isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No results found for "{searchQuery}"</p>
                <p className="text-sm text-gray-400 mt-2">Try searching for: apple, chicken, oatmeal, banana, salmon</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Search for a food to see results</p>
                <p className="text-sm text-gray-400 mt-2">Try: apple, chicken breast, oatmeal</p>
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
                  {selectedFood.brandOwner && (
                    <p className="text-sm text-gray-600">{selectedFood.brandOwner}</p>
                  )}
                  {selectedFood.servingSize && selectedFood.servingSizeUnit && (
                    <p className="text-sm text-gray-600 mt-1">
                      Serving size: {selectedFood.servingSize} {selectedFood.servingSizeUnit}
                    </p>
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
