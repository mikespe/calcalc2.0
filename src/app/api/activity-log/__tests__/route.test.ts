import { GET, POST } from '../route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

jest.mock('@/lib/auth', () => ({
  getCurrentUser: jest.fn(),
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    activityLog: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

describe('/api/activity-log', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return 401 if user is not authenticated', async () => {
      ;(getCurrentUser as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost/api/activity-log')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return activity logs for authenticated user', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      const mockLogs = [{ id: '1', activity: 'Running', date: new Date(), userId: 'user-1' }]

      ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.activityLog.findMany as jest.Mock).mockResolvedValue(mockLogs)

      const request = new NextRequest('http://localhost/api/activity-log')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockLogs)
    })
  })

  describe('POST', () => {
    it('should return 401 if user is not authenticated', async () => {
      ;(getCurrentUser as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost/api/activity-log', {
        method: 'POST',
        body: JSON.stringify({ activity: 'Running', date: new Date().toISOString() }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 400 if activity or date is missing', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)

      const request = new NextRequest('http://localhost/api/activity-log', {
        method: 'POST',
        body: JSON.stringify({ activity: 'Running' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Activity and date are required')
    })

    it('should create activity log for authenticated user', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      const mockLog = {
        id: '1',
        activity: 'Running',
        date: new Date(),
        userId: 'user-1',
      }

      ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.activityLog.create as jest.Mock).mockResolvedValue(mockLog)

      const request = new NextRequest('http://localhost/api/activity-log', {
        method: 'POST',
        body: JSON.stringify({ activity: 'Running', date: new Date().toISOString() }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockLog)
    })
  })
})

