#!/usr/bin/env bash
# Exit on error
set -o errexit

# Modify this line as needed for your package manager (pip, poetry, etc.)
pip install -r requirements.txt

# Convert static asset files
python manage.py collectstatic --no-input

# Apply any outstanding database migrations with retry logic
MAX_RETRIES=5
RETRY_DELAY=10

for i in $(seq 1 $MAX_RETRIES); do
  echo "Attempt $i to run migrations..."
  if python manage.py migrate; then
    echo "Migrations completed successfully!"
    break
  else
    if [ $i -eq $MAX_RETRIES ]; then
      echo "Failed to run migrations after $MAX_RETRIES attempts."
      exit 1
    fi
    echo "Migration failed. Retrying in $RETRY_DELAY seconds..."
    sleep $RETRY_DELAY
  fi
done