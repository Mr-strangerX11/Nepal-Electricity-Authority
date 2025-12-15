const axios = require('axios');
require('dotenv').config();

class NotificationService {
  // Send SMS via Twilio
  static async sendSMS(phoneNumber, message) {
    try {
      const twilio = require('twilio');
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      
      const result = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
      
      return { success: true, messageSid: result.sid };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Send Email via SendGrid
  static async sendEmail(email, subject, htmlContent) {
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      const msg = {
        to: email,
        from: 'noreply@nea-electricity.gov.np',
        subject: subject,
        html: htmlContent,
      };
      
      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Notification Templates
  static getApplicationTemplate(application, status) {
    const templates = {
      submitted: {
        subject: 'Electricity Connection Application Received',
        text: `Your application #${application.id} has been received. We will verify your documents and notify you soon.`,
        html: `<p>Your application <strong>#${application.id}</strong> has been received.</p><p>We will verify your documents and notify you soon.</p>`
      },
      verified: {
        subject: 'Documents Verified',
        text: `Your documents have been verified. Your application is now under review.`,
        html: `<p>Your documents have been verified.</p><p>Your application is now under review.</p>`
      },
      approved: {
        subject: 'Application Approved',
        text: `Congratulations! Your application #${application.id} has been approved. Meter installation will be scheduled soon.`,
        html: `<p>Congratulations! Your application <strong>#${application.id}</strong> has been approved.</p><p>Meter installation will be scheduled soon.</p>`
      },
      rejected: {
        subject: 'Application Rejected',
        text: `We regret to inform you that your application could not be approved. Please contact support for more details.`,
        html: `<p>We regret to inform you that your application could not be approved.</p><p>Please contact support for more details.</p>`
      },
      connected: {
        subject: 'Connection Activated',
        text: `Your electricity connection is now active! Your meter number is ${application.meter_serial_number}.`,
        html: `<p>Your electricity connection is now active!</p><p>Meter Number: <strong>${application.meter_serial_number}</strong></p>`
      }
    };
    
    return templates[status] || templates.submitted;
  }

  // Save notification to database
  static async saveNotification(pool, userId, applicationId, type, subject, message) {
    try {
      await pool.query(
        'INSERT INTO notifications (user_id, application_id, type, subject, message) VALUES ($1, $2, $3, $4, $5)',
        [userId, applicationId, type, subject, message]
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = NotificationService;
