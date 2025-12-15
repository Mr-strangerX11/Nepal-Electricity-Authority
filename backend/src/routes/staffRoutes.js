const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Field staff endpoints
router.get('/tasks', authenticateToken, authorizeRole('field_staff'), (req, res) => {
  res.status(200).json({ message: 'Get field staff tasks' });
});

router.put('/tasks/:id', authenticateToken, authorizeRole('field_staff'), (req, res) => {
  res.status(200).json({ message: 'Update field staff task' });
});

module.exports = router;
