#!/bin/bash

echo "🚀 CheatSheeter Setup Script"
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "⚠️  Homebrew not found. Please install Homebrew first."
    echo ""
    echo "Install Homebrew:"
    echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo ""
    exit 1
fi

echo "✓ Homebrew found"

# Add PostgreSQL to PATH if installed
if [ -f "/opt/homebrew/opt/postgresql@14/bin/psql" ]; then
    export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "📦 Installing PostgreSQL 14..."
    brew install postgresql@14
    
    echo "🚀 Starting PostgreSQL service..."
    brew services start postgresql@14
    
    sleep 3
    
    export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"
else
    echo "✓ PostgreSQL found"
    
    # Make sure it's running
    if ! pg_isready > /dev/null 2>&1; then
        echo "🚀 Starting PostgreSQL service..."
        brew services start postgresql@14
        sleep 3
    fi
fi

# Create database if it doesn't exist
if ! psql -lqt | cut -d \| -f 1 | grep -qw cheatsheeter; then
    echo "📝 Creating database 'cheatsheeter'..."
    createdb cheatsheeter
    
    echo "📋 Loading database schema..."
    psql -d cheatsheeter -f server/src/db/schema.sql
    
    echo "✅ Database created!"
else
    echo "✓ Database 'cheatsheeter' already exists"
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
echo "  npm start"
echo ""
echo "Access the application at:"
echo "  http://localhost:5173"
echo ""
