const express = require('express');
const router = express.Router();
const StaffTaskController = require('../controllers/staffTaskController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Staff routes
router.get('/', authenticateToken, StaffTaskController.getMyTasks);
router.get('/:id', authenticateToken, StaffTaskController.getTaskById);
router.put('/:id/status', authenticateToken, StaffTaskController.updateTaskStatus);
router.put('/:id/location', authenticateToken, StaffTaskController.updateLocation);
router.post('/:id/proof', authenticateToken, StaffTaskController.uploadProof);
router.post('/:id/complete', authenticateToken, StaffTaskController.completeTask);

// Admin routes
router.get('/admin/pending', authenticateToken, StaffTaskController.getPendingTasks);
router.get('/admin/stats', authenticateToken, StaffTaskController.getTaskStats);

module.exports = router;
