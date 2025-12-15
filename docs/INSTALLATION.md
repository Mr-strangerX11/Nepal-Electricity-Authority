# Installation & Setup Guide

## Prerequisites

- Node.js v16 or higher
- Python 3.8+
- PostgreSQL 12+
- MongoDB 4.4+
- Git

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NEA1
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your editor

# Setup PostgreSQL database
createdb nea_electricity
psql nea_electricity < src/config/schema.sql

# Start the backend
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the frontend
npm start
```

Frontend will run on `http://localhost:3000`

### 4. AI Service Setup

```bash
cd ../ai-verification

# Create Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Install Tesseract OCR (required for document verification)
# macOS
brew install tesseract

# Ubuntu/Debian
sudo apt-get install tesseract-ocr

# Windows - Download from: https://github.com/UB-Mannheim/tesseract/wiki

# Start AI service
python main.py
```

AI Service will run on `http://localhost:5001`

### 5. MongoDB Setup (Optional)

If using MongoDB for document storage:

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:6
```

## Docker Setup (All-in-One)

```bash
cd NEA1

# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application at `http://localhost`

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### AI Service Tests
```bash
cd ai-verification
pytest
```

## Configuration

### API Configuration
Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
```

### Payment Gateway Setup

**Stripe:**
1. Create account at stripe.com
2. Get API keys
3. Add to `.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**eSewa:**
1. Register merchant at esewa.com.np
2. Get merchant code
3. Add to `.env`:
```env
ESEWA_MERCHANT_CODE=your_code
ESEWA_SECRET_KEY=your_secret
```

**Khalti:**
1. Create account at khalti.com
2. Get API keys
3. Add to `.env`:
```env
KHALTI_PUBLIC_KEY=your_public_key
KHALTI_SECRET_KEY=your_secret_key
```

### SMS & Email Setup

**Twilio (SMS):**
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

**SendGrid (Email):**
```env
SENDGRID_API_KEY=your_sendgrid_api_key
```

## Database Initialization

### PostgreSQL Tables
```bash
psql nea_electricity < backend/src/config/schema.sql
```

### Insert Test Data
```sql
-- Create test users
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES 
('admin@nea.gov.np', 'hashed_password', 'Admin', 'User', 'admin'),
('customer@example.com', 'hashed_password', 'John', 'Doe', 'customer'),
('staff@nea.gov.np', 'hashed_password', 'Field', 'Staff', 'field_staff');
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
psql -U postgres -l

# Or for Docker
docker exec -it nea_postgres psql -U nea_user -l
```

### Module Not Found Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Python Virtual Environment Issues
```bash
# Recreate venv
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Environment Checklist

- [ ] .env files created in backend, frontend, and ai-verification
- [ ] PostgreSQL database created and schema loaded
- [ ] MongoDB running (if using)
- [ ] API keys configured (Stripe, eSewa, Khalti)
- [ ] Twilio and SendGrid credentials added
- [ ] Tesseract OCR installed
- [ ] Python virtual environment activated

## Next Steps

1. Create test accounts
2. Test application submission flow
3. Test document upload and verification
4. Test payment integration
5. Deploy to staging/production

## Getting Help

- Check README.md files in each directory
- Review API documentation in backend/README.md
- Check logs: `docker-compose logs -f`
- Visit support page or contact admin

---

**Setup Date**: December 2025
**Version**: 1.0.0
