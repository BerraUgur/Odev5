require('dotenv').config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Email address is fetched from .env file
    pass: process.env.EMAIL_PASS, // Password is fetched from .env file
  },
});

const sendReminderEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Sender email address
      to,
      subject,
      text,
    });
    console.log('Email successfully sent to:', to);
  } catch (error) {
    console.error('Error occurred while sending email:', error);
  }
};

module.exports = { sendReminderEmail };