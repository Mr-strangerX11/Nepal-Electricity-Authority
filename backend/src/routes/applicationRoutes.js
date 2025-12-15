const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/applicationController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRole('customer'), ApplicationController.createApplication);
router.get('/my-applications', authenticateToken, authorizeRole('customer'), ApplicationController.getMyApplications);
router.get('/:id', authenticateToken, ApplicationController.getApplicationById);
router.put('/:id/status', authenticateToken, authorizeRole('admin', 'field_staff'), ApplicationController.updateApplicationStatus);
router.get('/', authenticateToken, authorizeRole('admin'), ApplicationController.getAllApplications);

module.exports = router;
