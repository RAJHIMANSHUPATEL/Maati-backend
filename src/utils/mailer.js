const nodemailer = require("nodemailer");

const emailUser = process.env.EMAIL_USER || process.env.MAIL_ID;
const emailPass = process.env.EMAIL_PASS || process.env.MAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 465),
  secure: true,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

const fromAddress = () =>
  `Maati <${emailUser || "noreply@localhost"}>`;

module.exports = { transporter, fromAddress, emailUser };
