#!/bin/sh

echo "Waiting for DB..."
until pg_isready -h db -U yutos -d audio_transcriber; do
  sleep 2
done

echo "Running migrations..."
alembic upgrade head

echo "Starting app..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
