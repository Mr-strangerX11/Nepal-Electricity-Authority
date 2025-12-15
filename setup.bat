@echo off
REM Smart Electricity Connection & Approval System
REM Quick Start Script for Windows

echo ==================================
echo NEA Connection System - Setup
echo ==================================
echo.

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js 16+
    exit /b 1
)

REM Check for Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Python 3 is not installed. Please install Python 3.8+
    exit /b 1
)

echo.
echo Setting up individual services...
echo.

REM Backend setup
echo 1. Setting up Backend...
cd backend
copy .env.example .env
echo    Installing dependencies...
call npm install
echo    Backend ready
cd ..

REM Frontend setup
echo 2. Setting up Frontend...
cd frontend
copy .env.example .env
echo    Installing dependencies...
call npm install
echo    Frontend ready
cd ..

REM AI Service setup
echo 3. Setting up AI Service...
cd ai-verification
python -m venv venv
call venv\Scripts\activate.bat
echo    Installing dependencies...
pip install -r requirements.txt
echo    AI Service ready
cd ..

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Configure .env files in backend\ and frontend\
echo 2. Set up PostgreSQL database:
echo    createdb nea_electricity
echo    psql nea_electricity ^< backend/src/config/schema.sql
echo 3. Start the services:
echo    Terminal 1: cd backend ^&^& npm run dev
echo    Terminal 2: cd frontend ^&^& npm start
echo    Terminal 3: cd ai-verification ^&^& venv\Scripts\activate ^&^& python main.py
echo.
echo Access the application:
echo   Frontend:    http://localhost:3000
echo   Backend API: http://localhost:5000
echo   AI Service:  http://localhost:5001
