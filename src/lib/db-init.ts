import { prisma } from './prisma'

/**
 * Initialize database connection and ensure migrations are applied
 * This should be called on server startup
 */
export async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Verify tables exist by trying to query them
    try {
      await prisma.$queryRaw`SELECT 1 FROM users LIMIT 1`
      console.log('✅ Users table exists')
    } catch (error) {
      console.error('❌ Users table does not exist - migrations may not have run')
      throw new Error('Database tables not found. Please run migrations.')
    }
    
    // Check other tables
    try {
      await prisma.$queryRaw`SELECT 1 FROM calorie_logs LIMIT 1`
      await prisma.$queryRaw`SELECT 1 FROM weight_logs LIMIT 1`
      await prisma.$queryRaw`SELECT 1 FROM activity_logs LIMIT 1`
      console.log('✅ All tables exist')
    } catch (error) {
      console.error('❌ Some tables are missing')
      throw new Error('Database tables incomplete. Please run migrations.')
    }
    
    console.log('✅ Database initialization complete')
    return true
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    throw error
  }
}

/**
 * Health check - verify database is accessible
 */
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'healthy', connected: true }
  } catch (error) {
    return { 
      status: 'unhealthy', 
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

