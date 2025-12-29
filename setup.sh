#!/bin/bash

echo "🚀 CheatSheeter Setup Script"
echo ""

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker not found. Please install Docker Desktop."
    echo ""
    echo "Download Docker Desktop:"
    echo "  https://www.docker.com/products/docker-desktop"
    echo ""
    exit 1
fi

echo "✓ Docker found"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "⚠️  Docker is not running. Starting Docker Desktop..."
    open -a Docker
    echo "⏳ Waiting for Docker to start..."
    for i in {1..30}; do
        if docker info > /dev/null 2>&1; then
            echo "✓ Docker is ready"
            break
        fi
        sleep 2
    done
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
echo ""

echo "Installing root dependencies..."
npm install

echo "Installing server dependencies..."
cd server && npm install
cd ..

echo "Installing client dependencies..."
cd client && npm install
cd ..

echo ""
echo "✓ Dependencies installed"
echo ""

# Copy example env files if they don't exist
if [ ! -f client/.env ]; then
    echo "📝 Creating client/.env from example..."
    cp client/.env.example client/.env
fi

if [ ! -f server/.env ]; then
    echo "📝 Creating server/.env from example..."
    cp server/.env.example server/.env
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  npm start              (Local development mode - recommended)"
echo "  npm run start:docker   (Full Docker mode)"
echo ""
echo "Access the application at:"
echo "  http://localhost:5173  (Local mode)"
echo "  http://localhost:3000  (Docker mode)"
echo ""
