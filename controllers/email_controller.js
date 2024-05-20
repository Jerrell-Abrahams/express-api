import nodemailer from "nodemailer";

export { sendEmail };

// Set up for Emailing
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "jerrellabrahams50@gmail.com",
    pass: "zcbtzwgcghnzqvgt", // App password from Gmail
  },
});

// Sends email to user
async function sendEmail(email, title, subject, text, attachment, cc) {
  const info = await transporter.sendMail({
    from: "Jerrell's Autobahn <jerrellabrahams50@gmail.com>", // sender address
    to: cc ? [cc, email] : email, // list of receivers
    subject: subject || "no-reply",
    text: text,
    attachments: {
      filename: title + ".pdf",
      content: attachment,
    },
  });
  if (info.response.includes("OK")) {
    return `Email was sent to ${email}`;
  } else {
    return "Email was not sent.";
  }
}
