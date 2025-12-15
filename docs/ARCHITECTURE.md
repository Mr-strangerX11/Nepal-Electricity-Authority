# Project Architecture & Design

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Web Browser                               │
│                    (Customer / Admin / Staff)                    │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                        ┌──────▼──────┐
                        │   Nginx     │ (Reverse Proxy)
                        │  Load Bal.  │
                        └──────┬──────┘
                ┌───────────────┼───────────────┐
        ┌───────▼──────┐  ┌────▼─────┐  ┌─────▼──────┐
        │  Frontend    │  │ Backend   │  │ AI Service │
        │  React.js    │  │ Express   │  │ Python     │
        │  Port 3000   │  │ Port 5000 │  │ Port 5001  │
        └───────┬──────┘  └────┬──────┘  └─────┬──────┘
                │              │               │
        ┌───────┴──────────────┴───────────────┴──────────┐
        │            API & Service Communication          │
        └────────────────┬──────────────────────────────┘
                         │
        ┌────────────────┼──────────────────┐
    ┌───▼────┐    ┌──────▼──────┐    ┌─────▼────┐
    │PostgreSQL│   │   MongoDB   │    │Cloudinary│
    │Database │   │  Document   │    │ Storage  │
    │Port 5432│   │  Port 27017 │    │   Files  │
    └─────────┘   └─────────────┘    └──────────┘
```

## Component Architecture

### Frontend (React.js)
- **Pages**: Home, Login, Register, ApplicationForm, ApplicationTracker, AdminDashboard
- **Components**: Navigation, Forms, Cards, Tables, Charts
- **Services**: API client with axios
- **State Management**: React Context for auth
- **Styling**: Tailwind CSS

### Backend (Node.js/Express)
- **Controllers**: Handle HTTP requests and responses
- **Models**: Data access layer for PostgreSQL
- **Services**: Business logic (payments, notifications, documents)
- **Routes**: API endpoint definitions
- **Middleware**: Authentication, authorization, error handling
- **Database**: PostgreSQL for structured data

### AI Service (Python/Flask)
- **OCR**: Tesseract for document text extraction
- **Verification**: ML models for document validation
- **APIs**: REST endpoints for document verification
- **Processing**: Image preprocessing and feature extraction

## Data Flow Diagrams

### Application Submission Flow
```
User fills form → Validates input → Submits
                                    ↓
                          Backend receives
                                    ↓
                      Creates application record
                                    ↓
                       Sends confirmation email
                                    ↓
                    Frontend shows success message
                    Redirects to tracker
```

### Document Verification Flow
```
User uploads document → Frontend sends to backend
                              ↓
                    Backend stores temporarily
                              ↓
                    Sends to AI service (HTTP)
                              ↓
            AI extracts text (OCR) + verifies
                              ↓
                  Returns confidence score
                              ↓
            Backend uploads to Cloudinary
                              ↓
            Saves metadata to PostgreSQL
                              ↓
         Updates application status in frontend
```

### Payment Flow
```
User selects payment → Chooses gateway
                              ↓
                    Backend initiates payment
                              ↓
            ┌─────────────────┼──────────────┐
            ↓                 ↓              ↓
         Stripe           eSewa           Khalti
            ↓                 ↓              ↓
    External payment processing
            ↓                 ↓              ↓
            └─────────────────┼──────────────┘
                              ↓
                    Callback to backend
                              ↓
            Updates payment status in database
                              ↓
                Sends receipt email to customer
                              ↓
                   Frontend confirms success
```

### Field Staff Assignment Flow
```
Application approved → Admin dashboard
                              ↓
            System suggests nearest staff
                              ↓
         Admin assigns or auto-assigns
                              ↓
            Creates field_tasks record
                              ↓
         Sends SMS/Email to staff
                              ↓
         Staff sees task in mobile app
                              ↓
      Staff completes installation
                              ↓
       Updates status with meter reading
                              ↓
    Backend notifies customer
                              ↓
    Application moves to "connected" status
