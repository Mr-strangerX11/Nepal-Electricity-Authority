const Bill = require('../models/Bill');
const Application = require('../models/Application');

class BillingController {
  // Create a new bill
  static async createBill(req, res) {
    try {
      const { application_id, billing_period, usage_units, rate_per_unit, tax = 0 } = req.body;

      if (!application_id || !billing_period || !usage_units || !rate_per_unit) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      const application = await Application.findById(application_id);
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      const total_amount = usage_units * rate_per_unit;
      const final_amount = total_amount + tax;

      const bill = await Bill.create({
        application_id,
        billing_period,
        usage_units,
        rate_per_unit,
        total_amount: final_amount,
        tax,
        status: 'generated'
      });

      res.status(201).json({
        success: true,
        message: 'Bill created successfully',
        data: bill
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get bill by ID
  static async getBillById(req, res) {
    try {
      const { id } = req.params;

      const bill = await Bill.findById(id);
      if (!bill) {
        return res.status(404).json({
          success: false,
          message: 'Bill not found'
        });
      }

      res.status(200).json({
        success: true,
        data: bill
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get bills by application
  static async getBillsByApplication(req, res) {
    try {
      const { applicationId } = req.params;

      const bills = await Bill.findByApplicationId(applicationId);

      res.status(200).json({
        success: true,
        data: bills
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Mark bill as paid
  static async markBillAsPaid(req, res) {
    try {
      const { id } = req.params;
      const { payment_id } = req.body;

      const bill = await Bill.findById(id);
      if (!bill) {
        return res.status(404).json({
          success: false,
          message: 'Bill not found'
        });
      }

      await Bill.updateStatus(id, 'paid');

      res.status(200).json({
        success: true,
        message: 'Bill marked as paid',
        data: { id, status: 'paid', payment_id }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Estimate bill amount
  static async estimateBill(req, res) {
    try {
      const { usage_units, rate_per_unit, tax_percentage = 13 } = req.body;

      if (!usage_units || !rate_per_unit) {
        return res.status(400).json({
          success: false,
          message: 'Usage units and rate required'
        });
      }

      const subtotal = usage_units * rate_per_unit;
      const tax = (subtotal * tax_percentage) / 100;
      const total = subtotal + tax;

      res.status(200).json({
        success: true,
        data: {
          usage_units,
          rate_per_unit,
          subtotal,
          tax_percentage,
          tax,
          total,
          breakdown: {
            usage_charge: subtotal,
            tax_amount: tax,
            total_payable: total
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get billing summary
  static async getBillingSummary(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const summary = await Bill.getSummary({ startDate, endDate });

      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Apply late fee
  static async applyLateFee(req, res) {
    try {
      const { id } = req.params;
      const { late_fee_percentage = 5, max_fee = 5000 } = req.body;

      const bill = await Bill.findById(id);
      if (!bill) {
        return res.status(404).json({
          success: false,
          message: 'Bill not found'
        });
      }

      if (bill.status === 'paid') {
        return res.status(400).json({
          success: false,
          message: 'Cannot apply late fee to paid bills'
        });
      }

      const calculatedFee = Math.min((bill.total_amount * late_fee_percentage) / 100, max_fee);

      await Bill.applyLateFee(id, calculatedFee);

      res.status(200).json({
        success: true,
        message: 'Late fee applied',
        data: {
          id,
          late_fee_applied: calculatedFee,
          new_total: bill.total_amount + calculatedFee
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = BillingController;
