const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/user.repo");
const otpRepo = require("../repositories/otp.repo");
const mailer = require("../utils/mailer");
const { generateOTP } = require("../utils/otp");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userRepo.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const otp = generateOTP();
    await otpRepo.create(user.id, otp);
    await mailer.sendOTP(email, otp);

    const expiry = await otpRepo.getLatestExpiry(user.id);
    
    return res.json({ 
      message: "OTP sent", 
      userId: user.id,
      expiresAt: expiry
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const valid = await otpRepo.verify(userId, otp);
    if (!valid) return res.status(400).json({ message: "Invalid or expired OTP" });

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    await otpRepo.invalidateAll(userId);

    const otp = generateOTP();
    await otpRepo.create(userId, otp);

    const user = await userRepo.findById(userId);
    await mailer.sendOTP(user.email, otp);

    const expiry = await otpRepo.getLatestExpiry(userId);
    
    return res.json({ 
      message: "New OTP sent", 
      expiresAt: expiry 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, dob } = req.body;

    const user = await userRepo.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Frontend DOB:", dob);
    console.log("DB Date object:", user.date_of_birth);
    
    // Convert both dates to local date strings (ignoring timezone)
    const frontendDate = new Date(dob);
    const dbDate = new Date(user.date_of_birth);
    
    // Format to YYYY-MM-DD in local timezone
    const formatLocalDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const frontendLocal = formatLocalDate(frontendDate);
    const dbLocal = formatLocalDate(dbDate);
    
    console.log("Frontend (local):", frontendLocal);
    console.log("DB Date (local):", dbLocal);
    console.log("Match:", frontendLocal === dbLocal);

    if (frontendLocal !== dbLocal) {
      return res.status(400).json({ message: "Invalid Date of Birth" });
    }

    // Generate OTP
    const otp = generateOTP();
    await otpRepo.create(user.id, otp);
    await mailer.sendOTP(email, otp);

    const expiry = await otpRepo.getLatestExpiry(user.id);

    return res.json({
      message: "OTP sent to registered email",
      userId: user.id,
      expiresAt: expiry
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.verifyForgotOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const valid = await otpRepo.verify(userId, otp);
    if (!valid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // ✅ CHANGE THIS PART
    const resetToken = jwt.sign(
      { userId },
      process.env.RESET_PASSWORD_SECRET,
      { expiresIn: "10m" }
    );

    return res.json({ resetToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Reset token missing" });
    }

    // ✅ CHANGE THIS LINE
    const decoded = jwt.verify(
      token,
      process.env.RESET_PASSWORD_SECRET
    );

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    await userRepo.updatePassword(decoded.userId, hashedPassword);

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid reset token" });
  }
};
