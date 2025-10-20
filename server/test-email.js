require('dotenv').config();
const { sendInterviewInvitationEmail } = require('./utils/emailService');

const testEmail = process.argv[2] || 'test@example.com';

console.log('🧪 Testing Email Configuration...\n');
console.log('Configuration:');
console.log(`  EMAIL_USER: ${process.env.EMAIL_USER || '❌ NOT SET'}`);
console.log(`  EMAIL_PASS: ${process.env.EMAIL_PASS ? '✓ SET (hidden)' : '❌ NOT SET'}`);
console.log(`  Test recipient: ${testEmail}\n`);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ ERROR: Email configuration missing!');
  console.error('Please set EMAIL_USER and EMAIL_PASS in your .env file\n');
  process.exit(1);
}

console.log('📧 Sending test email...\n');

sendInterviewInvitationEmail({
  candidateEmail: testEmail,
  candidateName: 'John Doe',
  jobTitle: 'Senior Software Engineer',
  companyName: 'Tech Solutions Inc.',
  interviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  interviewRound: 'Round 1'
})
  .then(result => {
    if (result.success) {
      console.log('✅ SUCCESS! Email sent successfully!');
      console.log(`Message ID: ${result.messageId}`);
      console.log(`\nCheck the inbox at: ${testEmail}`);
      console.log('(Don\'t forget to check spam/junk folder)\n');
    } else {
      console.error('❌ FAILED to send email');
      console.error(`Error: ${result.error}\n`);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ ERROR occurred:', error.message);
    console.error('\nCommon issues:');
    console.error('1. Invalid Gmail credentials');
    console.error('2. App Password not generated correctly');
    console.error('3. 2-Step Verification not enabled on Gmail');
    console.error('4. Network connectivity issues\n');
    process.exit(1);
  });
