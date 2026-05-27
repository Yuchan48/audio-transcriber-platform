#!/bin/sh
set -e # Exit immediately if a command exits with a non-zero status

echo "Waiting for DB..."
until pg_isready -h db -U $POSTGRES_USER -d $POSTGRES_DB; do
  sleep 2
done

echo "Running migrations..."
uv run alembic upgrade head

echo "Starting app..."
exec uv run uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --proxy-headers \
  --forwarded-allow-ips='*'
