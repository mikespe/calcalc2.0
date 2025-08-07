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

    const logs = await prisma.weightLog.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
    })
    
    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching weight logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weight logs' },
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
    const { weight, date } = body

    if (!weight || typeof weight !== 'number') {
      return NextResponse.json(
        { error: 'Weight is required and must be a number' },
        { status: 400 }
      )
    }

    const log = await prisma.weightLog.create({
      data: {
        weight,
        date: date ? new Date(date) : new Date(),
        userId: user.id,
      },
    })

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    console.error('Error creating weight log:', error)
    return NextResponse.json(
      { error: 'Failed to create weight log' },
      { status: 500 }
    )
  }
}
