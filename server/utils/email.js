const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({ from: '"ScholarHub" <noreply@scholarhub.ac.za>', to, subject, html });
    console.log('📧 Email sent to', to);
  } catch (err) { console.error('Email error:', err.message); }
};
const templates = {
  welcome: (name) => ({ subject: 'Welcome to ScholarHub', html: `<h2>Hi ${name},</h2><p>Welcome to ScholarHub!</p>` }),
  applicationSubmitted: (name, scholarship) => ({ subject: `Application Submitted - ${scholarship}`, html: `<h2>Hi ${name},</h2><p>Your application for <strong>${scholarship}</strong> has been submitted.</p>` }),
  applicationApproved: (name, scholarship) => ({ subject: 'Application Approved! 🎉', html: `<h2>Congratulations ${name}!</h2><p>Your application for <strong>${scholarship}</strong> has been <span style="color:green"><strong>APPROVED</strong></span>.</p>` }),
  applicationRejected: (name, scholarship) => ({ subject: 'Application Update', html: `<h2>Hi ${name},</h2><p>Your application for <strong>${scholarship}</strong> was not successful.</p>` })
};
module.exports = { sendEmail, templates };