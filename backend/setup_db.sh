#!/bin/bash

# PostgreSQL setup script for splittery backend

echo "Setting up PostgreSQL database for splittery..."

# Check if Docker and Docker Compose are available
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Change to project root directory where docker-compose.yml is located
cd "$(dirname "$0")/.."

# Start PostgreSQL using Docker Compose
echo "Starting PostgreSQL with Docker Compose..."
if command -v docker-compose &> /dev/null; then
    docker-compose up -d db
else
    docker compose up -d db
fi

echo "Waiting for PostgreSQL to start..."
sleep 5

# Update DATABASE_URL for Docker Compose setup
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/splittery" > backend/.env

# Check if PostgreSQL is ready
echo "Checking if PostgreSQL is ready..."
until docker exec splittery-db-1 pg_isready -U postgres 2>/dev/null || docker exec splittery_db_1 pg_isready -U postgres 2>/dev/null; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done

echo "PostgreSQL is ready!"

# Run migrations
echo "Running migrations..."
cd backend

# Install sqlx-cli if not present
if ! command -v sqlx &> /dev/null; then
    echo "Installing sqlx-cli..."
    cargo install sqlx-cli --no-default-features --features postgres
fi

# Run migrations
sqlx migrate run

echo "Database setup complete!"
echo "PostgreSQL is running via Docker Compose"
echo "Database URL: postgresql://postgres:password@localhost:5432/splittery"
echo ""
echo "To start the full application stack, run:"
echo "  docker-compose up"
echo ""
echo "To run just the backend for development, run:"
echo "  cd backend && cargo run"
