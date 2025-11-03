import { DELETE, PUT } from '../route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

jest.mock('@/lib/auth', () => ({
  getCurrentUser: jest.fn(),
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    calorieLog: {
      delete: jest.fn(),
      update: jest.fn(),
    },
  },
}))

describe('/api/calorie-log/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('DELETE', () => {
    it('should return 401 if user is not authenticated', async () => {
      ;(getCurrentUser as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost/api/calorie-log/123')
      const response = await DELETE(request, { params: { id: '123' } })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should delete calorie log for authenticated user', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.calorieLog.delete as jest.Mock).mockResolvedValue({})

      const request = new NextRequest('http://localhost/api/calorie-log/123')
      const response = await DELETE(request, { params: { id: '123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Calorie log deleted successfully')
      expect(prisma.calorieLog.delete).toHaveBeenCalledWith({
        where: { id: '123', userId: 'user-1' },
      })
    })
  })

  describe('PUT', () => {
    it('should return 401 if user is not authenticated', async () => {
      ;(getCurrentUser as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost/api/calorie-log/123', {
        method: 'PUT',
        body: JSON.stringify({ calories: 500 }),
      })

      const response = await PUT(request, { params: { id: '123' } })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 400 if calories is missing or invalid', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)

      const request = new NextRequest('http://localhost/api/calorie-log/123', {
        method: 'PUT',
        body: JSON.stringify({ calories: 'invalid' }),
      })

      const response = await PUT(request, { params: { id: '123' } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Calories is required and must be a number')
    })

    it('should update calorie log for authenticated user', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      const mockLog = {
        id: '123',
        calories: 600,
        date: new Date(),
        userId: 'user-1',
      }

      ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.calorieLog.update as jest.Mock).mockResolvedValue(mockLog)

      const request = new NextRequest('http://localhost/api/calorie-log/123', {
        method: 'PUT',
        body: JSON.stringify({ calories: 600 }),
      })

      const response = await PUT(request, { params: { id: '123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockLog)
      expect(prisma.calorieLog.update).toHaveBeenCalledWith({
        where: { id: '123', userId: 'user-1' },
        data: { calories: 600 },
      })
    })
  })
})

