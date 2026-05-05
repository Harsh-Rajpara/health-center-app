// components/EmailButton.jsx
const EmailButton = ({ appointment, type, onSuccess }) => {
  const generateEmailContent = () => {
    if (type === 'approve') {
      return {
        subject: `✅ Appointment Approved - ${appointment.fullName}`,
        body: `
Dear ${appointment.fullName},

Your appointment has been APPROVED!

Date: ${appointment.date}
Time: ${appointment.time}

Please arrive 15 minutes early.

Best regards,
Health Center
        `.trim()
      };
    } else {
      return {
        subject: `❌ Appointment Rejected - ${appointment.fullName}`,
        body: `
Dear ${appointment.fullName},

Your appointment has been REJECTED.

Date: ${appointment.date}
Time: ${appointment.time}

Please book a new appointment.

Best regards,
Health Center
        `.trim()
      };
    }
  };

  const copyToClipboard = () => {
    const content = generateEmailContent();
    const fullEmail = `To: ${appointment.email}\nSubject: ${content.subject}\n\n${content.body}`;
    navigator.clipboard.writeText(fullEmail);
    alert('✉️ Email copied! Paste in your email client.');
    onSuccess();
  };

  return (
    <button onClick={copyToClipboard} className="px-3 py-1 bg-blue-500 text-white rounded">
      Copy Email
    </button>
  );
};