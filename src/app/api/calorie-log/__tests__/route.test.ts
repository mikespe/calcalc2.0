import { GET, POST } from '../route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

jest.mock('@/lib/auth', () => ({
  getCurrentUser: jest.fn(),
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    calorieLog: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

describe('/api/calorie-log', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return 401 if user is not authenticated', async () => {
      ;(getCurrentUser as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost/api/calorie-log')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return calorie logs for authenticated user', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      const mockLogs = [
        { id: '1', calories: 500, date: new Date(), userId: 'user-1' },
        { id: '2', calories: 300, date: new Date(), userId: 'user-1' },
      ]

      ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.calorieLog.findMany as jest.Mock).mockResolvedValue(mockLogs)

      const request = new NextRequest('http://localhost/api/calorie-log')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockLogs)
      expect(prisma.calorieLog.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { date: 'desc' },
      })
    })
  })

  describe('POST', () => {
    it('should return 401 if user is not authenticated', async () => {
      ;(getCurrentUser as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost/api/calorie-log', {
        method: 'POST',
        body: JSON.stringify({ calories: 500 }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 400 if calories is missing or invalid', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)

      const request = new NextRequest('http://localhost/api/calorie-log', {
        method: 'POST',
        body: JSON.stringify({ calories: 'invalid' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Calories is required and must be a number')
    })

    it('should create calorie log for authenticated user', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      const mockLog = {
        id: '1',
        calories: 500,
        date: new Date(),
        userId: 'user-1',
      }

      ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.calorieLog.create as jest.Mock).mockResolvedValue(mockLog)

      const request = new NextRequest('http://localhost/api/calorie-log', {
        method: 'POST',
        body: JSON.stringify({ calories: 500 }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockLog)
      expect(prisma.calorieLog.create).toHaveBeenCalledWith({
        data: {
          calories: 500,
          date: expect.any(Date),
          userId: 'user-1',
        },
      })
    })
  })
})

