#!/usr/bin/env node
/**
 * Run migrations with proper error handling
 * Exits with error code if migrations fail
 */

const { execSync } = require('child_process')

console.log('🔄 Running database migrations...')

try {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env
  })
  console.log('✅ Migrations applied successfully')
  process.exit(0)
} catch (error) {
  console.error('❌ Migration failed!')
  console.error('Error:', error.message)
  console.error('\nTroubleshooting:')
  console.error('1. Check DATABASE_URL is set correctly')
  console.error('2. Verify PostgreSQL service is running')
  console.error('3. Check Railway logs for detailed error messages')
  process.exit(1)
}

