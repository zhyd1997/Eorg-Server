const nodemailer = require("nodemailer");

const sendEmail = async (config, message) => {
  const transporter = nodemailer.createTransport(config);

  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
