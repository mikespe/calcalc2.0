import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { getCurrentUser } from '../auth'
import { prisma } from '../prisma'

// Mock Prisma
jest.mock('../prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}))

describe('getCurrentUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return null if no token is provided', async () => {
    const request = {
      cookies: {
        get: jest.fn().mockReturnValue(undefined),
      },
    } as unknown as NextRequest

    const result = await getCurrentUser(request)
    expect(result).toBeNull()
  })

  it('should return null if token is invalid', async () => {
    const request = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: 'invalid-token' }),
      },
    } as unknown as NextRequest

    ;(jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token')
    })

    const result = await getCurrentUser(request)
    expect(result).toBeNull()
  })

  it('should return user if token is valid', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      height: null,
      weight: null,
      age: null,
      gender: null,
      activityLevel: null,
      goal: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const request = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: 'valid-token' }),
      },
    } as unknown as NextRequest

    ;(jwt.verify as jest.Mock).mockReturnValue({
      userId: 'user-1',
      email: 'test@example.com',
    })

    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

    const result = await getCurrentUser(request)
    expect(result).toEqual(mockUser)
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      select: {
        id: true,
        email: true,
        name: true,
        height: true,
        weight: true,
        age: true,
        gender: true,
        activityLevel: true,
        goal: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  })

  it('should return null if user is not found', async () => {
    const request = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: 'valid-token' }),
      },
    } as unknown as NextRequest

    ;(jwt.verify as jest.Mock).mockReturnValue({
      userId: 'user-1',
      email: 'test@example.com',
    })

    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    const result = await getCurrentUser(request)
    expect(result).toBeNull()
  })
})

