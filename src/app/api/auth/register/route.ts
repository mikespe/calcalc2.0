import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Verify database connection first
    try {
      await prisma.$queryRaw`SELECT 1`
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          hint: 'Please check Railway logs and ensure migrations have run'
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { name, email, password } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    // Log more details for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Log full error details
    console.error('Registration error details:', {
      message: errorMessage,
      stack: errorStack,
      error: error,
      errorName: error instanceof Error ? error.name : typeof error
    })
    
    // Check for specific Prisma errors
    if (errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
      return NextResponse.json(
        { 
          error: 'Database tables not found',
          hint: 'Migrations may not have run. Check Railway build logs.'
        },
        { status: 503 }
      )
    }
    
    // In development, return more details
    return NextResponse.json(
      { 
        error: 'Failed to create user',
        ...(process.env.NODE_ENV === 'development' && { 
          details: errorMessage,
          hint: 'Check Railway logs for full error details'
        })
      },
      { status: 500 }
    )
  }
}
