const StaffTask = require('../models/StaffTask');
const Application = require('../models/Application');

class StaffTaskController {
  // Get my tasks
  static async getMyTasks(req, res) {
    try {
      const staffId = req.user.id;

      const tasks = await StaffTask.findByStaffId(staffId);

      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get task by ID
  static async getTaskById(req, res) {
    try {
      const { id } = req.params;

      const task = await StaffTask.findById(id);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update task status
  static async updateTaskStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['assigned', 'accepted', 'on_the_way', 'in_progress', 'completed', 'verified'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }

      const task = await StaffTask.findById(id);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      await StaffTask.updateStatus(id, status);

      // Update application status based on task status
      if (status === 'completed') {
        await Application.updateStatus(task.application_id, 'installed');
      } else if (status === 'in_progress') {
        await Application.updateStatus(task.application_id, 'meter_scheduled');
      }

      res.status(200).json({
        success: true,
        message: 'Task status updated',
        data: { id, status }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update location (GPS)
  static async updateLocation(req, res) {
    try {
      const { id } = req.params;
      const { latitude, longitude } = req.body;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: 'Latitude and longitude required'
        });
      }

      const task = await StaffTask.findById(id);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      await StaffTask.updateLocation(id, latitude, longitude);

      res.status(200).json({
        success: true,
        message: 'Location updated',
        data: { id, latitude, longitude }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Upload task proof (photo/video)
  static async uploadProof(req, res) {
    try {
      const { id } = req.params;
      const { photo_url, video_url, notes } = req.body;

      if (!photo_url && !video_url) {
        return res.status(400).json({
          success: false,
          message: 'Photo or video proof required'
        });
      }

      const task = await StaffTask.findById(id);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // In a real app, you would store this in a separate table
      await StaffTask.completeTask(id, notes);

      res.status(200).json({
        success: true,
        message: 'Proof uploaded successfully',
        data: {
          id,
          photo_url,
          video_url,
          notes,
          status: 'completed'
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Complete task
  static async completeTask(req, res) {
    try {
      const { id } = req.params;
      const { notes, photo_url } = req.body;

      const task = await StaffTask.findById(id);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      if (!photo_url) {
        return res.status(400).json({
          success: false,
          message: 'Photo proof is required to complete task'
        });
      }

      await StaffTask.completeTask(id, notes);

      // Update application status
      await Application.updateStatus(task.application_id, 'installed');

      res.status(200).json({
        success: true,
        message: 'Task completed successfully',
        data: { id, status: 'completed' }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all pending tasks (Admin only)
  static async getPendingTasks(req, res) {
    try {
      const tasks = await StaffTask.getPendingTasks();

      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get task statistics (Admin only)
  static async getTaskStats(req, res) {
    try {
      const stats = await StaffTask.getTaskStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = StaffTaskController;
