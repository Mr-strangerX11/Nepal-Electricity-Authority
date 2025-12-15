#!/bin/bash

# Smart Electricity Connection & Approval System
# Quick Start Script

echo "=================================="
echo "NEA Connection System - Setup"
echo "=================================="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+"
    exit 1
fi

# Check for Docker (optional)
if command -v docker &> /dev/null; then
    echo "✅ Docker detected"
    read -p "Use Docker Compose for setup? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "Starting Docker containers..."
        docker-compose up -d
        echo "✅ Services started!"
        echo ""
        echo "Access points:"
        echo "  Frontend:   http://localhost:3000"
        echo "  Backend API: http://localhost:5000"
        echo "  AI Service: http://localhost:5001"
        exit 0
    fi
fi

echo ""
echo "Setting up individual services..."
echo ""

# Backend setup
echo "1️⃣ Setting up Backend..."
cd backend
cp .env.example .env
echo "   Installing dependencies..."
npm install > /dev/null 2>&1
echo "   ✅ Backend ready"
cd ..

# Frontend setup
echo "2️⃣ Setting up Frontend..."
cd frontend
cp .env.example .env
echo "   Installing dependencies..."
npm install > /dev/null 2>&1
echo "   ✅ Frontend ready"
cd ..

# AI Service setup
echo "3️⃣ Setting up AI Service..."
cd ai-verification
python3 -m venv venv
source venv/bin/activate
echo "   Installing dependencies..."
pip install -q -r requirements.txt
echo "   ✅ AI Service ready"
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure .env files in backend/ and frontend/"
echo "2. Set up PostgreSQL database:"
echo "   createdb nea_electricity"
echo "   psql nea_electricity < backend/src/config/schema.sql"
echo "3. Start the services:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm start"
echo "   Terminal 3: cd ai-verification && source venv/bin/activate && python main.py"
echo ""
echo "Access the application:"
echo "  Frontend:   http://localhost:3000"
echo "  Backend API: http://localhost:5000"
echo "  AI Service: http://localhost:5001"
