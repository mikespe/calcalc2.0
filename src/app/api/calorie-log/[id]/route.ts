import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.calorieLog.delete({
      where: { id },
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
