#!/bin/bash
# Backend deployment script for Render

set -e

echo "🚀 Starting Inventra Backend Deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create database tables
echo "🗄️  Setting up database..."
python -c "
from database import engine
import database_models
database_models.Base.metadata.create_all(bind=engine)
print('✓ Database tables created')
"

# Run diagnostics
echo "🔍 Running diagnostics..."
python diagnostics.py

# Start server
echo "🚀 Starting Uvicorn server..."
uvicorn backend.main:app --host 0.0.0.0 --port 8000

