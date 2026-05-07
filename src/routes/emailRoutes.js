const express = require('express');
const router = express.Router();
const { sendAppointmentEmail, generateApprovalEmailHTML } = require('../services/emailService');

router.post('/send-appointment-email', async (req, res) => {
  try {
    const { appointment, type, message, reason } = req.body;
    
    let subject, htmlContent, textContent;
    
    if (type === 'approved') {
      subject = `✅ Appointment Approved - Health Center`;
      htmlContent = generateApprovalEmailHTML(appointment, message);
      textContent = `Your appointment has been approved for ${appointment.date} at ${appointment.time}`;
    } else if (type === 'rejected') {
      subject = `❌ Appointment Update - Health Center`;
      htmlContent = generateRejectionEmailHTML(appointment, reason);
      textContent = `Your appointment has been rejected. Reason: ${reason}`;
    }
    
    const result = await sendAppointmentEmail(appointment.email, subject, htmlContent, textContent);
    
    if (result.success) {
      res.status(200).json({ success: true, message: 'Email sent successfully' });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;