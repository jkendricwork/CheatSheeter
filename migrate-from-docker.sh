#!/bin/bash

# CheatSheeter - Migrate from Docker to Local PostgreSQL
# Exports data from Docker PostgreSQL and imports to local PostgreSQL

set -e

echo "🔄 Migrating CheatSheeter data from Docker to Local PostgreSQL"
echo ""

# Add PostgreSQL to PATH if installed via Homebrew
if [ -f "/opt/homebrew/opt/postgresql@14/bin/psql" ]; then
    export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "⚠️  Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✓ Docker is running"

# Check if local PostgreSQL is running
if ! pg_isready > /dev/null 2>&1; then
    echo "⚠️  Local PostgreSQL is not running."
    echo "Start it with: brew services start postgresql@14"
    exit 1
fi

echo "✓ Local PostgreSQL is running"
echo ""

# Check which Docker volume to use
if docker volume ls | grep -q "cheatsheeter_postgres_data"; then
    VOLUME_NAME="cheatsheeter_postgres_data"
    echo "Found Docker volume: $VOLUME_NAME"
elif docker volume ls | grep -q "cheatsheeter2_postgres_data"; then
    VOLUME_NAME="cheatsheeter2_postgres_data"
    echo "Found Docker volume: $VOLUME_NAME"
else
    echo "⚠️  No CheatSheeter Docker volume found."
    echo "Available volumes:"
    docker volume ls
    exit 1
fi

echo ""
echo "📦 Starting temporary Docker postgres container to export data..."

# Start a temporary postgres container with the old volume
docker run --rm -d \
    --name cheatsheeter-migration \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=cheatsheeter \
    -v ${VOLUME_NAME}:/var/lib/postgresql/data \
    -p 5433:5432 \
    postgres:14-alpine

echo "⏳ Waiting for Docker PostgreSQL to be ready..."
sleep 5

until docker exec cheatsheeter-migration pg_isready -U postgres > /dev/null 2>&1; do
    echo "   Waiting..."
    sleep 1
done

echo "✅ Docker PostgreSQL is ready"
echo ""

# Export data from Docker PostgreSQL
echo "📤 Exporting data from Docker PostgreSQL..."
docker exec cheatsheeter-migration pg_dump -U postgres cheatsheeter > /tmp/cheatsheeter_backup.sql

echo "✅ Data exported to /tmp/cheatsheeter_backup.sql"
echo ""

# Stop the temporary container
echo "🛑 Stopping temporary Docker container..."
docker stop cheatsheeter-migration

echo ""

# Check if local database exists and has data
if psql -lqt | cut -d \| -f 1 | grep -qw cheatsheeter; then
    echo "⚠️  Local database 'cheatsheeter' already exists."
    echo ""
    read -p "Do you want to REPLACE it with Docker data? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Migration cancelled."
        rm /tmp/cheatsheeter_backup.sql
        exit 0
    fi

    echo ""
    echo "📋 Dropping existing local database..."
    dropdb cheatsheeter
fi

# Create fresh database
echo "📝 Creating fresh local database..."
createdb cheatsheeter

# Import data to local PostgreSQL
echo "📥 Importing data to local PostgreSQL..."
psql -d cheatsheeter < /tmp/cheatsheeter_backup.sql

# Clean up
rm /tmp/cheatsheeter_backup.sql

echo ""
echo "✅ Migration complete!"
echo ""
echo "📊 Checking imported data..."
echo ""

# Show count of data in each table
echo "Sections: $(psql -d cheatsheeter -t -c 'SELECT COUNT(*) FROM sections;' | xargs)"
echo "Subsections: $(psql -d cheatsheeter -t -c 'SELECT COUNT(*) FROM subsections;' | xargs)"
echo "Code blocks: $(psql -d cheatsheeter -t -c 'SELECT COUNT(*) FROM code_blocks;' | xargs)"

echo ""
echo "🎉 Your data has been successfully migrated from Docker to local PostgreSQL!"
echo ""
echo "You can now:"
echo "  1. Start the app: npm start"
echo "  2. Stop Docker if you want: Docker Desktop > Quit"
echo "  3. Delete Docker volumes to save space (optional):"
echo "     docker volume rm $VOLUME_NAME"
echo ""
