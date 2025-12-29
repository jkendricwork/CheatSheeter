#!/bin/bash

# CheatSheeter - Stop Script
# Stops all running CheatSheeter processes

echo "🛑 Stopping CheatSheeter..."
echo ""

# Stop using PID files if they exist
if [ -f logs/backend.pid ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "🔪 Stopping backend server (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null || true
        rm logs/backend.pid
    fi
else
    echo "🔪 Stopping backend server (port 3001)..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "   No process running on port 3001"
fi

if [ -f logs/frontend.pid ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "🔪 Stopping frontend server (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null || true
        rm logs/frontend.pid
    fi
else
    echo "🔪 Stopping frontend server (ports 5173-5174)..."
    lsof -ti:5173 | xargs kill -9 2>/dev/null || echo "   No process running on port 5173"
    lsof -ti:5174 | xargs kill -9 2>/dev/null || true
fi

# Clean up any remaining Node processes on these ports
sleep 1
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

echo ""
echo "✅ All CheatSheeter processes stopped!"
echo ""
echo "💡 PostgreSQL is still running in the background."
echo "   To stop PostgreSQL:"
echo "   brew services stop postgresql@14"
echo ""
