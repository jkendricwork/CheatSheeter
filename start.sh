#!/bin/bash

# CheatSheeter - Start Script
# Starts the PostgreSQL database, backend server, and frontend client

set -e

echo "🚀 Starting CheatSheeter..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "⚠️  Docker is not running. Please start Docker first."
    exit 1
fi

# Start PostgreSQL in Docker
echo "📦 Starting PostgreSQL database..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 3

# Get the actual container name
CONTAINER_NAME=$(docker ps --format "{{.Names}}" | grep -i cheat | head -n 1)

# Check if database is accessible
until docker exec "$CONTAINER_NAME" pg_isready -U postgres > /dev/null 2>&1; do
    echo "   Database is not ready yet, waiting..."
    sleep 1
done
echo "✅ Database is ready!"
echo ""

# Start backend and frontend using concurrently
echo "🔧 Starting backend and frontend servers..."
npm run dev
