#!/usr/bin/env bash

# Exit on error
set -o errexit

# Get the root project directory (one level up from local-dev)
PROJECT_ROOT=$(dirname "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)")
cd "$PROJECT_ROOT"

echo "=== Building RL Training Routine Manager Docker image ==="

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

# Build the Docker images without starting the containers
echo "Building Docker images..."
docker-compose build

echo "=== Docker images built successfully ==="
echo "Run ./local-dev/docker-start.sh to start the containers"