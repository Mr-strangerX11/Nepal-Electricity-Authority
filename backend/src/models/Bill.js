const db = require('../config/database');

class Bill {
  static async create(billData) {
    return new Promise((resolve, reject) => {
      const {
        application_id, billing_period, usage_units, rate_per_unit,
        total_amount, tax = 0, status = 'generated'
      } = billData;

      const due_date = new Date();
      due_date.setDate(due_date.getDate() + 15); // 15 days to pay

      const sql = `INSERT INTO bills 
        (application_id, billing_period, usage_units, rate_per_unit, 
         total_amount, tax, status, issued_date, due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_DATE, ?)`;

      const params = [
        application_id, billing_period, usage_units, rate_per_unit,
        total_amount, tax, status, due_date.toISOString().split('T')[0]
      ];

      db.run(sql, params, function(err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, ...billData });
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM bills WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static async findByApplicationId(applicationId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM bills WHERE application_id = ? ORDER BY issued_date DESC';
      db.all(sql, [applicationId], (err, rows) => {
        if (err) reject(err);
        resolve(rows || []);
      });
    });
  }

  static async updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      const sql = status === 'paid' 
        ? 'UPDATE bills SET status = ?, paid_date = CURRENT_DATE WHERE id = ?'
        : 'UPDATE bills SET status = ? WHERE id = ?';
      
      const params = status === 'paid' ? [status, id] : [status, id];

      db.run(sql, params, function(err) {
        if (err) return reject(err);
        resolve({ id, status });
      });
    });
  }

  static async applyLateFee(id, lateFeeAmount) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE bills SET late_fee = late_fee + ? WHERE id = ?';
      db.run(sql, [lateFeeAmount, id], function(err) {
        if (err) return reject(err);
        resolve({ id, late_fee_applied: lateFeeAmount });
      });
    });
  }

  static async getSummary(filters = {}) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT 
        COUNT(*) as total_bills,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdue_count,
        SUM(total_amount) as total_revenue,
        SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) as collected_amount
      FROM bills WHERE 1=1`;

      const params = [];

      if (filters.startDate) {
        sql += ' AND DATE(issued_date) >= ?';
        params.push(filters.startDate);
      }
      if (filters.endDate) {
        sql += ' AND DATE(issued_date) <= ?';
        params.push(filters.endDate);
      }

      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }
}

module.exports = Bill;
