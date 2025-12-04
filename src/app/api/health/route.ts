import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/db-init'

export async function GET() {
  const dbHealth = await checkDatabaseHealth()
  
  if (dbHealth.connected) {
    return NextResponse.json({
      status: 'ok',
      database: dbHealth,
      timestamp: new Date().toISOString()
    })
  } else {
    return NextResponse.json({
      status: 'error',
      database: dbHealth,
      timestamp: new Date().toISOString()
    }, { status: 503 })
  }
}

