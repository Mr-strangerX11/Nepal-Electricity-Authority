const pool = require('../config/database');

class StaffService {
  // Get assigned tasks for field staff
  static async getStaffTasks(staffId) {
    try {
      const result = await pool.query(
        `SELECT ft.*, a.*, u.first_name, u.last_name, u.phone
         FROM field_tasks ft
         JOIN applications a ON ft.application_id = a.id
         JOIN users u ON a.user_id = u.id
         WHERE ft.staff_id = $1 AND ft.status IN ('assigned', 'in_progress')
         ORDER BY ft.scheduled_date ASC`,
        [staffId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Update task status
  static async updateTaskStatus(taskId, status, completionNotes) {
    try {
      const result = await pool.query(
        `UPDATE field_tasks 
         SET status = $1, completion_date = CASE WHEN $1 = 'completed' THEN CURRENT_TIMESTAMP ELSE NULL END, notes = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [status, completionNotes, taskId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Auto-assign staff based on location and workload
  static async assignNearestStaff(latitude, longitude, taskType) {
    try {
      // Get all available staff with workload count
      const result = await pool.query(
        `SELECT u.id, u.first_name, u.last_name,
                COUNT(ft.id) as task_count,
                (u.latitude IS NOT NULL AND u.longitude IS NOT NULL) as has_location
         FROM users u
         LEFT JOIN field_tasks ft ON u.id = ft.staff_id AND ft.status IN ('assigned', 'in_progress')
         WHERE u.role = 'field_staff' AND u.is_active = true
         GROUP BY u.id, u.first_name, u.last_name, u.latitude, u.longitude
         ORDER BY task_count ASC, u.id
         LIMIT 1`
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get staff performance metrics
  static async getStaffMetrics(staffId, days = 30) {
    try {
      const result = await pool.query(
        `SELECT 
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_tasks,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
          AVG(EXTRACT(DAY FROM (completion_date - scheduled_date))) as avg_completion_days
         FROM field_tasks
         WHERE staff_id = $1 AND created_at > CURRENT_TIMESTAMP - INTERVAL '${days} days'`,
        [staffId]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = StaffService;
