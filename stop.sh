#!/bin/bash

# CheatSheeter - Stop Script
# Stops all running CheatSheeter processes and the database

echo "🛑 Stopping CheatSheeter..."
echo ""

# Kill any Node processes running on ports 3001 (backend) and 5173/5174 (frontend)
echo "🔪 Killing backend server (port 3001)..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "   No process running on port 3001"

echo "🔪 Killing frontend server (ports 5173-5174)..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || echo "   No process running on port 5173"
lsof -ti:5174 | xargs kill -9 2>/dev/null || echo "   No process running on port 5174"

# Stop only the PostgreSQL container (keep network)
echo "🐳 Stopping PostgreSQL database..."
docker-compose stop database

echo ""
echo "✅ All CheatSheeter processes stopped!"
