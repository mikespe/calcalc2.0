import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// USDA API Configuration
const USDA_API_KEY = "ffm9P5caEuLE7aUT7l2OttpQ68hCEId9rS6TT08H" // Same as original PHP app
const SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/search"
const DETAIL_URL = "https://api.nal.usda.gov/fdc/v1"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const fdcId = searchParams.get('fdcId')

  if (!query && !fdcId) {
    return NextResponse.json(
      { error: 'Query parameter "q" or "fdcId" is required' },
      { status: 400 }
    )
  }

  try {
    if (fdcId) {
      // Get detailed nutrition information for a specific food
      const detailResponse = await fetch(
        `${DETAIL_URL}/${fdcId}?api_key=${USDA_API_KEY}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!detailResponse.ok) {
        throw new Error(`USDA API error: ${detailResponse.status}`)
      }

      const detailData = await detailResponse.json()
      return NextResponse.json(detailData)
    } else {
      // Search for foods
      const searchResponse = await fetch(
        `${SEARCH_URL}?api_key=${USDA_API_KEY}&generalSearchInput=${encodeURIComponent(query!)}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!searchResponse.ok) {
        throw new Error(`USDA API error: ${searchResponse.status}`)
      }

      const searchData = await searchResponse.json()
      return NextResponse.json(searchData)
    }
  } catch (error) {
    console.error('Error calling USDA API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch nutrition data' },
      { status: 500 }
    )
  }
}
