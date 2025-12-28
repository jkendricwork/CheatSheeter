# CheatSheeter Docker Guide

This guide provides all the commands you need to run CheatSheeter using Docker.

## Quick Start

```bash
# Start all services (database, backend, frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Access the application at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432

## Common Commands

### Starting and Stopping

```bash
# Start all services in background
docker-compose up -d

# Start all services with logs visible
docker-compose up

# Stop all services
docker-compose down

# Stop and remove all data (volumes)
docker-compose down -v
```

### Building and Rebuilding

```bash
# Build and start (first time or after code changes)
docker-compose up -d --build

# Rebuild a specific service
docker-compose build frontend
docker-compose build backend

# Force rebuild without cache
docker-compose build --no-cache
```

### Viewing Logs

```bash
# View all logs
docker-compose logs -f

# View logs for a specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres

# View last 100 lines
docker-compose logs --tail=100
```

### Managing Containers

```bash
# List running containers
docker-compose ps

# Restart a service
docker-compose restart backend
docker-compose restart frontend

# Stop a specific service
docker-compose stop backend

# Start a specific service
docker-compose start backend
```

### Accessing Containers

```bash
# Access backend shell
docker exec -it cheatsheeter-backend sh

# Access frontend shell
docker exec -it cheatsheeter-frontend sh

# Access PostgreSQL database
docker exec -it cheatsheeter-db psql -U postgres -d cheatsheeter

# Run a command in a container
docker exec cheatsheeter-backend npm --version
```

### Database Management

```bash
# Connect to database
docker exec -it cheatsheeter-db psql -U postgres -d cheatsheeter

# Backup database
docker exec cheatsheeter-db pg_dump -U postgres cheatsheeter > backup.sql

# Restore database
docker exec -i cheatsheeter-db psql -U postgres -d cheatsheeter < backup.sql

# View database logs
docker-compose logs -f postgres
```

### Troubleshooting

```bash
# Check container status
docker-compose ps

# View resource usage
docker stats

# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Full cleanup (WARNING: removes all Docker data)
docker system prune -a --volumes
```

### Development Workflow

```bash
# 1. Make code changes
# 2. Rebuild and restart
docker-compose up -d --build

# 3. View logs to check for errors
docker-compose logs -f

# 4. Test changes in browser
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Production Deployment

```bash
# Build for production
docker-compose build

# Start in detached mode
docker-compose up -d

# Monitor logs
docker-compose logs -f

# Check health
curl http://localhost:3001/health
```

## Environment Variables

You can customize the application by modifying the `docker-compose.yml` file:

```yaml
backend:
  environment:
    PORT: 3001
    DATABASE_URL: postgresql://postgres:postgres@postgres:5432/cheatsheeter
    CORS_ORIGIN: http://localhost:3000
    NODE_ENV: production
```

## Architecture

### Services

1. **PostgreSQL Database** (`postgres`)
   - Image: `postgres:14-alpine`
   - Port: 5432
   - Volume: `postgres_data` (persistent storage)
   - Initializes schema automatically on first run

2. **Backend API** (`backend`)
   - Built from: `./server/Dockerfile`
   - Port: 3001
   - Dependencies: PostgreSQL
   - Auto-restarts on failure

3. **Frontend** (`frontend`)
   - Built from: `./client/Dockerfile`
   - Port: 3000 (nginx serves on port 80 internally)
   - Served by nginx
   - Static build of React app

### Network

All services communicate via the `cheatsheeter-network` Docker bridge network. This allows:
- Backend to connect to database using hostname `postgres`
- Isolated network for security
- Easy service discovery

### Volumes

- `postgres_data`: Persists database data across container restarts

## Tips

1. **First Time Setup**: Run `docker-compose up -d` and wait for all services to start
2. **After Code Changes**: Run `docker-compose up -d --build` to rebuild
3. **View Logs**: Use `docker-compose logs -f` to debug issues
4. **Clean Restart**: Use `docker-compose down -v && docker-compose up -d --build` for a fresh start
5. **Port Conflicts**: If ports 3000, 3001, or 5432 are in use, modify `docker-compose.yml`

## Differences from Local Development

| Aspect | Docker | Local Development |
|--------|--------|-------------------|
| Frontend Port | 3000 (nginx) | 5173 (Vite dev server) |
| Backend Mode | Production | Development |
| Database | Docker container | Docker or local install |
| Hot Reload | No (need rebuild) | Yes |
| Build Time | Slower (rebuilds) | Faster (dev mode) |

## When to Use Docker vs Local Development

**Use Docker when:**
- Deploying to production
- Ensuring consistent environment across team
- Testing production build
- Need isolated environment
- Deploying to cloud platforms

**Use Local Development when:**
- Active development with hot reload
- Debugging with dev tools
- Faster iteration cycle
- Need access to dev server features
