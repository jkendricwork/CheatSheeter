# CheatSheeter Auto-Start on Mac Boot

This guide explains how to set up CheatSheeter to automatically start when your Mac boots.

## Quick Start

### Enable Auto-Start

```bash
./auto-start.sh enable
```

### Disable Auto-Start

```bash
./auto-start.sh disable
```

### Check Status

```bash
./auto-start.sh status
```

### View Logs

```bash
./auto-start.sh logs
```

## Prerequisites

### 1. Enable Docker Desktop Auto-Start

For CheatSheeter to start automatically, Docker Desktop must also start automatically:

1. Open **System Settings** (or **System Preferences** on older macOS)
2. Go to **General** > **Login Items**
3. Add **Docker** to the list of items that open at login
4. Enable "Open at Login" for Docker

**Alternative method:**

1. Open **Docker Desktop**
2. Click the gear icon (Settings)
3. Go to **General**
4. Check **"Start Docker Desktop when you log in"**

### 2. Ensure Scripts are Executable

```bash
chmod +x start-docker.sh
chmod +x stop-docker.sh
chmod +x auto-start.sh
```

## How It Works

The auto-start system uses macOS's built-in **launchd** service manager:

1. A launch agent configuration file (`com.cheatsheeter.startup.plist`) is installed to `~/Library/LaunchAgents/`
2. When you log in, macOS automatically runs the launch agent
3. The launch agent executes `start-docker.sh`
4. `start-docker.sh` waits for Docker to be ready (up to 60 seconds)
5. Once Docker is available, all services start in containers

## Configuration

The launch agent is configured with:

- **RunAtLoad**: Starts when you log in
- **StartInterval**: 60 seconds (gives Docker time to start)
- **WorkingDirectory**: Your CheatSheeter directory
- **Logs**: Saved to `logs/startup.log` and `logs/startup-error.log`

## Troubleshooting

### CheatSheeter doesn't start on boot

1. **Check if auto-start is enabled:**
   ```bash
   ./auto-start.sh status
   ```

2. **Verify Docker starts automatically:**
   - Check System Settings > General > Login Items
   - Docker should be in the list

3. **Check logs for errors:**
   ```bash
   ./auto-start.sh logs
   ```

4. **Manually check if launch agent is loaded:**
   ```bash
   launchctl list | grep cheatsheeter
   ```

### Docker takes too long to start

The script waits up to 60 seconds for Docker. If your Mac takes longer:

1. Edit `start-docker.sh` and increase `MAX_WAIT`:
   ```bash
   MAX_WAIT=120  # Wait up to 2 minutes
   ```

### View detailed startup logs

```bash
# View standard output
tail -f ~/Dev/CheatSheeter/logs/startup.log

# View errors
tail -f ~/Dev/CheatSheeter/logs/startup-error.log
```

### Restart the launch agent

If you make changes to the plist file:

```bash
launchctl unload ~/Library/LaunchAgents/com.cheatsheeter.startup.plist
launchctl load ~/Library/LaunchAgents/com.cheatsheeter.startup.plist
```

Or simply:

```bash
./auto-start.sh disable
./auto-start.sh enable
```

## Manual Launch Agent Management

### Install manually

```bash
cp com.cheatsheeter.startup.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.cheatsheeter.startup.plist
```

### Remove manually

```bash
launchctl unload ~/Library/LaunchAgents/com.cheatsheeter.startup.plist
rm ~/Library/LaunchAgents/com.cheatsheeter.startup.plist
```

### Test the launch agent without rebooting

```bash
launchctl start com.cheatsheeter.startup
```

## Important Notes

1. **Auto-start uses Docker mode** - The application runs fully containerized, not in local development mode
2. **Port conflicts** - Make sure ports 3000, 3001, and 5432 are available at boot
3. **Data persistence** - Database data persists in Docker volumes across restarts
4. **Login required** - The launch agent runs when you **log in**, not at system boot
5. **Performance** - Starting containers at boot may slow down login slightly

## Alternative: System-Wide Boot (Advanced)

If you need CheatSheeter to start at **system boot** (before login), use a Launch Daemon instead:

```bash
# Copy to LaunchDaemons (requires sudo)
sudo cp com.cheatsheeter.startup.plist /Library/LaunchDaemons/

# Load as system daemon
sudo launchctl load /Library/LaunchDaemons/com.cheatsheeter.startup.plist
```

**Note:** This requires Docker to run as a system service, which is more complex.

## Disabling Permanently

To completely remove auto-start:

```bash
./auto-start.sh disable
```

This removes the launch agent and stops automatic startup.

## Access After Auto-Start

Once auto-started, access your application at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **LAN Access**: http://192.168.1.70:3000 (from other devices)

To stop the services:

```bash
npm run stop:docker
# or
./stop-docker.sh
```
