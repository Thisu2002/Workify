const nodemailer = require('nodemailer');

// Create reusable transporter object using Gmail SMTP
const createTransporter = () => {
  // Validate email configuration
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration missing: EMAIL_USER and EMAIL_PASS must be set in .env file');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Format date for email display
const formatDate = (date) => {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

// Send interview invitation email to candidate
const sendInterviewInvitationEmail = async ({
  candidateEmail,
  candidateName,
  jobTitle,
  companyName,
  interviewDate,
  interviewRound
}) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${companyName} Recruitment" <${process.env.EMAIL_USER}>`,
      to: candidateEmail,
      subject: `Interview Invitation - ${jobTitle} at ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0a2048; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
            .details { background-color: white; padding: 20px; margin: 20px 0; border-left: 4px solid #0a2048; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #0a2048; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            h1 { margin: 0; }
            h2 { color: #0a2048; margin-top: 0; }
            .highlight { color: #0a2048; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Interview Invitation</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${candidateName}</strong>,</p>
              
              <p>Congratulations! We are pleased to inform you that you have been shortlisted for the <span class="highlight">${jobTitle}</span> position at <span class="highlight">${companyName}</span>.</p>
              
              <div class="details">
                <h2>Interview Details</h2>
                <p><strong>Position:</strong> ${jobTitle}</p>
                <p><strong>Company:</strong> ${companyName}</p>
                <p><strong>Interview Round:</strong> ${interviewRound}</p>
                <p><strong>Date & Time:</strong> ${formatDate(interviewDate)}</p>
              </div>
              
              <p>Please confirm your availability for the scheduled interview at your earliest convenience. We look forward to meeting you and discussing your qualifications further.</p>
              
              <p><strong>Important Notes:</strong></p>
              <ul>
                <li>Please arrive 10 minutes early (or join the online meeting 5 minutes before the scheduled time)</li>
                <li>Bring a copy of your resume and any relevant documents</li>
                <li>If you have any questions or need to reschedule, please contact us immediately</li>
              </ul>
              
              <p>Best of luck with your interview!</p>
              
              <p>Best regards,<br>
              <strong>${companyName} Recruitment Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated message from Workify Recruitment Platform.</p>
              <p>© ${new Date().getFullYear()} Workify. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${candidateEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send email to ${candidateEmail}:`, error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendInterviewInvitationEmail
};
