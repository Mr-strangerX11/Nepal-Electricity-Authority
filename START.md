# Start Development Services

This directory contains scripts to quickly start the development environment.

## Quick Start Options

### Option 1: Docker Compose (Recommended)
```bash
docker-compose up -d
```

### Option 2: Automated Script

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```bash
setup.bat
```

### Option 3: Manual Startup

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

**Terminal 3 - AI Service:**
```bash
cd ai-verification
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

## Services

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend API | 5000 | http://localhost:5000 |
| AI Service | 5001 | http://localhost:5001 |
| PostgreSQL | 5432 | localhost:5432 |
| MongoDB | 27017 | localhost:27017 |

## Default Credentials

**Admin Account:**
- Email: admin@nea.gov.np
- Password: admin123

**Customer Account:**
- Email: customer@example.com
- Password: password123

**Field Staff Account:**
- Email: staff@nea.gov.np
- Password: staff123

## Troubleshooting

### Port Already in Use
Kill the process using the port:
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Database Connection Error
Ensure PostgreSQL is running:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Docker
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:15
```

### Module Not Found
Reinstall dependencies:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

## Stop Services

### Docker Compose
```bash
docker-compose down
```

### Manual
Press Ctrl+C in each terminal window.

---

For detailed setup instructions, see [docs/INSTALLATION.md](../docs/INSTALLATION.md)
