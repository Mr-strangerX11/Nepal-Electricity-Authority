const Application = require('../models/Application');
const Bill = require('../models/Bill');
const StaffTask = require('../models/StaffTask');

class DashboardController {
  // Admin Dashboard Summary
  static async getDashboardSummary(req, res) {
    try {
      const summaryStats = {
        applications: {},
        staff: {},
        revenue: {},
        tasks: {}
      };

      // Get application stats
      const applicationStats = await new Promise((resolve, reject) => {
        const db = require('../config/database');
        const sql = `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as submitted,
          SUM(CASE WHEN status = 'verified' THEN 1 ELSE 0 END) as verified,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
          SUM(CASE WHEN status = 'connected' THEN 1 ELSE 0 END) as connected
        FROM applications`;
        
        db.get(sql, [], (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });

      summaryStats.applications = applicationStats;

      // Get revenue stats
      const billStats = await Bill.getSummary();
      summaryStats.revenue = billStats;

      // Get task stats
      const taskStats = await StaffTask.getTaskStats();
      summaryStats.tasks = taskStats;

      res.status(200).json({
        success: true,
        data: summaryStats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get applications with filters
  static async getAllApplications(req, res) {
    try {
      const { status, priority, page = 1, limit = 10, startDate, endDate } = req.query;

      const filters = {
        status,
        priority,
        page: parseInt(page),
        limit: parseInt(limit),
        startDate,
        endDate
      };

      const applications = await Application.findAll(filters);

      res.status(200).json({
        success: true,
        data: applications,
        pagination: { page, limit, total: applications.length }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Approve application
  static async approveApplication(req, res) {
    try {
      const { id } = req.params;
      const { priority = 'normal' } = req.body;

      const application = await Application.findById(id);
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      if (application.status !== 'verified') {
        return res.status(400).json({
          success: false,
          message: 'Only verified applications can be approved'
        });
      }

      await Application.updateStatus(id, 'approved');
      if (priority !== 'normal') {
        await Application.updatePriority(id, priority);
      }

      res.status(200).json({
        success: true,
        message: 'Application approved successfully',
        data: { id, status: 'approved', priority }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Reject application
  static async rejectApplication(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const application = await Application.findById(id);
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      await Application.updateStatus(id, 'rejected');

      // Send notification to customer
      // TODO: Add notification logic

      res.status(200).json({
        success: true,
        message: 'Application rejected',
        data: { id, status: 'rejected', reason }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Assign staff to task
  static async assignStaffToTask(req, res) {
    try {
      const { applicationId } = req.params;
      const { staff_id, task_type, estimated_duration = 120 } = req.body;

      if (!staff_id) {
        return res.status(400).json({
          success: false,
          message: 'Staff ID is required'
        });
      }

      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      const task = await StaffTask.create({
        application_id: applicationId,
        assigned_staff_id: staff_id,
        task_type: task_type || 'meter_installation',
        location: application.service_address,
        latitude: 0,
        longitude: 0,
        estimated_duration
      });

      await Application.updateStatus(applicationId, 'meter_scheduled');

      res.status(201).json({
        success: true,
        message: 'Staff assigned successfully',
        data: task
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Generate reports
  static async generateReport(req, res) {
    try {
      const { reportType, startDate, endDate } = req.query;

      let report = {};

      switch (reportType) {
        case 'applications':
          const applicationFilters = {
            startDate,
            endDate,
            limit: 10000,
            page: 1
          };
          report = await Application.findAll(applicationFilters);
          break;

        case 'revenue':
          report = await Bill.getSummary({ startDate, endDate });
          break;

        case 'tasks':
          report = await StaffTask.getTaskStats();
          break;

        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid report type'
          });
      }

      res.status(200).json({
        success: true,
        reportType,
        data: report
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get system alerts
  static async getSystemAlerts(req, res) {
    try {
      const db = require('../config/database');

      const alerts = [];

      // Delayed applications
      const delayedApps = await new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) as count FROM applications 
          WHERE status NOT IN ('connected', 'rejected') 
          AND DATE(expected_completion_date) < CURRENT_DATE`;
        db.get(sql, [], (err, row) => {
          if (err) reject(err);
          resolve(row?.count || 0);
        });
      });

      if (delayedApps > 0) {
        alerts.push({
          type: 'warning',
          message: `${delayedApps} applications are delayed`,
          count: delayedApps
        });
      }

      // Pending approvals
      const pendingApprovals = await new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) as count FROM applications WHERE status = 'verified'`;
        db.get(sql, [], (err, row) => {
          if (err) reject(err);
          resolve(row?.count || 0);
        });
      });

      if (pendingApprovals > 0) {
        alerts.push({
          type: 'info',
          message: `${pendingApprovals} applications awaiting approval`,
          count: pendingApprovals
        });
      }

      res.status(200).json({
        success: true,
        alerts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = DashboardController;
