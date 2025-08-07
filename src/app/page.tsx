'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-4xl font-bold text-gray-900 mb-2">
            Welcome to CalCalc
          </h1>
          <p className="text-center text-lg text-gray-600 mb-8">
            Your personal calorie and fitness tracking companion
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-4">
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {user.name || user.email}!
            </h1>
            <p className="text-lg text-gray-600">
              Track your calories, weight, and activities to reach your fitness goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/calendar"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="text-3xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Calendar View</h3>
                <p className="text-gray-600">Log your daily calories, weight, and activities</p>
              </div>
            </Link>

            <Link
              href="/calorie-calculator"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="text-3xl mb-4">🧮</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Calorie Calculator</h3>
                <p className="text-gray-600">Calculate your daily calorie needs</p>
              </div>
            </Link>

            <Link
              href="/nutrition-search"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="text-3xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nutrition Search</h3>
                <p className="text-gray-600">Find nutrition information for foods</p>
              </div>
            </Link>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/my-account"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Manage Account Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
