# 🚀 Quick Start Guide - NEA Electricity System

## ✅ System Status
**Last Updated**: December 11, 2025  
**Status**: 🟢 **READY TO USE**

---

## 🎯 Current Running Servers

### Frontend (React)
- **URL**: http://localhost:3000
- **Status**: ✅ Running
- **Port**: 3000

### Backend (Node.js/Express)
- **URL**: http://localhost:5000
- **Status**: ✅ Running
- **Port**: 5000
- **Health Check**: http://localhost:5000/health

---

## 📝 Access the System

### 1. Open Frontend
Open your browser and navigate to:
```
http://localhost:3000
```

### 2. Create an Account
- Click "Register" on the home page
- Fill in your details:
  - First Name
  - Last Name
  - Email
  - Phone (optional)
  - Password (min 8 chars)
- Click "Register"

### 3. Login
- Click "Login"
- Enter your email and password
- Click "Login"

### 4. Submit an Application
- Click "Apply for Connection"
- Fill in the form:
  - **Connection Type**: Residential/Commercial/Industrial
  - **Required Load**: Enter kW (e.g., 5.0)
  - **Address**: Your property address
  - **City**: Your city
  - **Postal Code**: (optional)
  - **Coordinates**: (optional, for mapping)
- Click "Submit Application"

### 5. Track Application
- Click "My Applications" in navigation
- View all your submitted applications
- See current status and details
- Track progress through workflow

### 6. Admin Dashboard (Optional)
- Register a new account with role "admin"
- Login with admin account
- Click "Admin Dashboard"
- View analytics and application stats

---

## 🔧 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend :3000                  │
│  (Home, Login, Register, Application, Dashboard)        │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────────┐
│            Express.js Backend API :5000                  │
│  (Authentication, Applications, Documents, Payments)    │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
    ┌────────────┐          ┌────────────┐
    │ PostgreSQL │          │  MongoDB   │
    │  Port 5432 │          │ Port 27017 │
    └────────────┘          └────────────┘
```

---

## 📂 Project Structure

```
NEA1/
├── backend/                    # Node.js API Server
│   ├── src/
│   │   ├── config/             # Database & configuration
│   │   ├── controllers/        # Business logic
│   │   ├── models/             # Database models
│   │   ├── routes/             # API endpoints
│   │   ├── services/           # External integrations
│   │   ├── middleware/         # Auth & validation
│   │   └── server.js           # Main server file
│   ├── package.json
│   ├── .env                    # Environment variables
│   └── Dockerfile
│
├── frontend/                   # React Web Application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable components
│   │   ├── context/            # Auth state (AuthContext)
│   │   ├── services/           # API client
│   │   ├── styles/             # Tailwind CSS
│   │   └── index.js            # Entry point
│   ├── public/                 # Static files
│   ├── package.json
│   ├── .env                    # Environment variables
│   ├── tailwind.config.js      # Tailwind configuration
│   └── Dockerfile
│
├── ai-verification/            # Python AI Service
│   ├── main.py                 # Flask server
│   ├── document_verifier.py    # OCR/Verification logic
│   ├── requirements.txt        # Python dependencies
│   └── Dockerfile
│
├── docs/                       # Documentation
│   ├── API_REFERENCE.md        # API endpoints
│   ├── ARCHITECTURE.md         # System design
│   └── INSTALLATION.md         # Setup instructions
│
└── docker-compose.yml          # Multi-container setup
```

---

## 🔌 Available API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/profile` - Get user profile

### Applications
- **POST** `/api/applications` - Create new application
- **GET** `/api/applications/my-applications` - Get user's applications
- **GET** `/api/applications/{id}` - Get application details
- **PUT** `/api/applications/{id}/status` - Update application status

### Documents
- **POST** `/api/documents/upload` - Upload document
- **GET** `/api/documents/{id}/verify` - Verify document

### Payments
- **POST** `/api/payments/initiate` - Start payment
- **POST** `/api/payments/verify` - Verify payment
- **GET** `/api/payments/{id}` - Get payment details

### Admin
- **GET** `/api/admin/dashboard` - Get dashboard data
- **GET** `/api/admin/applications` - Get all applications
- **POST** `/api/admin/assign-staff` - Assign field staff

---

## 🛠️ Troubleshooting

### Backend not responding
```bash
# Check if backend is running
curl http://localhost:5000/health

# If not running, start it
cd backend
npm start
```

### Frontend shows blank page
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check console for errors (F12 → Console tab)

### Login fails
- Ensure backend is running
- Check .env file has correct API_URL
- Verify database connection in backend logs

### Port already in use
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Kill process using port 5000
lsof -ti:5000 | xargs kill -9
```

---

## 📋 Test Scenarios

### Scenario 1: Customer Registration & Application
1. Go to http://localhost:3000
2. Click "Register"
3. Create customer account
4. Login
5. Click "Apply for Connection"
6. Fill form with:
   - Type: Residential
   - Load: 5.0 kW
   - Address: Kathmandu, Nepal
   - City: Kathmandu
7. Submit
8. View in "My Applications"

### Scenario 2: Admin Operations
1. Register another account with role "admin"
2. Login with admin account
3. Click "Admin Dashboard"
4. View analytics
5. See all applications

### Scenario 3: API Testing
Use Postman or curl:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 📊 Database Info

### PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **Database**: nea_electricity
- **Default User**: postgres
- **Default Password**: postgres

### MongoDB
- **Connection**: mongodb://localhost:27017
- **Database**: nea_electricity

---

## 🔐 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_NAME=nea_electricity
JWT_SECRET=your_secret_key
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

---

## 📚 Documentation Files

1. **README.md** - Project overview
2. **START.md** - Detailed startup instructions
3. **INSTALLATION.md** - Setup guide
4. **ARCHITECTURE.md** - System design
5. **API_REFERENCE.md** - API documentation
6. **CODE_VALIDATION_REPORT.md** - Code quality report
7. **PROJECT_HEALTH_CHECK.md** - System health status
8. **PROJECT_COMPLETION_REPORT.md** - Completion summary

---

## 🎓 Learning Resources

### Frontend (React)
- React Hooks: useContext, useState, useEffect
- React Router: Navigation between pages
- Tailwind CSS: Styling components
- Axios: API calls

### Backend (Node.js)
- Express.js: Web framework
- PostgreSQL: Relational database
- JWT: Authentication tokens
- bcryptjs: Password hashing

---

## ✨ Features Overview

### For Customers
✅ Online application submission  
✅ Real-time status tracking  
✅ Digital document upload  
✅ Payment gateway integration  
✅ SMS/Email notifications  
✅ Application history  

### For Field Staff
✅ Task assignments  
✅ Route optimization  
✅ Real-time updates  
✅ Customer confirmation  
✅ Meter data capture  

### For Admins
✅ Dashboard analytics  
✅ Application management  
✅ Staff scheduling  
✅ Performance reports  
✅ System monitoring  

---

## 🚨 Important Notes

1. **Development**: For development, use the individual `npm start` commands
2. **Database**: Ensure PostgreSQL is installed and running
3. **Passwords**: Change all default passwords before production
4. **SSL**: Configure SSL certificates for production
5. **API Keys**: Get real API keys for Stripe, Twilio, etc.

---

## 📞 Support

For issues or questions, refer to:
- **CODE_VALIDATION_REPORT.md** - For code issues
- **PROJECT_HEALTH_CHECK.md** - For system status
- **API_REFERENCE.md** - For API questions
- **ARCHITECTURE.md** - For system design questions

---

**System is ready to use! 🎉**

Access the application at: http://localhost:3000
