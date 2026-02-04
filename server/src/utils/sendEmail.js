// ================= IMPORTS =================

// Import nodemailer using ES module syntax
import nodemailer from 'nodemailer';


// ================= SEND EMAIL FUNCTION =================
//
// This function sends an email using Nodemailer.
// It is async because sending emails involves network operations.
//
const sendEmail = async (options) => {

  // ================= CREATE TRANSPORTER =================
  //
  // The transporter defines HOW the email will be sent:
  // - Which SMTP server
  // - Which port
  // - Authentication credentials
  //
  const transporter = nodemailer.createTransport({

    // SMTP server hostname (from .env)
    host: process.env.EMAIL_HOST,

    // SMTP port number
    // 587 → TLS (recommended)
    // 465 → SSL
    port: process.env.EMAIL_PORT,

    // Authentication details
    auth: {
      user: process.env.EMAIL_USER,        // Email username
      pass: process.env.EMAIL_PASSWORD     // Email password / app password
    }
  });


  // ================= EMAIL OPTIONS =================
  //
  // Defines the content and metadata of the email
  //
  const mailOptions = {

    // Sender address (what user sees in inbox)
    from: process.env.EMAIL_FROM,

    // Recipient email (passed dynamically)
    to: options.email,

    // Email subject line
    subject: options.subject,

    // Email body (HTML format)
    html: options.html
  };


  // ================= SEND EMAIL =================
  //
  // Actually sends the email
  //
  const info = await transporter.sendMail(mailOptions);

  // Log message ID (useful for debugging)
  console.log('Email sent successfully:', info.messageId);
};


// ================= EXPORT =================
//
// Export the function so it can be used elsewhere
//
export default sendEmail;
