import { GET, PUT } from '../route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

jest.mock('@/lib/auth', () => ({
  getCurrentUser: jest.fn(),
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      update: jest.fn(),
    },
  },
}))

describe('/api/user', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return 401 if user is not authenticated', async () => {
      ;(getCurrentUser as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost/api/user')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return user data if authenticated', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
      }

      ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)

      const request = new NextRequest('http://localhost/api/user')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockUser)
    })
  })

  describe('PUT', () => {
    it('should return 401 if user is not authenticated', async () => {
      ;(getCurrentUser as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost/api/user', {
        method: 'PUT',
        body: JSON.stringify({ name: 'New Name' }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should update user profile', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      const updatedUser = {
        ...mockUser,
        name: 'New Name',
        height: 70,
        weight: 150,
      }

      ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.user.update as jest.Mock).mockResolvedValue(updatedUser)

      const request = new NextRequest('http://localhost/api/user', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'New Name',
          height: 70,
          weight: 150,
        }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(updatedUser)
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: {
          name: 'New Name',
          height: 70,
          weight: 150,
        },
      })
    })
  })
})

