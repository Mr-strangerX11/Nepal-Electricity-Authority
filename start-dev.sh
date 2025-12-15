#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}NEA Smart Electricity System - Development Server${NC}"
echo "=================================================="

# Kill any existing processes on ports 3000, 5000, 5001
echo -e "${YELLOW}Cleaning up ports...${NC}"
lsof -ti:3000,5000,5001 | xargs -r kill -9 2>/dev/null || true
sleep 2

# Start backend
echo -e "${YELLOW}Starting Backend...${NC}"
cd /Users/macbook/Desktop/NEA1/backend
npm start > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}Backend started (PID: $BACKEND_PID)${NC}"
sleep 3

# Start frontend
echo -e "${YELLOW}Starting Frontend...${NC}"
cd /Users/macbook/Desktop/NEA1/frontend
npm start > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend started (PID: $FRONTEND_PID)${NC}"
sleep 5

# Check if services are running
echo ""
echo -e "${YELLOW}Status Check:${NC}"
if lsof -i :5000 > /dev/null; then
  echo -e "${GREEN}✓ Backend running on port 5000${NC}"
else
  echo -e "${RED}✗ Backend not running${NC}"
  tail -20 /tmp/backend.log
fi

if lsof -i :3000 > /dev/null; then
  echo -e "${GREEN}✓ Frontend running on port 3000${NC}"
else
  echo -e "${RED}✗ Frontend not running${NC}"
  tail -20 /tmp/frontend.log
fi

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}System is starting...${NC}"
echo -e "${YELLOW}Frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}Backend: http://localhost:5000${NC}"
echo ""
echo -e "${YELLOW}View logs:${NC}"
echo -e "Backend:  tail -f /tmp/backend.log"
echo -e "Frontend: tail -f /tmp/frontend.log"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop (servers will continue running)${NC}"
echo "=================================================="

# Keep script alive
wait
