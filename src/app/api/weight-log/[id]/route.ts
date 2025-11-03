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

    await prisma.weightLog.delete({
      where: { id, userId: user.id },
    })

    return NextResponse.json({ message: 'Weight log deleted successfully' })
  } catch (error) {
    console.error('Error deleting weight log:', error)
    return NextResponse.json(
      { error: 'Failed to delete weight log' },
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
    const { weight } = body

    if (!weight || typeof weight !== 'number') {
      return NextResponse.json(
        { error: 'Weight is required and must be a number' },
        { status: 400 }
      )
    }

    const log = await prisma.weightLog.update({
      where: { id, userId: user.id },
      data: { weight },
    })

    return NextResponse.json(log)
  } catch (error) {
    console.error('Error updating weight log:', error)
    return NextResponse.json(
      { error: 'Failed to update weight log' },
      { status: 500 }
    )
  }
}
