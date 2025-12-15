const db = require('../config/database');

class StaffTask {
  static async create(taskData) {
    return new Promise((resolve, reject) => {
      const {
        application_id, assigned_staff_id, task_type,
        location, latitude, longitude, estimated_duration = 120
      } = taskData;

      const sql = `INSERT INTO staff_tasks 
        (application_id, assigned_staff_id, task_type, location, 
         latitude, longitude, estimated_duration, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'assigned')`;

      const params = [
        application_id, assigned_staff_id, task_type,
        location, latitude, longitude, estimated_duration
      ];

      db.run(sql, params, function(err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, status: 'assigned', ...taskData });
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM staff_tasks WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static async findByStaffId(staffId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT st.*, a.meter_number, a.service_address, u.first_name, u.last_name, u.phone
        FROM staff_tasks st
        JOIN applications a ON st.application_id = a.id
        JOIN users u ON a.user_id = u.id
        WHERE st.assigned_staff_id = ? 
        ORDER BY CASE st.status 
          WHEN 'assigned' THEN 1 
          WHEN 'accepted' THEN 2 
          WHEN 'on_the_way' THEN 3 
          WHEN 'in_progress' THEN 4 
          ELSE 5 
        END`;

      db.all(sql, [staffId], (err, rows) => {
        if (err) reject(err);
        resolve(rows || []);
      });
    });
  }

  static async updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE staff_tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      db.run(sql, [status, id], function(err) {
        if (err) return reject(err);
        resolve({ id, status });
      });
    });
  }

  static async updateLocation(id, latitude, longitude) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE staff_tasks SET latitude = ?, longitude = ? WHERE id = ?';
      db.run(sql, [latitude, longitude, id], function(err) {
        if (err) return reject(err);
        resolve({ id, latitude, longitude });
      });
    });
  }

  static async completeTask(id, notes = '') {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE staff_tasks 
        SET status = 'completed', completion_date = CURRENT_TIMESTAMP, notes = ? 
        WHERE id = ?`;
      db.run(sql, [notes, id], function(err) {
        if (err) return reject(err);
        resolve({ id, status: 'completed' });
      });
    });
  }

  static async getPendingTasks() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT st.*, a.service_address, u.phone
        FROM staff_tasks st
        JOIN applications a ON st.application_id = a.id
        JOIN users u ON a.user_id = u.id
        WHERE st.status IN ('assigned', 'accepted')
        ORDER BY st.created_at ASC`;

      db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        resolve(rows || []);
      });
    });
  }

  static async getTaskStats() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN status IN ('assigned', 'accepted') THEN 1 ELSE 0 END) as pending_tasks,
        SUM(CASE WHEN status IN ('on_the_way', 'in_progress') THEN 1 ELSE 0 END) as in_progress_tasks,
        AVG(estimated_duration) as avg_duration
      FROM staff_tasks`;

      db.get(sql, [], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }
}

module.exports = StaffTask;
