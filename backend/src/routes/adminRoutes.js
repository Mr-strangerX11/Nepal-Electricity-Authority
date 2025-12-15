const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Admin endpoints
router.get('/dashboard', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.status(200).json({ message: 'Admin dashboard' });
});

router.get('/applications', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.status(200).json({ message: 'All applications' });
});

router.post('/assign-staff', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.status(200).json({ message: 'Assign staff to application' });
});

module.exports = router;
