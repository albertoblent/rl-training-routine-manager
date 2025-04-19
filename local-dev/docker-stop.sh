#!/usr/bin/env bash

# Exit on error
set -o errexit

# Get the root project directory (one level up from local-dev)
PROJECT_ROOT=$(dirname "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)")
cd "$PROJECT_ROOT"

echo "=== Stopping RL Training Routine Manager Docker containers ==="

# Stop Docker containers
docker-compose down

echo "=== Docker containers stopped successfully ==="