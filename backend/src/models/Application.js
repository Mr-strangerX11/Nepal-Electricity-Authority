const db = require('../config/database');

class Application {
  static async create(applicationData) {
    return new Promise((resolve, reject) => {
      const {
        user_id, application_type, connection_load, service_address,
        contact_number, meter_number, priority = 'normal', status = 'submitted'
      } = applicationData;

      const sql = `INSERT INTO applications 
        (user_id, meter_number, application_type, connection_load, service_address, 
         contact_number, priority, status, expected_completion_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '+10 days'))`;

      const params = [
        user_id, meter_number, application_type, connection_load,
        service_address, contact_number, priority, status
      ];

      db.run(sql, params, function(err) {
        if (err) return reject(err);
        resolve({
          id: this.lastID,
          user_id,
          meter_number,
          application_type,
          status,
          created_at: new Date()
        });
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM applications WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM applications WHERE user_id = ? ORDER BY created_at DESC';
      db.all(sql, [userId], (err, rows) => {
        if (err) reject(err);
        resolve(rows || []);
      });
    });
  }

  static async findAll(filters = {}) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM applications WHERE 1=1';
      const params = [];

      if (filters.status) {
        sql += ' AND status = ?';
        params.push(filters.status);
      }
      if (filters.priority) {
        sql += ' AND priority = ?';
        params.push(filters.priority);
      }
      if (filters.startDate) {
        sql += ' AND DATE(created_at) >= ?';
        params.push(filters.startDate);
      }
      if (filters.endDate) {
        sql += ' AND DATE(created_at) <= ?';
        params.push(filters.endDate);
      }

      sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(filters.limit || 10);
      params.push(((filters.page || 1) - 1) * (filters.limit || 10));

      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        resolve(rows || []);
      });
    });
  }

  static async updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      db.run(sql, [status, id], function(err) {
        if (err) return reject(err);
        resolve({ id, status, updated_at: new Date() });
      });
    });
  }

  static async updatePriority(id, priority) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE applications SET priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      db.run(sql, [priority, id], function(err) {
        if (err) return reject(err);
        resolve({ id, priority });
      });
    });
  }

  static async assignStaff(id, staff_id) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE applications SET assigned_staff_id = ? WHERE id = ?';
      db.run(sql, [staff_id, id], function(err) {
        if (err) return reject(err);
        resolve({ id, assigned_staff_id: staff_id });
      });
    });
  }

  static async getByStatus(status) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM applications WHERE status = ? ORDER BY created_at DESC';
      db.all(sql, [status], (err, rows) => {
        if (err) reject(err);
        resolve(rows || []);
      });
    });
  }
}

module.exports = Application;
