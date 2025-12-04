#!/usr/bin/env node
/**
 * Script to ensure database migrations are applied
 * Run this on startup to guarantee tables exist
 * This is the compiled JS version for Railway
 */

const { execSync } = require('child_process')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function ensureMigrations() {
  try {
    console.log('🔄 Checking database migrations...')
    
    // Check if we can connect
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Deploy migrations (idempotent - safe to run multiple times)
    console.log('🔄 Deploying migrations...')
    try {
      execSync('npx prisma migrate deploy', { 
        stdio: 'inherit',
        env: process.env 
      })
      console.log('✅ Migrations deployed')
    } catch (migrateError) {
      console.error('⚠️  Migration deploy failed:', migrateError.message)
      // Continue anyway - tables might already exist
    }
    
    // Verify tables exist
    try {
      await prisma.$queryRaw`SELECT 1 FROM users LIMIT 1`
      await prisma.$queryRaw`SELECT 1 FROM calorie_logs LIMIT 1`
      await prisma.$queryRaw`SELECT 1 FROM weight_logs LIMIT 1`
      await prisma.$queryRaw`SELECT 1 FROM activity_logs LIMIT 1`
      console.log('✅ All tables verified')
    } catch (tableError) {
      console.error('❌ Tables verification failed:', tableError.message)
      throw new Error('Database tables not found. Migrations may have failed.')
    }
    
    await prisma.$disconnect()
    console.log('✅ Database initialization complete')
  } catch (error) {
    console.error('❌ Failed to ensure migrations:', error.message)
    await prisma.$disconnect()
    // Don't exit with error - let the app start anyway
    // Railway will show the error in logs
    process.exit(0)
  }
}

ensureMigrations()

