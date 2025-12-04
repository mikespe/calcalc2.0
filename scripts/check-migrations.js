#!/usr/bin/env node
/**
 * Check if migrations have been applied and tables exist
 * This helps diagnose migration issues
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkMigrations() {
  try {
    console.log('🔍 Checking database migrations...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Check if _prisma_migrations table exists (tracks migrations)
    try {
      const migrations = await prisma.$queryRaw`
        SELECT migration_name, applied_steps_count 
        FROM _prisma_migrations 
        ORDER BY finished_at DESC 
        LIMIT 5
      `
      console.log('📋 Applied migrations:')
      migrations.forEach(m => {
        console.log(`   - ${m.migration_name} (${m.applied_steps_count} steps)`)
      })
    } catch (error) {
      console.log('⚠️  _prisma_migrations table not found - no migrations have been applied')
    }
    
    // Check if tables exist
    const tables = ['users', 'calorie_logs', 'weight_logs', 'activity_logs']
    const existingTables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN (${tables.map(t => `'${t}'`).join(', ')})
    `
    
    console.log('\n📊 Table status:')
    tables.forEach(table => {
      const exists = existingTables.some(t => t.table_name === table)
      console.log(`   ${exists ? '✅' : '❌'} ${table}`)
    })
    
    const allExist = tables.every(table => 
      existingTables.some(t => t.table_name === table)
    )
    
    if (!allExist) {
      console.error('\n❌ Some tables are missing!')
      console.error('Run: npx prisma migrate deploy')
      process.exit(1)
    }
    
    console.log('\n✅ All tables exist!')
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Error checking migrations:', error.message)
    await prisma.$disconnect()
    process.exit(1)
  }
}

checkMigrations()

