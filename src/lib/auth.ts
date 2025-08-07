import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface JWTPayload {
  userId: string
  email: string
}

export async function getCurrentUser(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        height: true,
        weight: true,
        age: true,
        gender: true,
        activityLevel: true,
        goal: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}
