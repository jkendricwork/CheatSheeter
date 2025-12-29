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

- **Docker Desktop** (for running PostgreSQL database)
- **Node.js 18+** and npm
- Git

## Quick Start

### 1. Install Dependencies

```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 2. Start the Application

#### Local Development Mode (Recommended)
Runs PostgreSQL in Docker, frontend and backend on your local machine with hot reload:

```bash
npm start
```

This will:
1. Start PostgreSQL in Docker
2. Wait for database to be ready
3. Start backend server on port 3001
4. Start frontend dev server on port 5173

**Access at:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Health: http://localhost:3001/health

#### Full Docker Mode
Runs everything in Docker containers (all services containerized):

```bash
npm run start:docker
```

**Access at:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### 3. Stop the Application

```bash
# For local development mode
npm stop

# For full Docker mode
npm run stop:docker
```

## Auto-Start on Boot (macOS)

To automatically start CheatSheeter when your Mac boots:

```bash
./auto-start.sh enable
```

This will start the application in full Docker mode every time you log in.

**📖 See [AUTO_START.md](AUTO_START.md) for complete auto-start documentation.**

To disable auto-start:

```bash
./auto-start.sh disable
```

## LAN Access (Access from Other Devices)

To access CheatSheeter from other devices on your local network:

### Local Development Mode

1. Find your machine's IP address:
   ```bash
   # macOS/Linux
   ipconfig getifaddr en0
   # or use: ifconfig
   ```

2. Update `client/.env`:
   ```bash
   VITE_API_URL=http://YOUR_IP:3001
   # Example: VITE_API_URL=http://192.168.1.70:3001
   ```

3. Update `server/.env`:
   ```bash
   CORS_ORIGIN=http://localhost:5173,http://YOUR_IP:5173
   # Example: CORS_ORIGIN=http://localhost:5173,http://192.168.1.70:5173
   ```

4. Restart the application:
   ```bash
   npm stop
   npm start
   ```

5. Access from other devices at: `http://YOUR_IP:5173`

### Full Docker Mode

1. Update `docker-compose.yml` line 52:
   ```yaml
   VITE_API_URL: "http://YOUR_IP:3001"
   ```

2. Rebuild and restart:
   ```bash
   npm run stop:docker
   npm run start:docker
   ```

3. Access from other devices at: `http://YOUR_IP:3000`

## Available Commands

### Main Commands
- `npm start` - Start in local development mode (database in Docker, servers local)
- `npm stop` - Stop local development mode
- `npm run start:docker` - Start everything in Docker
- `npm run stop:docker` - Stop Docker mode

### Development Commands
- `npm run dev` - Start frontend and backend (assumes database is running)
- `npm run dev:client` - Start only the frontend
- `npm run dev:server` - Start only the backend
- `npm run dev:db` - Start only PostgreSQL in Docker

### Utility Commands
- `npm run docker:logs` - View Docker logs
- `npm run build` - Build both frontend and backend for production
- `./start.sh` - Direct shell script for local development mode
- `./stop.sh` - Direct shell script to stop local development mode
- `./start-docker.sh` - Direct shell script for full Docker mode
- `./stop-docker.sh` - Direct shell script to stop Docker mode

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

## Docker Details

### Container Names
- `cheatsheeter-postgres` - PostgreSQL database
- `cheatsheeter-backend` - Express API server
- `cheatsheeter-frontend` - Nginx serving React app

### Data Persistence
All database data is persisted in a Docker volume named `postgres_data`. Data survives container restarts unless you explicitly run:
```bash
docker-compose down -v  # WARNING: Deletes all data!
```

### Port Mappings
- **Local Development Mode**: Frontend on 5173, Backend on 3001, Database on 5432
- **Full Docker Mode**: Frontend on 3000, Backend on 3001, Database on 5432

## Troubleshooting

### Port Already in Use
If you get "port already in use" errors:
```bash
# Kill processes on specific ports
lsof -ti:3001 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
lsof -ti:5432 | xargs kill -9  # Database
```

### Docker Issues
```bash
# Check if Docker is running
docker info

# Start Docker Desktop on macOS
open -a Docker

# View container logs
docker-compose logs -f

# Clean up everything and start fresh
npm run stop:docker
docker-compose down -v
npm run start:docker
```

### Database Connection Errors
Make sure PostgreSQL is running:
```bash
docker ps | grep postgres
```

### Frontend Can't Connect to Backend
1. Check that backend is running: `curl http://localhost:3001/health`
2. Verify CORS configuration in `server/.env`
3. Check `client/.env` has correct `VITE_API_URL`
4. Restart servers after changing `.env` files

## License

MIT
