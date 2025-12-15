# API Reference Guide

## Authentication Endpoints

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
  "confirmPassword": "secure_password",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+977-9841234567",
  "role": "customer" // or "field_staff", "admin"
}

Response: 201
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "customer"
  }
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}

Response: 200
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "customer"
  }
}
```

### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+977-9841234567",
    "role": "customer",
    "is_active": true
  }
}
```

## Application Endpoints

### Create Application
```
POST /api/applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "connection_type": "residential", // residential, commercial, industrial
  "required_load": 5.5,
  "address": "123 Main Street",
  "city": "Kathmandu",
  "postal_code": "44600",
  "latitude": 27.7172,
  "longitude": 85.3240
}

Response: 201
{
  "success": true,
  "message": "Application submitted successfully",
  "application": {
    "id": 1,
    "user_id": 1,
    "connection_type": "residential",
    "required_load": 5.5,
    "status": "submitted",
    "address": "123 Main Street",
    "city": "Kathmandu",
    "created_at": "2025-12-11T10:30:00Z"
  }
}
```

### Get User's Applications
```
GET /api/applications/my-applications
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "applications": [
    {
      "id": 1,
      "user_id": 1,
      "status": "submitted",
      "connection_type": "residential",
      "required_load": 5.5,
      "payment_status": "pending",
      "documents_verified": false,
      "created_at": "2025-12-11T10:30:00Z"
    }
  ]
}
```

### Get Application Details
```
GET /api/applications/:id
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "application": {
    "id": 1,
    "user_id": 1,
    "connection_type": "residential",
    "required_load": 5.5,
    "status": "submitted",
    "address": "123 Main Street",
    "city": "Kathmandu",
    "payment_status": "pending",
    "documents_verified": false,
    "assigned_staff_id": null,
    "created_at": "2025-12-11T10:30:00Z"
  }
}
```

### Update Application Status (Admin Only)
```
PUT /api/applications/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved"
}

Response: 200
{
  "success": true,
  "message": "Application status updated",
  "application": {
    "id": 1,
    "status": "approved",
    "updated_at": "2025-12-11T11:00:00Z"
  }
}
```

## Payment Endpoints

### Initiate Payment
```
POST /api/payments/initiate
Authorization: Bearer <token>
Content-Type: application/json

{
  "application_id": 1,
  "amount": 5000,
  "payment_method": "stripe" // stripe, esewa, khalti
}

Response: 200
{
  "success": true,
  "payment": {
    "id": "pay_123",
    "clientSecret": "pi_test_123...",
    "url": "https://payment-gateway.com/..."
  }
}
```

### Verify Payment
```
POST /api/payments/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "transaction_id": "pi_test_123",
  "payment_method": "stripe"
}

Response: 200
{
  "success": true,
  "payment": {
    "status": "completed",
    "amount": 5000,
    "verified_at": "2025-12-11T11:30:00Z"
  }
}
```

## Document Endpoints

### Upload Document
```
POST /api/documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- application_id: 1
- document_type: "id_proof" // id_proof, property_papers, other
- document: <file>

Response: 201
{
  "success": true,
  "document": {
    "id": 1,
    "application_id": 1,
    "document_type": "id_proof",
    "file_url": "https://cloudinary.com/...",
    "verification_status": "pending",
    "ai_verification_score": 0.87
  }
}
```

### Verify Document
```
GET /api/documents/:id/verify
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "verification": {
    "verified": true,
    "confidence": 0.92,
    "extracted_data": {
      "name": "John Doe",
      "document_number": "12345678",
      "date_of_birth": "1990-01-01"
    },
    "issues": []
  }
}
```

## Field Staff Endpoints

### Get Assigned Tasks
```
GET /api/staff/tasks
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "tasks": [
    {
      "id": 1,
      "application_id": 1,
      "task_type": "meter_installation",
      "scheduled_date": "2025-12-15",
      "status": "assigned",
      "address": "123 Main Street, Kathmandu"
    }
  ]
}
```

### Update Task Status
```
PUT /api/staff/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed", // assigned, in_progress, completed, failed
  "notes": "Meter installed successfully. Serial: MTR-123456"
}

Response: 200
{
  "success": true,
  "task": {
    "id": 1,
    "status": "completed",
    "completion_date": "2025-12-15T14:30:00Z"
  }
}
```

## Admin Endpoints

### Get Dashboard
```
GET /api/admin/dashboard
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "dashboard": {
    "total_applications": 150,
    "pending_approvals": 23,
    "connected_count": 87,
    "revenue": 850000,
    "metrics": {...}
  }
}
```

### Get All Applications
```
GET /api/admin/applications?page=1&limit=10
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "applications": [...]
}
```

### Assign Staff to Application
```
POST /api/admin/assign-staff
Authorization: Bearer <token>
Content-Type: application/json

{
  "application_id": 1,
  "staff_id": 5,
  "scheduled_date": "2025-12-15"
}

Response: 200
{
  "success": true,
  "task": {
    "id": 1,
    "application_id": 1,
    "staff_id": 5,
    "status": "assigned"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Application Status Values

- `submitted` - Application submitted
- `verified` - Documents verified
- `approved` - Application approved
- `rejected` - Application rejected
- `meter_scheduled` - Meter installation scheduled
- `connected` - Connection active
- `bill_activated` - Billing started

---

For more details, see individual module documentation.
