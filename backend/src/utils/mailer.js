const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your DigiKhata Login OTP",
      html: `<h2>Your OTP is: ${otp}</h2><p>This OTP is valid for 10 minutes.</p>`,
    });
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

const sendPasswordResetConfirmation = async (email) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Successful - DigiKhata",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Successful</h2>
          <p>Hello,</p>
          <p>Your DigiKhata password has been successfully reset.</p>
          <p>If you did not request this change, please contact our support team immediately.</p>
          <br>
          <p>Best regards,<br>DigiKhata Team</p>
          <hr style="border: none; border-top: 1px solid #eee;">
          <p style="color: #777; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    });
    console.log(`Password reset confirmation email sent to ${email}`);
  } catch (error) {
    console.error("Error sending password reset confirmation email:", error);
    throw error;
  }
};

module.exports = {
  sendOTP,
  sendPasswordResetConfirmation
};