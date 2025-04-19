#!/usr/bin/env bash

# Exit on error
set -o errexit

# Root project directory
PROJECT_ROOT=$(pwd)

echo "=== RL Training Routine Manager Setup ==="

# Create virtual environment if it doesn't exist
if [ ! -d "$PROJECT_ROOT/venv" ]; then
  echo "Creating Python virtual environment..."
  python -m venv venv
  echo "Virtual environment created"
else
  echo "Virtual environment already exists"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source "$PROJECT_ROOT/venv/bin/activate"

# Install backend dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip setuptools
pip install -r "$PROJECT_ROOT/trm/requirements.txt"

# Django setup
echo "Setting up Django..."
cd "$PROJECT_ROOT/trm"

# Make migrations and migrate
echo "Running initial Django migrations..."
python manage.py makemigrations
python manage.py migrate

# Collect static files if needed
echo "Collecting static files..."
python manage.py collectstatic --noinput || echo "Static files collection skipped"

# Setup frontend
echo "Setting up frontend..."
cd "$PROJECT_ROOT/trm/frontend"
npm install

echo "=== Setup complete! ==="
echo "To start the application, run: ./local-dev/start.sh"
echo "To stop the application, run: ./local-dev/stop.sh"
