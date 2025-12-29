#!/bin/bash

# CheatSheeter - Full Docker Start Script
# Starts all services (database, backend, frontend) in Docker containers

set -e

echo "🚀 Starting CheatSheeter (Full Docker Mode)..."
echo ""

# Check if Docker is running, wait if it's starting up
echo "🔍 Checking Docker status..."
MAX_WAIT=60
WAITED=0
while ! docker info > /dev/null 2>&1; do
    if [ $WAITED -eq 0 ]; then
        echo "⏳ Waiting for Docker to start..."
    fi

    if [ $WAITED -ge $MAX_WAIT ]; then
        echo "⚠️  Docker did not start within ${MAX_WAIT}s. Please start Docker Desktop manually."
        exit 1
    fi

    sleep 2
    WAITED=$((WAITED + 2))
done

if [ $WAITED -gt 0 ]; then
    echo "✅ Docker is ready after ${WAITED}s"
else
    echo "✅ Docker is running"
fi

# Stop any local dev servers that might be running
echo "🧹 Cleaning up any local dev servers..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Build and start all services in Docker
echo "🐳 Building and starting all services in Docker..."
echo "   (This may take a few minutes on first run)"
docker-compose up -d --build

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Wait for backend to be healthy
echo "   Waiting for backend..."
until curl -s http://localhost:3001/health > /dev/null 2>&1; do
    sleep 1
done

echo ""
echo "✅ All services started successfully!"
echo ""
echo "📍 Access the application:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:3001"
echo "   Health:    http://localhost:3001/health"
echo ""
echo "   LAN Access (Frontend): http://192.168.1.70:3000"
echo ""
echo "📋 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop all services:"
echo "   npm run stop:docker  or  ./stop-docker.sh"
