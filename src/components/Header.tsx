'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/calorie-calculator', label: 'Calorie Calculator' },
    { href: '/calorie-log', label: 'Calorie Log' },
    { href: '/weight-log', label: 'Weight Log' },
    { href: '/nutrition-search', label: 'Nutrition Search' },
    { href: '/my-account', label: 'My Account' },
  ]

  return (
    <nav className="navbar">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="navbar-brand text-xl">
            Weight Loss App
          </Link>
          
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${
                  pathname === item.href ? 'text-blue-600' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden mt-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block nav-link ${
                pathname === item.href ? 'text-blue-600' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
