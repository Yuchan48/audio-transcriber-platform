#!/bin/bash
cd ~/audio-transcriber-platform

set -e

echo "Saving current commit…"
PREVIOUS_COMMIT=$(git rev-parse HEAD)

echo "Pulling latest code..."
git pull origin main

echo "Stopping existing containers..."
docker compose down

echo "Rebuilding containers..."
docker compose up -d --build

echo "Waiting for app"
MAX_ATTEMPTS=12
ATTEMPT=1
SUCCESS=0

# Loop for 60 seconds until the app is healthy or we reach the maximum number of attempts
while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
  echo "Health check attempt $ATTEMPT/$MAX_ATTEMPTS..."

  # Check if the FastAPI docs endpoint returns a successful 200 OK status
  if curl -s -f http://localhost:8000/docs > /dev/null || false; then
    SUCCESS=1
    break
  fi

  echo "App not ready yet. Sleeping 5 seconds..."
  sleep 5
  ATTEMPT=$((ATTEMPT + 1))
done

# Check if the app became healthy within the time limit
if [ $SUCCESS -eq 1 ]; then
  echo "Deployment successful"
else
  # Rollback to previous commit and restart containers
  echo "App failed to start within 60 seconds! Rolling back..."

  git reset --hard "$PREVIOUS_COMMIT"
  docker compose down
  docker compose up -d --build

  echo "Rolled back to previous version"
  exit 1
fi
