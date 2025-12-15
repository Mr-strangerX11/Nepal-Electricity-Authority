-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL CHECK (role IN ('customer', 'field_staff', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications Table
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  connection_type VARCHAR(50) NOT NULL CHECK (connection_type IN ('residential', 'commercial', 'industrial')),
  required_load DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'verified', 'approved', 'rejected', 'meter_scheduled', 'connected', 'bill_activated')),
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  assigned_staff_id INTEGER REFERENCES users(id),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_amount DECIMAL(10, 2),
  documents_verified BOOLEAN DEFAULT false,
  meter_serial_number VARCHAR(100),
  installation_date TIMESTAMP,
  bill_activation_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents Table (stores document metadata; actual files in MongoDB/Cloudinary)
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL REFERENCES applications(id),
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('id_proof', 'property_papers', 'land_document', 'other')),
  file_url VARCHAR(500),
  cloudinary_public_id VARCHAR(255),
  verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  ocr_text TEXT,
  ai_verification_score DECIMAL(5, 2),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL REFERENCES applications(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('stripe', 'esewa', 'khalti', 'bank_transfer')),
  transaction_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Field Staff Tasks Table
CREATE TABLE field_tasks (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL REFERENCES applications(id),
  staff_id INTEGER NOT NULL REFERENCES users(id),
  task_type VARCHAR(50) NOT NULL CHECK (task_type IN ('meter_installation', 'site_inspection', 'meter_reading')),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  status VARCHAR(50) DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'failed')),
  completion_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  application_id INTEGER REFERENCES applications(id),
  type VARCHAR(50) NOT NULL CHECK (type IN ('sms', 'email', 'in_app')),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Status History Table (for tracking application status changes)
CREATE TABLE status_history (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL REFERENCES applications(id),
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by INTEGER REFERENCES users(id),
  reason TEXT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback Table
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL REFERENCES applications(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_assigned_staff ON applications(assigned_staff_id);
CREATE INDEX idx_documents_application_id ON documents(application_id);
CREATE INDEX idx_payments_application_id ON payments(application_id);
CREATE INDEX idx_field_tasks_staff_id ON field_tasks(staff_id);
CREATE INDEX idx_field_tasks_application_id ON field_tasks(application_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_status_history_application_id ON status_history(application_id);
