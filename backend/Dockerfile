FROM python:3.11-slim

WORKDIR /app

# Environment settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/root/.local/bin:$PATH"

# Install system dependencies
RUN apt-get update \
    && apt-get install -y curl postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN curl -Ls https://astral.sh/uv/install.sh | sh

# Copy dependency files first for better Docker caching
COPY pyproject.toml uv.lock ./

# Install dependencies from lockfile
RUN uv sync --frozen --no-dev

# Copy application source
COPY . .

# Expose FastAPI port
EXPOSE 8000

ENTRYPOINT ["sh", "entrypoint.sh"]
