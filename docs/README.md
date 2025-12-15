# NEA Electricity Connection System

This is the root directory for the complete Smart Electricity Connection & Approval System.

## Directory Structure

- **backend/** - Node.js/Express REST API
- **frontend/** - React.js web application  
- **ai-verification/** - Python AI/OCR verification service
- **mobile/** - React Native mobile app (coming soon)
- **docs/** - Documentation and guides

## Quick Start

### Option 1: Docker (Recommended)

```bash
docker-compose up -d
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Service: http://localhost:5001

### Option 2: Manual Setup

1. **Backend**
```bash
cd backend
npm install
npm run dev
```

2. **Frontend**
```bash
cd frontend
npm install
npm start
```

3. **AI Service**
```bash
cd ai-verification
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

## Default Credentials

**Test Admin Account**
- Email: admin@nea.gov.np
- Password: admin123

**Test Customer Account**
- Email: customer@example.com
- Password: password123

**Test Field Staff Account**
- Email: staff@nea.gov.np
- Password: staff123

(Change these in production!)

## Documentation

See README.md in each directory for detailed information:
- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [AI Service Documentation](./ai-verification/README.md)
- [Main Project README](./README.md)

## System Requirements

- Node.js 16+
- Python 3.8+
- PostgreSQL 12+
- MongoDB 4.4+
- Docker & Docker Compose (optional but recommended)

## Key Features

✅ Online application submission
✅ AI-powered document verification
✅ Real-time application tracking
✅ Digital payment integration
✅ Field staff scheduling & optimization
✅ SMS/Email notifications
✅ Admin dashboard with analytics
✅ Role-based access control

## Support

For issues and support: support@nea-electricity.gov.np

## License

MIT License - See LICENSE file for details
