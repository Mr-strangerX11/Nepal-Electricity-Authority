# Backend Setup & Documentation

## Overview
Express.js REST API backend for the NEA Electricity Connection System.

## Quick Start

```bash
npm install
npm run dev
```

Server runs on `http://localhost:5000`

## Environment Variables

Create `.env` file:
```
PORT=5000
NODE_ENV=development

# PostgreSQL
POSTGRES_USER=nea_user
POSTGRES_PASSWORD=secure_password
POSTGRES_DB=nea_electricity
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# MongoDB
MONGODB_URI=mongodb://localhost:27017/nea_documents

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d

# Twilio SMS
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# SendGrid Email
SENDGRID_API_KEY=your_sendgrid_api_key

# Payment Gateways
STRIPE_SECRET_KEY=your_stripe_secret_key
ESEWA_MERCHANT_CODE=your_esewa_code
KHALTI_SECRET_KEY=your_khalti_secret_key

# File Storage
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AI Service
AI_SERVICE_URL=http://localhost:5001
AI_SERVICE_KEY=your_ai_service_key

# Frontend
FRONTEND_URL=http://localhost:3000
```

## Database Setup

### PostgreSQL

1. Create database:
```bash
createdb nea_electricity
```

2. Load schema:
```bash
psql nea_electricity < src/config/schema.sql
```

### MongoDB

```bash
mongod
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── controllers/      # Route controllers
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── package.json
├── .env.example
└── README.md
```

## API Documentation

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get current user profile

### Application Routes
- `POST /api/applications` - Create new application
- `GET /api/applications` - Get all applications (admin)
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id/status` - Update application status

### Document Routes
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:id/verify` - Verify document

### Payment Routes
- `POST /api/payments/initiate` - Initiate payment
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/:id` - Get payment details

### Staff Routes
- `GET /api/staff/tasks` - Get field staff tasks
- `PUT /api/staff/tasks/:id` - Update task status

### Admin Routes
- `GET /api/admin/dashboard` - Dashboard metrics
- `GET /api/admin/applications` - All applications
- `POST /api/admin/assign-staff` - Assign staff

## Testing

```bash
npm test
npm run test:watch
```

## Deployment

### Heroku
```bash
heroku create nea-electricity-api
git push heroku main
```

### Docker
```bash
docker build -t nea-api .
docker run -p 5000:5000 --env-file .env nea-api
```

## Troubleshooting

**Port Already in Use**
```bash
lsof -i :5000
kill -9 <PID>
```

**Database Connection Failed**
- Check PostgreSQL is running
- Verify credentials in .env
- Check database exists

**JWT Token Expired**
- Request new token at /api/auth/login
- Token expires in 7 days by default

## Contributing

Follow code style and add tests for new features.
