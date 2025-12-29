#!/bin/bash

# CheatSheeter - Status Script
# Check if CheatSheeter is running

echo "📊 CheatSheeter Status"
echo ""

# Check backend
if [ -f logs/backend.pid ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "✅ Backend:  Running (PID: $BACKEND_PID) - http://localhost:3001"
    else
        echo "❌ Backend:  Stopped (stale PID file)"
    fi
else
    if lsof -ti:3001 > /dev/null 2>&1; then
        echo "⚠️  Backend:  Running but no PID file"
    else
        echo "❌ Backend:  Stopped"
    fi
fi

# Check frontend
if [ -f logs/frontend.pid ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "✅ Frontend: Running (PID: $FRONTEND_PID) - http://localhost:5173"
    else
        echo "❌ Frontend: Stopped (stale PID file)"
    fi
else
    if lsof -ti:5173 > /dev/null 2>&1; then
        echo "⚠️  Frontend: Running but no PID file"
    else
        echo "❌ Frontend: Stopped"
    fi
fi

# Check PostgreSQL
if pg_isready > /dev/null 2>&1; then
    echo "✅ Database: Running"
else
    echo "❌ Database: Stopped"
fi

echo ""

# Show log files if they exist
if [ -d logs ]; then
    echo "📋 Recent logs:"
    if [ -f logs/backend.log ]; then
        echo "   Backend:  $(wc -l < logs/backend.log) lines"
    fi
    if [ -f logs/frontend.log ]; then
        echo "   Frontend: $(wc -l < logs/frontend.log) lines"
    fi
fi

echo ""
