import { GET, POST } from '../route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

jest.mock('@/lib/auth', () => ({
  getCurrentUser: jest.fn(),
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    weightLog: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}))

describe('/api/weight-log', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return 401 if user is not authenticated', async () => {
      ;(getCurrentUser as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost/api/weight-log')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return weight logs for authenticated user', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      const mockLogs = [{ id: '1', weight: 150, date: new Date(), userId: 'user-1' }]

      ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.weightLog.findMany as jest.Mock).mockResolvedValue(mockLogs)

      const request = new NextRequest('http://localhost/api/weight-log')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockLogs)
    })
  })

  describe('POST', () => {
    it('should return 401 if user is not authenticated', async () => {
      ;(getCurrentUser as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost/api/weight-log', {
        method: 'POST',
        body: JSON.stringify({ weight: 150 }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 400 if weight is missing or invalid', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)

      const request = new NextRequest('http://localhost/api/weight-log', {
        method: 'POST',
        body: JSON.stringify({ weight: 'invalid' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Weight is required and must be a number')
    })

    it('should create new weight log if none exists for date', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      const mockLog = {
        id: '1',
        weight: 150,
        date: new Date(),
        userId: 'user-1',
      }

      ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.weightLog.findFirst as jest.Mock).mockResolvedValue(null)
      ;(prisma.weightLog.create as jest.Mock).mockResolvedValue(mockLog)

      const request = new NextRequest('http://localhost/api/weight-log', {
        method: 'POST',
        body: JSON.stringify({ weight: 150 }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockLog)
    })

    it('should update existing weight log if one exists for date', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      const existingLog = { id: '1', weight: 145, date: new Date(), userId: 'user-1' }
      const updatedLog = { ...existingLog, weight: 150 }

      ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.weightLog.findFirst as jest.Mock).mockResolvedValue(existingLog)
      ;(prisma.weightLog.update as jest.Mock).mockResolvedValue(updatedLog)

      const request = new NextRequest('http://localhost/api/weight-log', {
        method: 'POST',
        body: JSON.stringify({ weight: 150, date: new Date().toISOString() }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(updatedLog)
      expect(prisma.weightLog.update).toHaveBeenCalled()
    })
  })
})

