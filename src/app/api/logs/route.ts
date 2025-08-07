import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const [calorieLogs, weightLogs, activityLogs] = await Promise.all([
      prisma.calorieLog.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
      }),
      prisma.weightLog.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
      }),
      prisma.activityLog.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
      }),
    ])

    return NextResponse.json({
      calorieLogs,
      weightLogs,
      activityLogs,
    })
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    )
  }
}
