#!/usr/bin/env bash

# Exit on error
set -o errexit

# Start the backend
echo "Starting backend..."
cd trm
python manage.py runserver &

# Start the frontend
echo "Starting frontend..."
cd frontend
npm start &