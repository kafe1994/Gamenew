#!/bin/bash

# GitHub Actions Debug and Troubleshooting Script
# Helps diagnose and fix common GitHub Actions issues

echo "🔧 GitHub Actions Debug & Fix Tool"
echo "================================="

# Check if we're in a GitHub Actions environment
if [ -z "$GITHUB_ACTIONS" ]; then
    echo "⚠️ Not running in GitHub Actions environment"
    echo "This script is designed for GitHub Actions CI/CD"
else
    echo "✅ Running in GitHub Actions environment"
fi

echo ""
echo "🔍 System Information:"
echo "OS: $(uname -a)"
echo "Node.js: $(node --version 2>/dev/null || echo 'Not installed')"
echo "NPM: $(npm --version 2>/dev/null || echo 'Not installed')"
echo "Current directory: $(pwd)"
echo "User: $(whoami)"

echo ""
echo "📦 NPM Configuration:"
if command -v npm >/dev/null 2>&1; then
    echo "NPM config list:"
    npm config list || echo "❌ npm config list failed"
    echo ""
    echo "NPM cache location:"
    npm config get cache 2>/dev/null || echo "❌ npm config get cache failed"
    echo ""
    echo "NPM prefix:"
    npm config get prefix 2>/dev/null || echo "❌ npm config get prefix failed"
else
    echo "❌ NPM not found"
fi

echo ""
echo "📁 Project Structure Check:"
echo "Root files:"
ls -la | head -10

if [ -f "package.json" ]; then
    echo "✅ package.json found"
    echo "Package name: $(node -p "require('./package.json').name" 2>/dev/null || echo 'Unknown')"
    echo "Package version: $(node -p "require('./package.json').version" 2>/dev/null || echo 'Unknown')"
else
    echo "❌ package.json NOT found"
fi

if [ -f "package-lock.json" ]; then
    echo "✅ package-lock.json found"
else
    echo "❌ package-lock.json NOT found"
    echo "💡 Creating basic package-lock.json..."
fi

if [ -d "www" ]; then
    echo "✅ www directory found"
else
    echo "❌ www directory NOT found"
fi

if [ -f "config.xml" ]; then
    echo "✅ config.xml found"
else
    echo "❌ config.xml NOT found"
fi

if [ -d ".github/workflows" ]; then
    echo "✅ GitHub Actions workflows found"
    echo "Workflows:"
    ls -la .github/workflows/
else
    echo "❌ GitHub Actions workflows NOT found"
fi

echo ""
echo "🔧 Common Issues and Solutions:"

# Issue 1: npm config get cache
echo ""
echo "1. npm config get cache error:"
if command -v npm >/dev/null 2>&1; then
    if npm config get cache >/dev/null 2>&1; then
        echo "   ✅ npm cache config OK"
    else
        echo "   ❌ npm cache config FAILED"
        echo "   💡 Solution: Use 'npm ci || npm install' instead of 'npm ci'"
        echo "   💡 Solution: Add 'npm cache clean --force' before npm commands"
    fi
fi

# Issue 2: package-lock.json
echo ""
echo "2. package-lock.json missing:"
if [ ! -f "package-lock.json" ]; then
    echo "   ❌ package-lock.json missing"
    echo "   💡 Solution: Generate with 'npm install'"
    echo "   💡 Solution: Use workflow fallback 'npm ci || npm install'"
else
    echo "   ✅ package-lock.json exists"
fi

# Issue 3: Node modules
echo ""
echo "3. Dependencies installation:"
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules directory found"
    echo "   Installed packages: $(find node_modules -maxdepth 1 -type d | wc -l)"
else
    echo "   ❌ node_modules directory NOT found"
    echo "   💡 Solution: Run 'npm install' or 'npm ci'"
fi

echo ""
echo "🛠️ Automatic Fixes:"

# Fix 1: Clean npm cache
echo ""
echo "1. Cleaning npm cache..."
if command -v npm >/dev/null 2>&1; then
    npm cache clean --force 2>/dev/null && echo "   ✅ Cache cleaned" || echo "   ⚠️ Cache clean failed"
fi

# Fix 2: Verify/recreate package-lock.json
echo ""
echo "2. Checking package-lock.json..."
if [ ! -f "package-lock.json" ] && [ -f "package.json" ]; then
    echo "   Creating package-lock.json..."
    npm install --package-lock-only 2>/dev/null && echo "   ✅ package-lock.json created" || echo "   ⚠️ package-lock.json creation failed"
fi

# Fix 3: Check npm configuration
echo ""
echo "3. Verifying npm configuration..."
if command -v npm >/dev/null 2>&1; then
    echo "   Current npm config:"
    npm config list 2>/dev/null | head -5 || echo "   ❌ npm config list failed"
fi

echo ""
echo "📋 Summary of Actions Needed:"
echo "============================="

NEEDS_FIX=false

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ CRITICAL: package.json is missing"
    NEEDS_FIX=true
fi

# Check if package-lock.json exists
if [ ! -f "package-lock.json" ]; then
    echo "⚠️  WARNING: package-lock.json is missing"
    NEEDS_FIX=true
fi

# Check if npm works
if ! command -v npm >/dev/null 2>&1 || ! npm --version >/dev/null 2>&1; then
    echo "❌ CRITICAL: npm is not working properly"
    NEEDS_FIX=true
fi

# Check if project structure exists
if [ ! -d "www" ] || [ ! -f "config.xml" ]; then
    echo "⚠️  WARNING: Project structure incomplete"
    NEEDS_FIX=true
fi

if [ "$NEEDS_FIX" = false ]; then
    echo "✅ Project appears to be in good condition"
else
    echo "🛠️  Issues found that need attention"
fi

echo ""
echo "📝 Recommended GitHub Actions Workflow Changes:"
echo "=============================================="
echo ""
echo "1. Replace 'npm ci' with 'npm ci || npm install'"
echo "2. Add 'npm cache clean --force' before npm commands"
echo "3. Use 'npm config list' for debugging npm issues"
echo "4. Add 'continue-on-error: false' for critical build steps"
echo "5. Use safe file existence checks: '[ -f file ] && command file'"

echo ""
echo "🎯 Debug Complete!"
echo "Run this script in your GitHub Actions workflow to get detailed diagnostics."