#!/bin/bash

# CheatSheeter Auto-Start Manager
# Manages automatic startup of CheatSheeter on Mac boot

PLIST_FILE="com.cheatsheeter.startup.plist"
PLIST_SOURCE="$(cd "$(dirname "$0")" && pwd)/$PLIST_FILE"
PLIST_DEST="$HOME/Library/LaunchAgents/$PLIST_FILE"
LOG_DIR="$(cd "$(dirname "$0")" && pwd)/logs"

show_usage() {
    echo "CheatSheeter Auto-Start Manager"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  enable   - Enable auto-start on boot"
    echo "  disable  - Disable auto-start on boot"
    echo "  status   - Check if auto-start is enabled"
    echo "  logs     - View startup logs"
    echo ""
}

enable_autostart() {
    echo "🚀 Enabling CheatSheeter auto-start on boot..."
    echo ""

    # Create logs directory
    if [ ! -d "$LOG_DIR" ]; then
        echo "📁 Creating logs directory..."
        mkdir -p "$LOG_DIR"
    fi

    # Copy plist file to LaunchAgents
    echo "📋 Installing launch agent..."
    cp "$PLIST_SOURCE" "$PLIST_DEST"

    # Load the launch agent
    echo "⚡ Loading launch agent..."
    launchctl load "$PLIST_DEST"

    echo ""
    echo "✅ Auto-start enabled!"
    echo ""
    echo "CheatSheeter will now start automatically when you log in."
    echo "Docker must be set to start automatically (System Settings > General > Login Items)"
    echo ""
    echo "View logs:"
    echo "  ./auto-start.sh logs"
}

disable_autostart() {
    echo "🛑 Disabling CheatSheeter auto-start..."
    echo ""

    # Unload the launch agent
    if [ -f "$PLIST_DEST" ]; then
        echo "⚡ Unloading launch agent..."
        launchctl unload "$PLIST_DEST" 2>/dev/null || true

        echo "🗑️  Removing launch agent..."
        rm "$PLIST_DEST"

        echo ""
        echo "✅ Auto-start disabled!"
    else
        echo "⚠️  Auto-start is not currently enabled"
    fi
}

check_status() {
    echo "📊 CheatSheeter Auto-Start Status"
    echo ""

    if [ -f "$PLIST_DEST" ]; then
        echo "✅ Auto-start is ENABLED"
        echo ""
        echo "Launch agent location:"
        echo "  $PLIST_DEST"
        echo ""

        # Check if it's loaded
        if launchctl list | grep -q "com.cheatsheeter.startup"; then
            echo "Status: Loaded and active"
        else
            echo "Status: Installed but not loaded"
            echo "Run: launchctl load $PLIST_DEST"
        fi
    else
        echo "❌ Auto-start is DISABLED"
        echo ""
        echo "To enable:"
        echo "  ./auto-start.sh enable"
    fi
}

view_logs() {
    echo "📋 CheatSheeter Startup Logs"
    echo ""

    if [ -f "$LOG_DIR/startup.log" ]; then
        echo "=== Standard Output ==="
        tail -50 "$LOG_DIR/startup.log"
        echo ""
    else
        echo "No startup.log found"
        echo ""
    fi

    if [ -f "$LOG_DIR/startup-error.log" ]; then
        echo "=== Errors ==="
        tail -50 "$LOG_DIR/startup-error.log"
        echo ""
    else
        echo "No startup-error.log found"
    fi
}

# Main script
case "${1:-}" in
    enable)
        enable_autostart
        ;;
    disable)
        disable_autostart
        ;;
    status)
        check_status
        ;;
    logs)
        view_logs
        ;;
    *)
        show_usage
        exit 1
        ;;
esac
