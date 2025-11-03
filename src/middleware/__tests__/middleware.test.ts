import { middleware } from '../../middleware'
import { NextRequest, NextResponse } from 'next/server'

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(() => ({ next: true })),
    redirect: jest.fn((url) => ({ redirect: true, url })),
  },
}))

describe('middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should skip middleware for API routes', () => {
    const request = new NextRequest('http://localhost/api/auth/login')
    const result = middleware(request)

    expect(result).toBeDefined()
  })

  it('should redirect to login if accessing protected route without auth', () => {
    const request = new NextRequest('http://localhost/calendar')
    const result = middleware(request)

    expect(NextResponse.redirect).toHaveBeenCalled()
  })

  it('should allow access to protected route with auth token', () => {
    const request = new NextRequest('http://localhost/calendar', {
      headers: {
        cookie: 'auth-token=valid-token',
      },
    })

    const result = middleware(request)

    expect(result).toBeDefined()
    expect(NextResponse.redirect).not.toHaveBeenCalled()
  })

  it('should redirect authenticated users away from auth routes', () => {
    const request = new NextRequest('http://localhost/login', {
      headers: {
        cookie: 'auth-token=valid-token',
      },
    })

    const result = middleware(request)

    expect(NextResponse.redirect).toHaveBeenCalled()
  })
})

