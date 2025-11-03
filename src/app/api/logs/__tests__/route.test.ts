import { GET } from '../route'
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
    },
    weightLog: {
      findMany: jest.fn(),
    },
    activityLog: {
      findMany: jest.fn(),
    },
  },
}))

describe('/api/logs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 if user is not authenticated', async () => {
    ;(getCurrentUser as jest.Mock).mockResolvedValue(null)

    const request = new NextRequest('http://localhost/api/logs')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return all logs for authenticated user', async () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' }
    const mockCalorieLogs = [{ id: '1', calories: 500, date: new Date(), userId: 'user-1' }]
    const mockWeightLogs = [{ id: '2', weight: 150, date: new Date(), userId: 'user-1' }]
    const mockActivityLogs = [{ id: '3', activity: 'Running', date: new Date(), userId: 'user-1' }]

    ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)
    ;(prisma.calorieLog.findMany as jest.Mock).mockResolvedValue(mockCalorieLogs)
    ;(prisma.weightLog.findMany as jest.Mock).mockResolvedValue(mockWeightLogs)
    ;(prisma.activityLog.findMany as jest.Mock).mockResolvedValue(mockActivityLogs)

    const request = new NextRequest('http://localhost/api/logs')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.calorieLogs).toEqual(mockCalorieLogs)
    expect(data.weightLogs).toEqual(mockWeightLogs)
    expect(data.activityLogs).toEqual(mockActivityLogs)
  })
})

