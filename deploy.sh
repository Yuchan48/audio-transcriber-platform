#!/bin/bash
cd ~/audio-transcriber-platform

set -e

echo “Saving current commit…”
PREVIOUS_COMMIT=$(git rev-parse HEAD)

echo "Pulling latest code..."
git pull origin main

echo "Stopping existing containers..."
docker compose down

echo "Rebuilding containers..."
docker compose up -d --build

echo "Waiting for app..."
sleep 5

echo "Health check..."
if curl -f http://localhost:8000/docs > /dev/null; then
  echo "App is healthy"
else
  echo "App failed! Rolling back..."

  git reset --hard $PREVIOUS_COMMIT

  docker compose down

  docker compose up -d --build

  echo "Rolled back to previous version"
  exit 1
fi

echo "Deployment successful"
