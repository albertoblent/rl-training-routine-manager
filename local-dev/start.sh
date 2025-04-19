#!/usr/bin/env bash

# Exit on error
set -o errexit

# Root project directory
PROJECT_ROOT=$(pwd)

echo "=== Starting RL Training Routine Manager ==="

# Check if virtual environment exists
if [ ! -d "$PROJECT_ROOT/venv" ]; then
  echo "ERROR: Virtual environment not found. Please run ./local-dev/build.sh first"
  exit 1
fi

# Activate virtual environment
echo "Activating virtual environment..."
source "$PROJECT_ROOT/venv/bin/activate"

# Force color output
export PYTHONUNBUFFERED=1
export FORCE_COLOR=1
export REACT_FORCE_COLOR=1
export NPM_CONFIG_COLOR=always

# Create logs directory if it doesn't exist
LOGS_DIR="$PROJECT_ROOT/local-dev/logs"
if [ ! -d "$LOGS_DIR" ]; then
  mkdir -p "$LOGS_DIR"
  echo "Created logs directory: $LOGS_DIR"
fi

# Check if port 8000 is already in use
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
  echo "ERROR: Port 8000 is already in use. Django server may already be running."
  echo "Run ./local-dev/stop.sh to stop any existing instances."
  exit 1
fi

# Check if port 3000 is already in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
  echo "ERROR: Port 3000 is already in use. React server may already be running."
  echo "Run ./local-dev/stop.sh to stop any existing instances."
  exit 1
fi

# Start the backend
echo "Starting Django backend server..."
cd "$PROJECT_ROOT/trm"
python -u manage.py runserver > >(tee "$LOGS_DIR/django.log") 2>&1 &
DJANGO_PID=$!
echo "Django server started (PID: $DJANGO_PID)"

# Wait a moment to ensure Django has started
sleep 2
if ! ps -p $DJANGO_PID > /dev/null; then
  echo "ERROR: Django server failed to start. Check the logs for details."
  exit 1
fi

# Start the frontend
echo "Starting React frontend server..."
cd "$PROJECT_ROOT/trm/frontend"
npm start --color=always > >(tee "$LOGS_DIR/react.log") 2>&1 &
REACT_PID=$!
echo "React server started (PID: $REACT_PID)"

# Save PIDs to file for easier cleanup
echo "$DJANGO_PID $REACT_PID" > "$LOGS_DIR/pids.txt"

echo "=== Application started successfully! ==="
echo "Django backend: http://localhost:8000"
echo "React frontend: http://localhost:3000"
echo ""
echo "View logs:"
echo "  Django: tail -f $LOGS_DIR/django.log"
echo "  React:  tail -f $LOGS_DIR/react.log"
echo "  All:    tail -f $LOGS_DIR/*.log"
echo ""
echo "To stop the application, run: ./local-dev/stop.sh"