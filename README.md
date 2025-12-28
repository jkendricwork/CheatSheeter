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
- **cors**: Cross-origin resource sharing
- **helmet**: Security headers

## Project Structure

```
CheatSheeter/
├── client/                 # React frontend
├── server/                 # Express backend
├── scripts/                # Migration and utility scripts
├── index.html             # Original static HTML (for reference)
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (recommended for database)
- Git

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies (root, server, client, scripts)
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
cd scripts && npm install && cd ..
```

### 2. Start Database with Docker

```bash
# Start PostgreSQL in Docker (recommended)
npm run dev:db

# The database schema will be automatically created
```

### 3. Configure Environment Variables

Create `server/.env`:

```bash
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/cheatsheeter
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 4. Migrate Initial Data

```bash
# Import data from the original index.html
npm run migrate
```

### 5. Start the Application

```bash
# Start everything (database + backend + frontend)
npm start

# This will:
# 1. Start PostgreSQL in Docker
# 2. Wait for database to be ready
# 3. Start backend server on port 3001
# 4. Start frontend dev server on port 5173
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Health Check: http://localhost:3001/health

### 6. Stop the Application

```bash
# Stop all servers and database
npm stop

# This will:
# 1. Kill backend server process
# 2. Kill frontend dev server process
# 3. Stop PostgreSQL Docker container
```

### Alternative: Manual Database Setup

If you prefer to install PostgreSQL locally instead of using Docker:

```bash
# Create PostgreSQL database
createdb cheatsheeter

# Run database schema
psql -d cheatsheeter -f server/src/db/schema.sql

# Update server/.env with your local connection
DATABASE_URL=postgresql://localhost:5432/cheatsheeter
```

## Available Scripts

From the root directory:

**Main Commands:**
- `npm start` - Start everything (database + backend + frontend)
- `npm stop` - Stop all servers and database
- `npm run migrate` - Import data from index.html into the database

**Development Commands:**
- `npm run dev` - Start frontend and backend (assumes database is running)
- `npm run dev:all` - Start database + frontend + backend
- `npm run dev:client` - Start only the frontend
- `npm run dev:server` - Start only the backend
- `npm run dev:db` - Start only PostgreSQL in Docker

**Build Commands:**
- `npm run build` - Build both frontend and backend for production
- `npm run build:client` - Build only the frontend
- `npm run build:server` - Build only the backend

**Utility Commands:**
- `npm run stop:db` - Stop only the Docker database
- `./start.sh` - Direct shell script to start everything
- `./stop.sh` - Direct shell script to stop everything

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

## Development Status

### ✅ Completed
- [x] Monorepo structure
- [x] Express + TypeScript backend
- [x] PostgreSQL database schema with 3-level hierarchy (sections → subsections → code blocks)
- [x] Backend API endpoints (CRUD for sections, subsections, and code blocks)
- [x] Search functionality (backend)
- [x] HTML migration script
- [x] Docker Compose setup for PostgreSQL
- [x] Vite + React + TypeScript frontend setup
- [x] TailwindCSS configuration
- [x] React components (layout, sections, code blocks)
- [x] Frontend API client
- [x] State management (Zustand + React Query)
- [x] Click-to-copy functionality with visual feedback
- [x] Edit mode with CRUD forms
- [x] Full-width responsive layout with multi-column subsections
- [x] Modal and form components for all entities

### 📋 Next Steps

1. **Search Implementation** (Priority: High)
   - SearchBar component with debouncing
   - SearchResults page
   - Keyboard shortcuts (Cmd+K for search, E for edit mode)

2. **Drag-and-Drop Reordering**
   - Install @dnd-kit/core
   - Add drag handles to sections, subsections, and code blocks
   - Wire up reorder API endpoints

3. **Testing & Polish**
   - Test all CRUD operations thoroughly
   - Verify responsive design at different widths
   - Test data persistence
   - Add loading states and error handling
   - Add toast notifications for operations

4. **Deployment**
   - Deploy backend to Railway or similar
   - Deploy frontend to Vercel
   - Configure production environment variables
   - Set up production database

## Key Features

- **Dynamic Content Management**: Create, edit, and delete sections and code blocks
- **Half-Screen Layout**: Optimized for 50% screen width (960px) for side-by-side use with coding tools
- **Full-Text Search**: PostgreSQL-powered search across all content
- **Click-to-Copy**: One-click copy functionality with visual feedback
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Syntax Highlighting**: Code blocks with proper syntax highlighting
- **Navigation Menu**: Categorized sidebar for easy section navigation

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

## UI Design

The application features a half-screen optimized layout:
- 200px fixed sidebar with navigation
- 2-column grid for sections at 960px width
- Full-width sections for "Best Practices" type content
- View mode: Clean, readable interface
- Edit mode: Shows edit/delete controls and drag handles

## Migration from Static HTML

The original static [index.html](index.html) file has been preserved. Run `npm run migrate` to import its content into the database. The migration script:
- Parses HTML structure using Cheerio
- Extracts sections, titles, and code blocks
- Preserves styling (colors, variants)
- Categorizes sections automatically
- Seeds the PostgreSQL database

## Contributing

This is a single-user application, but improvements are welcome!

## License

MIT
