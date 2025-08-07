'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/calorie-calculator', label: 'Calorie Calculator' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/nutrition-search', label: 'Nutrition Search' },
    { href: '/my-account', label: 'My Account' },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            CalCalc
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {!isLoading && (
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700">
                      Welcome, {user.name || user.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden py-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname === item.href 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
          
          {!isLoading && (
            <div className="pt-2 border-t border-gray-200">
              {user ? (
                <div className="px-3 py-2">
                  <div className="text-sm text-gray-700 mb-2">
                    Welcome, {user.name || user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