```

## Database Schema

### Core Tables
- **users**: User accounts and authentication
- **applications**: Electricity connection applications
- **documents**: Uploaded documents metadata
- **payments**: Payment transactions
- **field_tasks**: Staff task assignments
- **notifications**: User notifications
- **status_history**: Application status audit trail

### Relationships
```
users (1) ──────── (many) applications
users (1) ──────── (many) field_tasks
users (1) ──────── (many) notifications
applications (1) ─ (many) documents
applications (1) ─ (many) payments
applications (1) ─ (many) field_tasks
applications (1) ─ (many) status_history
applications (1) ─ (many) feedback
```

## API Architecture

### Request/Response Flow
```
Client Request
    ↓
    [Express Middleware]
    - CORS, Body Parser
    - Request Logging
    ↓
    [Auth Middleware]
    - JWT Verification
    - Role Check
    ↓
    [Route Handler]
    ↓
    [Controller]
    - Input Validation
    - Call Services
    ↓
    [Service Layer]
    - Business Logic
    - Database Queries
    ↓
    [Response]
    ↓
    [Error Handler] (if error)
    ↓
    JSON Response to Client
```

## Security Architecture

```
┌──────────────────────────────────────────┐
│         HTTPS/TLS Encryption             │
└───────────────┬──────────────────────────┘
                │
┌───────────────▼──────────────────────────┐
│     Request Authentication               │
│   - JWT Token Validation                 │
│   - Token Refresh Logic                  │
└───────────────┬──────────────────────────┘
                │
┌───────────────▼──────────────────────────┐
│   Authorization & Access Control         │
│   - Role-Based Access Control (RBAC)     │
│   - Resource-Level Permissions           │
└───────────────┬──────────────────────────┘
                │
┌───────────────▼──────────────────────────┐
│      Input Validation & Sanitization     │
│   - Request Body Validation              │
│   - SQL Injection Prevention             │
│   - XSS Prevention                       │
└───────────────┬──────────────────────────┘
                │
┌───────────────▼──────────────────────────┐
│   Password Security                      │
│   - bcrypt Hashing                       │
│   - Salt Generation                      │
└───────────────┬──────────────────────────┘
                │
┌───────────────▼──────────────────────────┐
│      Audit & Logging                     │
│   - User Actions Logged                  │
│   - Status Changes Tracked                │
│   - Timestamp Recording                  │
└──────────────────────────────────────────┘
```

## Deployment Architecture

```
                    Domain Name
                         │
        ┌────────────────▼─────────────────┐
        │        AWS/Azure/GCP Cloud       │
        │                                  │
        │  ┌──────────────────────────┐   │
        │  │    Load Balancer         │   │
        │  │   (Auto-scaling)         │   │
        │  └──────────┬───────────────┘   │
        │             │                   │
        │    ┌────────┴────────┐          │
        │    │                 │          │
        │  ┌─▼──┐          ┌──▼─┐         │
        │  │Web │          │Web │(Replicas)
        │  │App │          │App │         │
        │  └─┬──┘          └──┬─┘         │
        │    │                 │          │
        │  ┌─▼──────────────────▼──┐      │
        │  │  API Server Cluster    │      │
        │  │  (Multiple instances)  │      │
        │  └─┬──────────────────┬──┘      │
        │    │                  │         │
        │  ┌─▼───┐          ┌───▼─┐       │
        │  │Cache │          │Queue│       │
        │  │Redis │          │RabbitMQ    │
        │  └──────┘          └───────┘    │
        │                                  │
        │  ┌──────────────────────────┐   │
        │  │   Database Cluster       │   │
        │  │  - PostgreSQL (Primary)  │   │
        │  │  - MongoDB (Sharded)     │   │
        │  │  - Backups (S3)          │   │
        │  └──────────────────────────┘   │
        │                                  │
        │  ┌──────────────────────────┐   │
        │  │  Storage & CDN           │   │
        │  │  - Cloudinary (Files)    │   │
        │  │  - CloudFront (Static)   │   │
        │  └──────────────────────────┘   │
        └──────────────────────────────────┘
```

## Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Lazy loading of images
- Caching with service workers
- Minification and compression
- CDN for static files

### Backend
- Database indexing on frequently queried columns
- Query optimization and N+1 query prevention
- Caching with Redis
- Connection pooling
- Rate limiting

### AI Service
- Image preprocessing and optimization
- Batch processing support
- Model caching
- Asynchronous processing

## Monitoring & Logging

```
Application Events
       ↓
┌──────────────────┐
│  Logging Service │ (Winston/Pino)
└────────┬─────────┘
         │
    ┌────┴────┐
    │          │
┌───▼──┐   ┌──▼────┐
│ File │   │ Cloud  │
│ Logs │   │ Logs   │
└──────┘   └────────┘
         │
┌────────▼──────────┐
│ Monitoring Tool   │ (CloudWatch/Datadog)
│ - Metrics         │
│ - Alerts          │
│ - Dashboards      │
└───────────────────┘
```

---

This architecture provides scalability, security, and maintainability for the NEA electricity connection system.
