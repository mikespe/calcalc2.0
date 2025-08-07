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

    const logs = await prisma.activityLog.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
    })
    
    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching activity logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { activity, date } = body
    if (!activity || !date) {
      return NextResponse.json(
        { error: 'Activity and date are required' },
        { status: 400 }
      )
    }
    const log = await prisma.activityLog.create({
      data: {
        activity,
        date: new Date(date),
        userId: user.id,
      },
    })
    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    console.error('Error creating activity log:', error)
    return NextResponse.json(
      { error: 'Failed to create activity log' },
      { status: 500 }
    )
  }
}
