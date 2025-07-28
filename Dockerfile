# Start from an official Python image for backend
FROM python:3.11-slim AS base

# Set work directory
WORKDIR /app

# Install Node.js (for Next.js frontend)
# Use Node 20.x as example
RUN apt-get update \
    && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/ ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy all frontend files first
COPY frontend/ ./frontend/

# Move into frontend directory and install + build
WORKDIR /app/frontend
RUN npm install && npm run build

# Move back to root for backend steps
WORKDIR /app

# Expose ports
EXPOSE 3000 8000

# Install process manager to run both commands (e.g. use 'waitress' or 'gunicorn' if needed)
RUN npm install -g concurrently

# Start both services
CMD concurrently \
    "cd backend && uvicorn main:app --host 0.0.0.0 --port 8000" \
    "cd frontend && npm start"

