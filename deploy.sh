#!/bin/bash

# 1. Force the script to execute using your modern Node v24 environment
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use v24.16.0

# 2. Pull the absolute freshest code from GitHub
echo "🔄 Fetching latest code from GitHub..."
git reset --hard
git checkout main   # Change to 'master' if your default branch is named master
git pull origin main

# ==========================================
# 🧱 BACKEND: NESTJS DEPLOYMENT (Using NPM)
# ==========================================
echo "📦 Setting up NestJS Backend..."
cd glowly-backend # 🚨 Change to your exact backend folder name

npm install --legacy-peer-deps
npm run build

# Clear old instance and start compiled backend cleanly
pm2 delete GLOWLY-BACKEND 2>/dev/null
pm2 start dist/main.js --name="GLOWLY-BACKEND" --interpreter=$(which node)

# ==========================================
# 🎨 FRONTEND: NEXT.JS DEPLOYMENT (Using PNPM)
# ==========================================
echo "🚀 Setting up Next.js Frontend..."
cd ../glowly-frontend # 🚨 Change to your exact frontend folder name

pnpm install --config.legacy-peer-deps=true
pnpm run build

# Clear old instance and start production server bundle cleanly
pm2 delete GLOWLY-FRONTEND 2>/dev/null
pm2 start "pnpm run start" --name="GLOWLY-FRONTEND" --interpreter=$(which node)

echo "✅ Glowly Application Ecosystem is fully live!"
pm2 ls