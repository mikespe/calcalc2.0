import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    await prisma.calorieLog.delete({
      where: { id, userId: user.id },
    })

    return NextResponse.json({ message: 'Calorie log deleted successfully' })
  } catch (error) {
    console.error('Error deleting calorie log:', error)
    return NextResponse.json(
      { error: 'Failed to delete calorie log' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { calories } = body

    if (!calories || typeof calories !== 'number') {
      return NextResponse.json(
        { error: 'Calories is required and must be a number' },
        { status: 400 }
      )
    }

    const log = await prisma.calorieLog.update({
      where: { id, userId: user.id },
      data: { calories },
    })

    return NextResponse.json(log)
  } catch (error) {
    console.error('Error updating calorie log:', error)
    return NextResponse.json(
      { error: 'Failed to update calorie log' },
      { status: 500 }
    )
  }
}
