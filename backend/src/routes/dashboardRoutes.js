const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Admin dashboard routes
router.get('/summary', authenticateToken, authorizeRole(['admin']), DashboardController.getDashboardSummary);
router.get('/alerts', authenticateToken, authorizeRole(['admin']), DashboardController.getSystemAlerts);
router.get('/applications', authenticateToken, authorizeRole(['admin']), DashboardController.getAllApplications);
router.post('/applications/:id/approve', authenticateToken, authorizeRole(['admin']), DashboardController.approveApplication);
router.post('/applications/:id/reject', authenticateToken, authorizeRole(['admin']), DashboardController.rejectApplication);
router.post('/applications/:id/assign-staff', authenticateToken, authorizeRole(['admin']), DashboardController.assignStaffToTask);
router.get('/reports/:reportType', authenticateToken, authorizeRole(['admin']), DashboardController.generateReport);

module.exports = router;
