#!/bin/bash

echo "🚀 CheatSheeter Setup Script"
echo ""

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "✓ Docker found"
    echo "📦 Starting PostgreSQL container..."
    docker-compose up -d

    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 5

    echo "✓ PostgreSQL is running"
    echo ""
else
    echo "⚠️  Docker not found. Please install PostgreSQL manually or install Docker."
    echo ""
    echo "To install PostgreSQL with Homebrew:"
    echo "  brew install postgresql@14"
    echo "  brew services start postgresql@14"
    echo ""
    exit 1
fi

# Install dependencies
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

echo "Installing scripts dependencies..."
cd scripts && npm install
cd ..

echo ""
echo "✓ Dependencies installed"
echo ""

# Run migration
echo "🔄 Running migration from index.html..."
npm run migrate

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development servers:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
echo ""
