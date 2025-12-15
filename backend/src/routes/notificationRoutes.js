const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Notification endpoints
router.get('/', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Get notifications' });
});

router.put('/:id/read', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Mark notification as read' });
});

module.exports = router;
