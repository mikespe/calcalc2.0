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

    const logs = await prisma.calorieLog.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
    })
    
    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching calorie logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calorie logs' },
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
    const { calories, date } = body

    if (!calories || typeof calories !== 'number') {
      return NextResponse.json(
        { error: 'Calories is required and must be a number' },
        { status: 400 }
      )
    }

    const log = await prisma.calorieLog.create({
      data: {
        calories,
        date: date ? new Date(date) : new Date(),
        userId: user.id,
      },
    })

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    console.error('Error creating calorie log:', error)
    return NextResponse.json(
      { error: 'Failed to create calorie log' },
      { status: 500 }
    )
  }
}
