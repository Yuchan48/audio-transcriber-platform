FROM python:3.11-slim

WORKDIR /app

# Environment settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

ENV PATH="/app/.venv/bin:/root/.local/bin:$PATH"

# Install system dependencies
RUN apt-get update \
    && apt-get install -y curl postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN curl -Ls https://astral.sh/uv/install.sh | sh

# Copy dependency files first for better Docker caching
COPY pyproject.toml uv.lock ./

# Install Python dependencies using uv with caching
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

# debug: list installed packages and check uv environment
RUN ls -la /app/.venv/bin

# Copy application source
COPY . .

# Ensure entrypoint script is executable
RUN chmod +x entrypoint.sh

# Expose FastAPI port
EXPOSE 8000

ENTRYPOINT ["sh", "entrypoint.sh"]
