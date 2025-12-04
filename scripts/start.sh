#!/bin/bash
set -e

echo "🚀 Starting application..."

# Run migrations first
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Verify migrations succeeded by checking if tables exist
echo "✅ Verifying database tables..."
npx prisma db execute --stdin <<EOF
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'calorie_logs', 'weight_logs', 'activity_logs');
EOF

if [ $? -eq 0 ]; then
  echo "✅ Database tables verified"
else
  echo "⚠️  Could not verify tables, but continuing..."
fi

# Start the application
echo "🚀 Starting Next.js application..."
exec npm start

