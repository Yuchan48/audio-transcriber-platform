#!/bin/bash
set -e

cd ~/audio-transcriber-platform

bash deploy.sh

echo "[CD] Pulling latest code..."
git pull origin main

echo "[CD] Stopping containers..."
docker compose down

echo "[CD] Rebuilding images..."
docker compose build --no-cache

echo "[CD] Starting containers..."
docker compose up -d

echo "[CD] Waiting for backend startup..."
sleep 10

echo "[CD] Health check..."

if curl -f http://localhost:8000/docs > /dev/null; then
  echo "[CD] Backend is healthy"
else
  echo "[CD] Backend failed — rolling back"

  git reset --hard HEAD~1 || true
  docker compose down
  docker compose up -d --build

  exit 1
fi

echo "[CD] Cleaning unused images..."
docker image prune -f

echo "[CD] Deployment complete successfully"