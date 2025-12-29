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

# Start only PostgreSQL in Docker (not the full stack)
echo "📦 Starting PostgreSQL database..."
docker-compose up -d database

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 3

# Check if database is accessible (using the known container name)
until docker exec cheatsheeter-postgres pg_isready -U postgres > /dev/null 2>&1; do
    echo "   Database is not ready yet, waiting..."
    sleep 1
done
echo "✅ Database is ready!"
echo ""

# Start backend and frontend using concurrently
echo "🔧 Starting backend and frontend servers..."
npm run dev
