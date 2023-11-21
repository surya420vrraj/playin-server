const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const templatesDir = path.join(__dirname, "..", "views", "approvalStatus.ejs");
console.log("tamplate", templatesDir);
const fs = require("fs");

// // Load email templates
// const userCreatedTemplate = fs.readFileSync(
//   "templates/userCreated.ejs",
//   "utf-8"
// );
// const approvalStatusTemplate = fs.readFileSync(
//   "templates/approvalStatus.ejs",
//   "utf-8"
// );

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "surya2024dev@gmail.com",
    pass: "czlj uhcm tbwu dsfu",
  },
});

// Function to send email
async function sendEmail(toEmail, subject, template, data) {
  try {
    console.log(toEmail, subject, data, template);
    // Read the template file
    const emailTemplate = fs.readFileSync(templatesDir, "utf-8");

    // Render the email template with the provided data
    const renderedTemplate = ejs.render(emailTemplate, data);

    // Send the email
    const info = await transporter.sendMail({
      from: "surya2024dev@gmail.com",
      to: toEmail,
      subject: subject,
      html: renderedTemplate,
    });

    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = {
  sendEmail,
};
