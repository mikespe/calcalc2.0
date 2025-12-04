#!/usr/bin/env node
/**
 * Generate Prisma Client
 * Validates DATABASE_URL is set and properly formatted
 */

const { execSync } = require('child_process')

// Validate DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set')
  console.error('')
  console.error('For Railway deployment:')
  console.error('1. Ensure PostgreSQL service is added to your Railway project')
  console.error('2. Link PostgreSQL service to your web service')
  console.error('3. DATABASE_URL should be automatically set by Railway')
  console.error('')
  console.error('Check Railway dashboard → Your web service → Variables tab')
  process.exit(1)
}

// Validate DATABASE_URL format
const dbUrl = process.env.DATABASE_URL
if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
  console.error('❌ ERROR: DATABASE_URL must start with postgresql:// or postgres://')
  console.error(`Current value: ${dbUrl.substring(0, 20)}...`)
  console.error('')
  console.error('Please check your Railway DATABASE_URL configuration')
  process.exit(1)
}

try {
  console.log('🔄 Generating Prisma Client...')
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    env: process.env 
  })
  console.log('✅ Prisma Client generated successfully')
} catch (error) {
  console.error('❌ Failed to generate Prisma Client')
  process.exit(1)
}

