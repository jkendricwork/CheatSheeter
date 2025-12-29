#!/bin/bash

# CheatSheeter - Start Script
# Starts the backend server and frontend client as background processes

set -e

echo "🚀 Starting CheatSheeter..."
echo ""

# Add PostgreSQL to PATH if installed via Homebrew
if [ -f "/opt/homebrew/opt/postgresql@14/bin/psql" ]; then
    export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed."
    echo ""
    echo "Install PostgreSQL 14 with Homebrew:"
    echo "  brew install postgresql@14"
    echo "  brew services start postgresql@14"
    echo "  createdb cheatsheeter"
    echo "  psql -d cheatsheeter -f server/src/db/schema.sql"
    echo ""
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready > /dev/null 2>&1; then
    echo "📦 Starting PostgreSQL..."
    brew services start postgresql@14

    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 3

    # Wait for PostgreSQL to be ready
    until pg_isready > /dev/null 2>&1; do
        echo "   PostgreSQL is not ready yet, waiting..."
        sleep 1
    done
fi

echo "✅ PostgreSQL is ready!"
echo ""

# Check if database exists
if ! psql -lqt | cut -d \| -f 1 | grep -qw cheatsheeter; then
    echo "📝 Creating database 'cheatsheeter'..."
    createdb cheatsheeter
    echo "📋 Loading database schema..."
    psql -d cheatsheeter -f server/src/db/schema.sql
    echo "✅ Database initialized!"
    echo ""
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Kill any existing processes on the ports
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
sleep 1

# Start backend server in background
echo "🔧 Starting backend server..."
cd server
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../logs/backend.pid
cd ..

# Wait for backend to be ready
echo "⏳ Waiting for backend to start..."
sleep 3
until curl -s http://localhost:3001/health > /dev/null 2>&1; do
    sleep 1
done
echo "✅ Backend running (PID: $BACKEND_PID)"

# Start frontend server in background
echo "🎨 Starting frontend server..."
cd client
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../logs/frontend.pid
cd ..

# Wait for frontend to be ready
echo "⏳ Waiting for frontend to start..."
sleep 3
until curl -s http://localhost:5173 > /dev/null 2>&1; do
    sleep 1
done
echo "✅ Frontend running (PID: $FRONTEND_PID)"

echo ""
echo "✅ CheatSheeter is running!"
echo ""
echo "📍 Access the application:"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:3001"
echo "   Health:    http://localhost:3001/health"
echo ""
echo "   LAN Access: http://192.168.1.70:5173"
echo ""
echo "📋 View logs:"
echo "   Backend:  tail -f logs/backend.log"
echo "   Frontend: tail -f logs/frontend.log"
echo ""
echo "🛑 Stop servers:"
echo "   npm stop"
echo ""
echo "💡 Servers are running in the background."
echo "   You can close this terminal window safely."
echo ""
