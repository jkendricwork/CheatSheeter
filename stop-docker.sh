#!/bin/bash

# CheatSheeter - Full Docker Stop Script
# Stops all Docker services

echo "🛑 Stopping all Docker services..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "⚠️  Docker is not running. Services are already stopped."
    exit 0
fi

# Stop containers with a background timeout mechanism
(
    sleep 30
    if docker ps -q --filter "name=cheatsheeter-" 2>/dev/null | grep -q .; then
        echo "⚠️  Graceful shutdown taking too long, force stopping..."
        docker-compose kill 2>/dev/null
    fi
) &
TIMEOUT_PID=$!

# Try graceful shutdown
if docker-compose down 2>/dev/null; then
    kill $TIMEOUT_PID 2>/dev/null
    wait $TIMEOUT_PID 2>/dev/null
    echo "✅ All Docker services stopped gracefully!"
else
    echo "⚠️  Graceful shutdown failed, force stopping..."
    docker-compose kill 2>/dev/null
    docker-compose rm -f 2>/dev/null
    kill $TIMEOUT_PID 2>/dev/null
    wait $TIMEOUT_PID 2>/dev/null
    echo "✅ Containers force stopped"
fi

echo ""
echo "💡 To remove all data (including database):"
echo "   docker-compose down -v"
