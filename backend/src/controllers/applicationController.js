const Application = require('../models/Application');
const pool = require('../config/database');

class ApplicationController {
  static async createApplication(req, res) {
    try {
      const {
        connection_type, required_load, address, city,
        postal_code, latitude, longitude
      } = req.body;

      if (!connection_type || !required_load || !address || !city) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const applicationData = {
        user_id: req.user.id,
        connection_type,
        required_load,
        address,
        city,
        postal_code,
        latitude,
        longitude
      };

      const application = await Application.create(applicationData);

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        application
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getMyApplications(req, res) {
    try {
      const applications = await Application.findByUserId(req.user.id);
      res.status(200).json({
        success: true,
        applications
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getApplicationById(req, res) {
    try {
      const { id } = req.params;
      const application = await Application.findById(id);

      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      // Check authorization
      if (req.user.role === 'customer' && application.user_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      res.status(200).json({
        success: true,
        application
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateApplicationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const application = await Application.updateStatus(id, status);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      // Log status change
      await pool.query(
        'INSERT INTO status_history (application_id, old_status, new_status, changed_by) VALUES ($1, $2, $3, $4)',
        [id, application.status, status, req.user.id]
      );

      res.status(200).json({
        success: true,
        message: 'Application status updated',
        application
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllApplications(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const applications = await Application.getAll(limit, offset);
      res.status(200).json({
        success: true,
        applications
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = ApplicationController;
