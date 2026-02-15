#!/bin/bash

echo "🔍 Checking Convex Auth Configuration..."
echo ""
echo "=========================================="
echo "1. Checking convex/auth.config.ts"
echo "=========================================="

if [ -f "convex/auth.config.ts" ]; then
    echo "✓ File exists"
    echo ""
    echo "Content:"
    cat convex/auth.config.ts
else
    echo "✗ FILE NOT FOUND!"
    echo "Expected location: convex/auth.config.ts"
fi

echo ""
echo "=========================================="
echo "2. Checking for old auth.config.js"
echo "=========================================="

if [ -f "convex/auth.config.js" ]; then
    echo "⚠️  OLD FILE FOUND! This might be causing conflicts."
    echo "Content:"
    cat convex/auth.config.js
else
    echo "✓ No conflicting .js file"
fi

echo ""
echo "=========================================="
echo "3. Checking convex.json"
echo "=========================================="

if [ -f "convex.json" ]; then
    echo "✓ File exists"
    echo ""
    echo "Content:"
    cat convex.json
else
    echo "✗ FILE NOT FOUND!"
    echo "Expected location: convex.json (in root directory)"
fi

echo ""
echo "=========================================="
echo "4. Checking .env.local"
echo "=========================================="

if [ -f ".env.local" ]; then
    echo "✓ File exists"
    echo ""
    echo "CONVEX_DEPLOYMENT:"
    grep CONVEX_DEPLOYMENT .env.local || echo "Not set"
    echo ""
    echo "NEXT_PUBLIC_CONVEX_URL:"
    grep NEXT_PUBLIC_CONVEX_URL .env.local || echo "Not set"
else
    echo "✗ FILE NOT FOUND!"
fi

echo ""
echo "=========================================="
echo "5. Listing all files in convex/"
echo "=========================================="
ls -la convex/ | grep -E "\.ts$|\.js$"

echo ""
echo "=========================================="
echo "6. Checking Clerk configuration"
echo "=========================================="

if [ -f ".env.local" ]; then
    echo "CLERK Keys:"
    grep CLERK .env.local | sed 's/=.*/=***HIDDEN***/'
else
    echo "✗ Cannot check - .env.local not found"
fi

echo ""
echo "=========================================="
echo "DIAGNOSIS"
echo "=========================================="
echo ""
echo "Common issues to check:"
echo "1. Make sure auth.config.ts exports 'default'"
echo "2. Make sure domain includes 'https://'"
echo "3. Make sure no auth.config.js file exists"
echo "4. Make sure convex.json has authInfo"
echo ""