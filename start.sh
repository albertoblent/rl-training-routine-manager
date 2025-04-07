#!/usr/bin/env bash

# Exit on error
set -o errexit

# Root project directory
PROJECT_ROOT=$(pwd)

# Force color output
export PYTHONUNBUFFERED=1
export FORCE_COLOR=1
export REACT_FORCE_COLOR=1
export NPM_CONFIG_COLOR=always

# Start the backend
echo "Starting backend..."
cd "$PROJECT_ROOT/trm"
python -u manage.py runserver > >(tee "$PROJECT_ROOT/django.log") 2>&1 &
echo "Django server started (PID: $!). Logs in django.log"

# Start the frontend
echo "Starting frontend..."
cd "$PROJECT_ROOT/trm/frontend"
npm start --color=always > >(tee "$PROJECT_ROOT/react.log") 2>&1 &
echo "React server started (PID: $!). Logs in react.log"

echo "Both servers are now running. View colored logs with:"
echo "  Django: tail -f $PROJECT_ROOT/django.log"
echo "  React:  tail -f $PROJECT_ROOT/react.log"
echo "Or view both: tail -f $PROJECT_ROOT/*.log"