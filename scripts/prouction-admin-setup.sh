#!/bin/bash
# ✅ SECURE: Production admin setup script

echo "🔐 Production Admin Setup"
echo "========================"

# Check if running in production
if [ "$NODE_ENV" = "production" ]; then
    echo "❌ This script should not be run in production"
    echo "💡 Create admin users through secure database operations instead"
    exit 1
fi

# Check environment variables
if [ -z "$ADMIN_EMAIL" ] || [ -z "$ADMIN_PASSWORD" ] || [ -z "$ADMIN_CREATION_SECRET" ]; then
    echo "❌ Missing required environment variables:"
    echo "   - ADMIN_EMAIL"
    echo "   - ADMIN_PASSWORD" 
    echo "   - ADMIN_CREATION_SECRET"
    exit 1
fi

echo "✅ Environment variables configured"
echo "🔄 Running secure admin setup..."

node scripts/secure-admin-setup.js

echo "🎯 Admin setup complete!"
echo "📧 Login with: $ADMIN_EMAIL"
echo "🔑 Password: [Check your .env file]"
