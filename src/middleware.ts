import { NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/calendar',
  '/calorie-calculator',
  '/nutrition-search',
  '/my-account'
]

// Routes that should redirect to login if not authenticated
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  const token = request.cookies.get('auth-token')?.value

  // Simple token check without JWT verification in middleware
  // We'll do proper JWT verification in the API routes
  const isAuthenticated = !!token

  // If accessing protected route without auth, redirect to login
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If accessing auth routes while authenticated, redirect to calendar
  if (authRoutes.some(route => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/calendar', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
