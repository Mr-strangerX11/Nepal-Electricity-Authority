const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, '../../data/nea_electricity.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

db.configure('busyTimeout', 5000);

function initializeDatabase() {
  db.serialize(() => {
    // Users table (Enhanced)
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        role TEXT DEFAULT 'customer',
        is_active BOOLEAN DEFAULT 1,
        two_fa_enabled BOOLEAN DEFAULT 0,
        two_fa_secret TEXT,
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Applications table (Enhanced)
    db.run(`
      CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        meter_number TEXT UNIQUE,
        application_type TEXT NOT NULL,
        connection_load INTEGER,
        service_address TEXT,
        contact_number TEXT,
        status TEXT DEFAULT 'submitted',
        priority TEXT DEFAULT 'normal',
        expected_completion_date DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // Documents table (Enhanced)
    db.run(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id INTEGER NOT NULL,
        document_type TEXT NOT NULL,
        file_url TEXT,
        verification_status TEXT DEFAULT 'pending',
        ai_score REAL,
        ai_feedback TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(application_id) REFERENCES applications(id)
      )
    `);

    // Payments table (Enhanced)
    db.run(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        gateway TEXT,
        transaction_id TEXT,
        payment_method TEXT,
        currency TEXT DEFAULT 'NPR',
        failure_reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(application_id) REFERENCES applications(id)
      )
    `);

    // Bills table (New)
    db.run(`
      CREATE TABLE IF NOT EXISTS bills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id INTEGER NOT NULL,
        billing_period TEXT,
        usage_units REAL,
        rate_per_unit REAL,
        total_amount REAL,
        tax REAL,
        late_fee REAL DEFAULT 0,
        status TEXT DEFAULT 'generated',
        issued_date DATE,
        due_date DATE,
        paid_date DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(application_id) REFERENCES applications(id)
      )
    `);

    // Staff Tasks table (New)
    db.run(`
      CREATE TABLE IF NOT EXISTS staff_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id INTEGER NOT NULL,
        assigned_staff_id INTEGER NOT NULL,
        task_type TEXT,
        status TEXT DEFAULT 'assigned',
        location TEXT,
        latitude REAL,
        longitude REAL,
        estimated_duration INTEGER,
        completion_date DATETIME,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(application_id) REFERENCES applications(id),
        FOREIGN KEY(assigned_staff_id) REFERENCES users(id)
      )
    `);

    // Notifications table (Enhanced)
    db.run(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message TEXT,
        notification_type TEXT,
        related_id INTEGER,
        is_read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // Disputes table (New)
    db.run(`
      CREATE TABLE IF NOT EXISTS disputes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bill_id INTEGER NOT NULL,
        customer_id INTEGER NOT NULL,
        reason TEXT,
        status TEXT DEFAULT 'open',
        resolution TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME,
        FOREIGN KEY(bill_id) REFERENCES bills(id),
        FOREIGN KEY(customer_id) REFERENCES users(id)
      )
    `);

    // Audit Logs table (New)
    db.run(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT,
        resource_type TEXT,
        resource_id INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        ip_address TEXT,
        result TEXT,
        details TEXT
      )
    `);

    // Payment Gateway Config table (New)
    db.run(`
      CREATE TABLE IF NOT EXISTS payment_gateways (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gateway_name TEXT UNIQUE,
        api_key TEXT,
        api_secret TEXT,
        merchant_id TEXT,
        is_active BOOLEAN DEFAULT 1,
        webhook_url TEXT,
        min_amount REAL,
        max_amount REAL,
        transaction_fee REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Service Requests table (New)
    db.run(`
      CREATE TABLE IF NOT EXISTS service_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id INTEGER NOT NULL,
        service_type TEXT,
        description TEXT,
        status TEXT DEFAULT 'pending',
        priority TEXT,
        assigned_staff_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(application_id) REFERENCES applications(id),
        FOREIGN KEY(assigned_staff_id) REFERENCES users(id)
      )
    `);

    // Tariff Settings table (New)
    db.run(`
      CREATE TABLE IF NOT EXISTS tariff_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        connection_type TEXT,
        from_units REAL,
        to_units REAL,
        rate_per_unit REAL,
        tax_percentage REAL,
        effective_date DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Fraud Detection Log table (New)
    db.run(`
      CREATE TABLE IF NOT EXISTS fraud_detection_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id INTEGER,
        fraud_type TEXT,
        confidence_score REAL,
        details TEXT,
        action_taken TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(application_id) REFERENCES applications(id)
      )
    `);

    console.log('✅ All database tables initialized successfully');
  });
}

// Promise wrapper for db operations
db.run = (function(original) {
  return function(sql, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    return original.call(this, sql, params, function(err) {
      if (callback) callback.call(this, err);
    });
  };
})(db.run);

db.get = (function(original) {
  return function(sql, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    return original.call(this, sql, params, callback);
  };
})(db.get);

db.all = (function(original) {
  return function(sql, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    return original.call(this, sql, params, callback);
  };
})(db.all);

module.exports = db;
