#!/usr/bin/env bash

# Root project directory
PROJECT_ROOT=$(pwd)

echo "=== Stopping RL Training Routine Manager ==="

LOGS_DIR="$PROJECT_ROOT/local-dev/logs"
PID_FILE="$LOGS_DIR/pids.txt"

# Check if we have saved PIDs from start.sh
if [ -f "$PID_FILE" ]; then
  echo "Found saved process IDs, stopping known processes first..."
  read -r DJANGO_PID REACT_PID < "$PID_FILE"

  if ps -p $DJANGO_PID > /dev/null; then
    echo "Stopping Django server (PID: $DJANGO_PID)..."
    kill $DJANGO_PID
    echo "Django server stopped"
  else
    echo "Django server (PID: $DJANGO_PID) was not running"
  fi

  if ps -p $REACT_PID > /dev/null; then
    echo "Stopping React server (PID: $REACT_PID)..."
    kill $REACT_PID
    echo "React server stopped"
  else
    echo "React server (PID: $REACT_PID) was not running"
  fi

  # Remove the PID file
  rm "$PID_FILE"
fi

# Fallback methods in case the above fails or PIDs have changed
echo "Ensuring all related processes are stopped..."

# Kill Django server
if pgrep -f "python.*manage.py runserver" > /dev/null; then
  echo "Stopping Django server processes..."
  pkill -f "python.*manage.py runserver" || echo "No additional Django processes found"
else
  echo "No Django server processes found"
fi

# Kill React server by port (macOS compatible version)
echo "Checking for processes on port 3000..."
PORT_PID=$(lsof -ti:3000 2>/dev/null)
if [ -n "$PORT_PID" ]; then
  echo "Stopping processes on port 3000 (PID: $PORT_PID)..."
  kill -9 $PORT_PID 2>/dev/null || echo "Failed to stop processes on port 3000"
  echo "Process on port 3000 stopped"
else
  echo "No processes found on port 3000"
fi

# Alternative kill for npm
if pgrep -f "node.*start" > /dev/null; then
  echo "Stopping Node.js processes..."
  pkill -f "node.*start" || echo "No additional Node.js processes found"
else
  echo "No Node.js processes found"
fi

echo "=== Application stopped successfully ==="