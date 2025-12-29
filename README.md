# CheatSheeter - Dynamic Cheat Sheet Web Application

A full-stack web application for creating, editing, and managing custom cheat sheets with a clean, half-screen optimized interface.

## Tech Stack

### Frontend
- **Vite + React + TypeScript**: Fast development server with hot module replacement
- **TailwindCSS**: Utility-first CSS framework
- **React Router v6**: Client-side routing
- **React Query (@tanstack/react-query)**: Server state management
- **Zustand**: Lightweight UI state management
- **react-syntax-highlighter**: Code syntax highlighting
- **react-hot-toast**: Notifications

### Backend
- **Node.js + Express + TypeScript**: RESTful API server
- **PostgreSQL**: Relational database with full-text search
- **express-validator**: Request validation
- **pg**: PostgreSQL driver

## Prerequisites

- **Homebrew** (for macOS)
- **Node.js 18+** and npm
- **PostgreSQL 14** (automatically installed via setup script)

## Quick Start

### First Time Setup

Run the automated setup script:

```bash
./setup.sh
```

This will:
1. Install PostgreSQL 14 via Homebrew (if not installed)
2. Start PostgreSQL service
3. Create the `cheatsheeter` database
4. Load the database schema
5. Install all npm dependencies
6. Create `.env` files from examples

### Start the Application

```bash
npm start
```

This will:
1. Ensure PostgreSQL is running
2. Start backend server on port 3001
3. Start frontend dev server on port 5173

**Access at:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Health: http://localhost:3001/health

### Stop the Application

```bash
npm stop
```

This will stop the frontend and backend servers. PostgreSQL will continue running in the background.

To stop PostgreSQL:
```bash
brew services stop postgresql@14
```

## Manual Setup

If you prefer to set up manually:

### 1. Install PostgreSQL

```bash
brew install postgresql@14
brew services start postgresql@14
```

### 2. Create Database

```bash
createdb cheatsheeter
psql -d cheatsheeter -f server/src/db/schema.sql
```

### 3. Install Dependencies

```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 4. Configure Environment

Create `server/.env`:
```bash
PORT=3001
DATABASE_URL=postgresql://localhost:5432/cheatsheeter
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Create `client/.env`:
```bash
VITE_API_URL=http://localhost:3001
```

### 5. Start the Application

```bash
npm start
```

## LAN Access (Access from Other Devices)

To access CheatSheeter from other devices on your local network:

### 1. Find your machine's IP address

```bash
# macOS/Linux
ipconfig getifaddr en0
# or use: ifconfig
```

### 2. Update Environment Files

**Update `client/.env`:**
```bash
VITE_API_URL=http://YOUR_IP:3001
# Example: VITE_API_URL=http://192.168.1.70:3001
```

**Update `server/.env`:**
```bash
CORS_ORIGIN=http://localhost:5173,http://YOUR_IP:5173
# Example: CORS_ORIGIN=http://localhost:5173,http://192.168.1.70:5173
```

### 3. Restart the Application

```bash
npm stop
npm start
```

### 4. Access from Other Devices

Open `http://YOUR_IP:5173` on any device on your LAN.

## Available Commands

### Main Commands
- `npm start` - Start the application
- `npm stop` - Stop the application
- `./setup.sh` - First-time setup

### Development Commands
- `npm run dev` - Start frontend and backend (assumes PostgreSQL is running)
- `npm run dev:client` - Start only the frontend
- `npm run dev:server` - Start only the backend

### Build Commands
- `npm run build` - Build both frontend and backend for production
- `npm run build:client` - Build only the frontend
- `npm run build:server` - Build only the backend

## Database Management

### Access Database

```bash
psql cheatsheeter
```

### Backup Database

```bash
pg_dump cheatsheeter > backup.sql
```

### Restore Database

```bash
psql cheatsheeter < backup.sql
```

### Reset Database

```bash
psql -d cheatsheeter -f server/src/db/schema.sql
```

## API Endpoints

### Sections
- `GET /api/sections` - Get all sections with nested subsections and code blocks
- `GET /api/sections/:id` - Get single section with nested data
- `POST /api/sections` - Create new section
- `PUT /api/sections/:id` - Update section
- `DELETE /api/sections/:id` - Delete section (cascades to subsections and code blocks)
- `PATCH /api/sections/reorder` - Batch update display order

### Subsections
- `GET /api/subsections/section/:sectionId` - Get subsections for a section
- `POST /api/subsections` - Create new subsection
- `PUT /api/subsections/:id` - Update subsection
- `DELETE /api/subsections/:id` - Delete subsection (cascades to code blocks)

### Code Blocks
- `GET /api/code-blocks/subsection/:subsectionId` - Get blocks for subsection
- `POST /api/code-blocks` - Create block in a subsection
- `PUT /api/code-blocks/:id` - Update block
- `DELETE /api/code-blocks/:id` - Delete block

### Search
- `GET /api/search?q=<query>` - Full-text search

## Database Schema

The application uses a 3-level hierarchy:

### sections
- Top-level cheat sheet sections
- Fields: title, description, category, display_order, style_variant, border_color, background_color
- Example: "GIT & GITHUB QUICK REFERENCE"

### subsections
- Organized topics within a section
- Fields: title, description, display_order, section_id
- Foreign key: section_id (CASCADE on delete)
- Example: "Initial Setup", "Create Repo", "Branching"

### code_blocks
- Individual code snippets within subsections
- Fields: content, language, display_order, is_clickable, subsection_id
- Foreign key: subsection_id (CASCADE on delete)
- Example: `git init`, `git clone <url>`

## Key Features

- **Dynamic Content Management**: Create, edit, and delete sections and code blocks
- **Half-Screen Layout**: Optimized for 50% screen width (960px) for side-by-side use with coding tools
- **Full-Text Search**: PostgreSQL-powered search across all content
- **Click-to-Copy**: One-click copy functionality with visual feedback
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Syntax Highlighting**: Code blocks with proper syntax highlighting
- **Navigation Menu**: Categorized sidebar for easy section navigation
- **LAN Access**: Access from any device on your local network

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:
```bash
# Kill processes on specific ports
lsof -ti:3001 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
```

### PostgreSQL Issues

```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL
brew services start postgresql@14

# Stop PostgreSQL
brew services stop postgresql@14

# Restart PostgreSQL
brew services restart postgresql@14

# View PostgreSQL logs
tail -f /opt/homebrew/var/log/postgresql@14.log
```

### Database Connection Errors

1. Check that PostgreSQL is running:
   ```bash
   pg_isready
   ```

2. Verify the database exists:
   ```bash
   psql -l | grep cheatsheeter
   ```

3. Check `server/.env` has correct DATABASE_URL:
   ```bash
   DATABASE_URL=postgresql://localhost:5432/cheatsheeter
   ```

### Frontend Can't Connect to Backend

1. Check that backend is running:
   ```bash
   curl http://localhost:3001/health
   ```

2. Verify CORS configuration in `server/.env`

3. Check `client/.env` has correct `VITE_API_URL`

4. Restart servers after changing `.env` files

### Missing PostgreSQL Command

If PostgreSQL commands aren't found, add to your PATH:

```bash
# Add to ~/.zshrc or ~/.bash_profile
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"
```

Then restart your terminal or run:
```bash
source ~/.zshrc  # or ~/.bash_profile
```

## License

MIT
