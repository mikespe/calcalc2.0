#!/usr/bin/env node
/**
 * Script to ensure database migrations are applied
 * Run this on startup to guarantee tables exist
 */

import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function ensureMigrations() {
  try {
    console.log('🔄 Checking database migrations...')
    
    // Check if we can connect
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Try to check migration status
    try {
      execSync('npx prisma migrate status', { 
        stdio: 'inherit',
        env: process.env 
      })
    } catch (error) {
      console.log('⚠️  Migration status check failed, attempting to deploy migrations...')
    }
    
    // Deploy migrations (idempotent - safe to run multiple times)
    console.log('🔄 Deploying migrations...')
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit',
      env: process.env 
    })
    console.log('✅ Migrations deployed')
    
    // Verify tables exist
    await prisma.$queryRaw`SELECT 1 FROM users LIMIT 1`
    await prisma.$queryRaw`SELECT 1 FROM calorie_logs LIMIT 1`
    await prisma.$queryRaw`SELECT 1 FROM weight_logs LIMIT 1`
    await prisma.$queryRaw`SELECT 1 FROM activity_logs LIMIT 1`
    console.log('✅ All tables verified')
    
    await prisma.$disconnect()
    console.log('✅ Database initialization complete')
  } catch (error) {
    console.error('❌ Failed to ensure migrations:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

ensureMigrations()

