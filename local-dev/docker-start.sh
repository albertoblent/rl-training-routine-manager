#!/usr/bin/env bash

# Exit on error
set -o errexit

# Get the root project directory (one level up from local-dev)
PROJECT_ROOT=$(dirname "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)")
cd "$PROJECT_ROOT"

echo "=== Starting RL Training Routine Manager with Docker ==="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed. Please install Docker to continue."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "ERROR: Docker is not running. Please start Docker to continue."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "ERROR: docker-compose is not installed. Please install docker-compose to continue."
    exit 1
fi

# Create logs directory if it doesn't exist
LOGS_DIR="$PROJECT_ROOT/local-dev/logs"
if [ ! -d "$LOGS_DIR" ]; then
  mkdir -p "$LOGS_DIR"
  echo "Created logs directory: $LOGS_DIR"
fi

# Start services with docker-compose
echo "Starting services with docker-compose..."
docker-compose up --build

echo "=== Docker containers are now running ==="
echo "Django backend: http://localhost:8000"
echo "React frontend: http://localhost:3000"
echo ""
echo "To stop the containers, press Ctrl+C or run: ./local-dev/docker-stop.sh"