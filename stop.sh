#!/usr/bin/env bash

# Kill all background processes started by start.sh
echo "Stopping backend and frontend..."
pkill -f "python manage.py runserver" || echo "Django server was not running"

# More thorough approach to kill the React server
echo "Killing any process using port 3000..."
fuser -k 3000/tcp || echo "No process using port 3000"

# Alternative kill for npm
pkill -f "node.*start" || echo "Node server was not running"