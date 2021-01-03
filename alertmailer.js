const nodemailer = require("nodemailer");
const config = require('./config.json');

async function mail(subject, log) {
    const transporter = nodemailer.createTransport({
      service: config.mailer.service,
      port: 587,
      secure: true,
      auth: config.mailer.auth
    });

    const mailOptions = {
      from: config.mailer.auth.user,
      to: config.mailer.receivers.join(', '),
      subject: "Archillect Context Notification: " + subject,
      text:
      `
        SUBJECT: ${subject}.
        DATE: ${new Date().toUTCString()}
        LOG: ${log}
      `,
      html: 
      `
      <ul>
        <li><b>Subject</b>: ${subject}</li>
        <li><b>Date</b> ${new Date().toUTCString()}
        <li><b>Log</b>: <pre>${log}</pre>
      </ul>
      `
    }

    await transporter.sendMail(mailOptions);
  }
  exports.mail = mail;