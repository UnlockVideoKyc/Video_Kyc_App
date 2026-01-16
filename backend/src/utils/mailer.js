const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

exports.sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"DigiKhata" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your Login OTP",
    text: `Your OTP is ${otp}. It expires in 100 seconds.`,
  });
};


