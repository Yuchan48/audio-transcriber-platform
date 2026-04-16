#!/bin/bash

set -e  # stop on error

echo "[CD] Pulling latest code..."
git pull origin main

echo "[CD] Rebuilding containers..."
docker compose up -d --build

echo "[CD] Waiting for app..."
sleep 5

echo "[CD] Health check..."
if curl -f http://localhost:8000/docs > /dev/null; then
  echo "[CD] App is healthy"
else
  echo "[CD] App failed! Rolling back..."

  git reset --hard HEAD~1
  docker compose up -d --build

  curl -f http://localhost:8000/docs

  echo "[CD] Rolled back to previous version" || exit 1
fi

echo "[CD] Cleaning unused images..."
docker image prune -f

echo "[CD] Deployment complete"
