const axios = require('axios');
require('dotenv').config();

class PaymentService {
  // Stripe Payment Integration
  static async initiateStripePayment(amount, currency = 'USD') {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
      });
      return { success: true, clientSecret: paymentIntent.client_secret };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // eSewa Payment Integration
  static async initiateEsewaPayment(amount, applicationId) {
    try {
      const esewaUrl = 'https://esewa.com.np/api/epay/main/v2/form';
      const data = {
        amt: amount,
        pdc: 0,
        psc: 0,
        txAmt: 0,
        tAmt: amount,
        pid: `APP-${applicationId}-${Date.now()}`,
        scd: process.env.ESEWA_MERCHANT_CODE,
        su: `${process.env.FRONTEND_URL}/payment-success`,
        fu: `${process.env.FRONTEND_URL}/payment-failed`,
      };
      
      return { success: true, url: esewaUrl, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Khalti Payment Integration
  static async initiateKhaltiPayment(amount, applicationId) {
    try {
      const khaltiUrl = 'https://khalti.com/api/payment/initiate/';
      const response = await axios.post(khaltiUrl, {
        public_key: process.env.KHALTI_PUBLIC_KEY,
        amount: Math.round(amount * 100),
        transaction_uuid: `APP-${applicationId}-${Date.now()}`,
        product_name: 'Electricity Connection',
        product_url: `${process.env.FRONTEND_URL}/tracker/${applicationId}`,
        return_url: `${process.env.FRONTEND_URL}/payment-success`,
      }, {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Verify Payment Status
  static async verifyPayment(transactionId, paymentMethod) {
    try {
      if (paymentMethod === 'stripe') {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const intent = await stripe.paymentIntents.retrieve(transactionId);
        return { success: true, status: intent.status };
      }
      // Add other payment methods verification here
      return { success: false, error: 'Unsupported payment method' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = PaymentService;
