#!/bin/bash

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
sleep 5

# Run migrations
echo "Running Prisma migrations..."
npx prisma migrate dev --name init

echo "Database setup complete!"
