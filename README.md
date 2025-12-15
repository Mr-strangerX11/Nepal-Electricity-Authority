# Smart Electricity Connection & Approval System

A comprehensive, full-stack digital platform for managing electricity connection applications with AI-powered document verification, real-time tracking, and automated field staff scheduling.

## 📋 Project Overview

This system streamlines the electricity connection process for Nepal Electricity Authority (NEA) by:
- Eliminating paper-based processes
- Automating document verification with AI/OCR
- Providing real-time application tracking
- Optimizing field staff scheduling and routing
- Enabling digital payments
- Sending automated notifications

## 🏗️ Architecture

```
NEA Connection System/
├── backend/                 # Node.js/Express API
├── frontend/               # React.js Web Application
├── mobile/                # React Native Mobile App (Coming Soon)
├── ai-verification/       # Python AI/OCR Service
└── docs/                  # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.x
- Python >= 3.8
- PostgreSQL >= 12
- MongoDB >= 4.4
- Docker (optional)

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm start
```

Frontend runs on `http://localhost:3000`

### AI Verification Service Setup

```bash
cd ai-verification
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

AI Service runs on `http://localhost:5001`

## 📚 Modules

### 1. Customer Module
- **Online Application**: Submit connection requests with personal info, property details, and required load
- **Document Upload**: Upload ID proof, property papers, and supporting documents
- **Application Tracking**: Real-time status updates with expected timelines
- **Digital Payment**: Pay connection fees via Stripe, eSewa, or Khalti
- **Notifications**: SMS and email updates at every stage

### 2. Field Staff Module
- **Task Assignment**: View assigned meter installation tasks with addresses
- **Status Updates**: Update installation progress in real-time
- **Customer Confirmation**: Confirm appointments and capture meter readings
- **Route Optimization**: Optimized routing for multiple installations

### 3. Admin Module
- **Application Management**: Review and approve/reject applications
- **Staff Scheduling**: Auto-assign staff based on location and workload
- **Analytics Dashboard**: Track metrics and generate reports
- **System Monitoring**: Monitor application processing times and identify bottlenecks

## 🔄 Application Workflow

```
1. Customer submits application
   ↓
2. AI verifies documents (OCR + ML)
   ↓
3. Admin reviews and approves
   ↓
4. System assigns nearest field staff
   ↓
5. Staff installs meter and updates status
   ↓
6. System sends activation notification
   ↓
7. Bill activation and customer payment
```

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React.js, Tailwind CSS, React Router |
| Backend | Node.js, Express.js, PostgreSQL |
| Database | PostgreSQL, MongoDB |
| AI/ML | Python, Tesseract OCR, TensorFlow |
| Payments | Stripe, eSewa, Khalti |
| Notifications | Twilio (SMS), SendGrid (Email) |
| File Storage | Cloudinary |
| Hosting | AWS/Azure/GCP |

## 📦 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/profile           - Get user profile
```

### Applications
```
POST   /api/applications           - Submit application
GET    /api/applications/my-applications - Get user's applications
GET    /api/applications/:id       - Get application details
PUT    /api/applications/:id/status - Update application status
GET    /api/applications          - Get all applications (admin)
```

### Documents
```
POST   /api/documents/upload       - Upload document
GET    /api/documents/:id/verify   - Verify document with AI
```

### Payments
```
POST   /api/payments/initiate      - Initiate payment
POST   /api/payments/verify        - Verify payment status
GET    /api/payments/:id           - Get payment details
```

### Field Staff
```
GET    /api/staff/tasks            - Get assigned tasks
PUT    /api/staff/tasks/:id        - Update task status
```

### Admin
```
GET    /api/admin/dashboard        - Get dashboard metrics
GET    /api/admin/applications     - Get all applications
POST   /api/admin/assign-staff     - Assign staff to application
```

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Input validation and sanitization
- HTTPS/TLS encryption
- Secure environment variables

## 📊 Database Schema

### Main Tables
- **users** - User accounts and authentication
- **applications** - Electricity connection applications
- **documents** - Uploaded documents and verification
- **payments** - Payment records and transactions
- **field_tasks** - Staff task assignments
- **notifications** - User notifications
- **status_history** - Application status timeline

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# AI Service tests
cd ai-verification
pytest
```

## 📝 Environment Variables

See `.env.example` files in each directory for required environment variables:
- Database credentials
- API keys (Stripe, eSewa, Khalti, Twilio, SendGrid)
- JWT secrets
- Cloud storage credentials

## 🚢 Deployment

### Docker Deployment
```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d
```

### Manual Deployment
See individual README files in each directory for deployment instructions.

## 📱 Mobile App (Coming Soon)

React Native mobile application for:
- Customers to track applications
- Field staff to manage tasks
- Push notifications
- Offline functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📞 Support

For support and inquiries:
- Email: support@nea-electricity.gov.np
- Phone: +977-1-XXXXXXX
- Documentation: `/docs` folder

## 🎯 Future Enhancements

- [ ] Real-time notifications with WebSocket
- [ ] Advanced analytics with predictive modeling
- [ ] Mobile app (iOS/Android)
- [ ] Integration with NEA billing system
- [ ] Multi-language support
- [ ] Advanced mapping and geolocation features
- [ ] Automated email report generation

## 👥 Team

Built with ❤️ for Nepal Electricity Authority

---

**Version**: 1.0.0  
**Last Updated**: December 2025
