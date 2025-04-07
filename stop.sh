#!/usr/bin/env bash

# Kill all background processes started by start.sh
echo "Stopping backend and frontend..."
pkill -f "python manage.py runserver"
pkill -f "npm start"