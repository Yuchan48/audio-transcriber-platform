#!/bin/bash

set -e

APP_DIR=~/audio-transcriber-platform
cd $APP_DIR

echo "[CD] Pulling latest code..."
git fetch origin main
git reset --hard origin/main

CURRENT_COMMIT=$(git rev-parse HEAD)
echo "[CD] Deploying commit: $CURRENT_COMMIT"

echo "[CD] Building containers..."
docker compose up -d --build

echo "[CD] Waiting for backend..."
sleep 10


echo "[CD] Health check..."
if curl -f http://localhost:8000/docs > /dev/null; then
  echo "[CD] App is healthy"

  # Save last good commit
  echo $CURRENT_COMMIT > .last_good_commit
  echo "[CD] Saved last good commit"

else
  echo "[CD] Health check failed"

  if [ -f .last_good_commit ]; then
    LAST_GOOD=$(cat .last_good_commit)
    echo "[CD] Rolling back to: $LAST_GOOD"

    git reset --hard $LAST_GOOD
    docker compose up -d --build

    sleep 5

    if curl -f http://localhost:8000/docs > /dev/null; then
      echo "[CD] Rollback successful"
    else
      echo "[CD] Rollback also failed — manual intervention needed"
      exit 1
    fi
  else
    echo "[CD] No rollback commit found"
    exit 1
  fi
fi

echo "[CD] Cleaning unused images..."
docker image prune -f

echo "[CD] Deployment complete"