const express = require('express');
const router = express.Router();
const BillingController = require('../controllers/billingController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes (require authentication)
router.post('/', authenticateToken, BillingController.createBill);
router.get('/summary', authenticateToken, BillingController.getBillingSummary);
router.get('/:id', authenticateToken, BillingController.getBillById);
router.get('/application/:applicationId', authenticateToken, BillingController.getBillsByApplication);
router.post('/:id/pay', authenticateToken, BillingController.markBillAsPaid);
router.post('/estimate', BillingController.estimateBill);
router.post('/:id/late-fee', BillingController.applyLateFee);

module.exports = router;
