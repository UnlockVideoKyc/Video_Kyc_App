const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const agentRepo = require("../repositories/agent.repo");
const otpRepo = require("../repositories/otp.repo");
const mailer = require("../utils/mailer");
const { generateOTP } = require("../utils/otp");

exports.login = async ({ email, password }) => {
  const agent = await agentRepo.findByEmail(email);
  
  if (!agent) {
    throw new Error("Agent not found with this email");
  }
  
  if (!agent.IsActive) {
    throw new Error("Agent account is inactive");
  }

  // Compare password
  const match = await bcrypt.compare(password, agent.AgtPassword);
  if (!match) {
    throw new Error("Invalid password");
  }

  // Generate and send OTP
 const otp = generateOTP();
await otpRepo.create(agent.AgtLoginId, otp, 'LOGIN');

  await mailer.sendOTP(agent.Email, otp);

  return { 
    message: "OTP sent to your registered email", 
    agtLoginId: agent.AgtLoginId,
    agentId: agent.AgentId 
  };
};
exports.verifyOtp = async ({ agtLoginId, otp }) => {
  const valid = await otpRepo.verify(agtLoginId, otp, 'LOGIN');

  
  if (!valid) {
    throw new Error("Invalid or expired OTP");
  }

  const token = jwt.sign(
    { agtLoginId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { 
    message: "Login successful", 
    token 
  };
};

exports.resendOtp = async ({ agtLoginId, purpose }) => {
  if (!purpose) throw new Error("OTP purpose required");

  await otpRepo.invalidateAll(agtLoginId, purpose);

  const otp = generateOTP();
  await otpRepo.create(agtLoginId, otp, purpose);

  const agent = await agentRepo.findByAgtLoginId(agtLoginId);
  if (!agent) throw new Error("Agent not found");

  await mailer.sendOTP(agent.Email, otp);

  const expiry = await otpRepo.getLatestExpiry(agtLoginId, purpose);

  return {
    message: "New OTP sent",
    expiresAt: expiry
  };
};

exports.forgotPassword = async ({ email, dob }) => {
  const agent = await agentRepo.findByEmail(email);
  
  if (!agent) {
    throw new Error("Agent not found with this email");
  }

  // Compare dates
  const frontendDate = new Date(dob);
  const dbDate = new Date(agent.Dob);
  
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const frontendFormatted = formatDate(frontendDate);
  const dbFormatted = formatDate(dbDate);

  if (frontendFormatted !== dbFormatted) {
    throw new Error("Invalid Date of Birth");
  }

  const otp = generateOTP();
await otpRepo.create(agent.AgtLoginId, otp, 'FORGOT');

  await mailer.sendOTP(email, otp);
  
  const expiry = await otpRepo.getLatestExpiry(agent.AgtLoginId, 'FORGOT');

  
  return { 
    message: "OTP sent to registered email", 
    agtLoginId: agent.AgtLoginId, 
    expiresAt: expiry 
  };
};
exports.verifyForgotOtp = async ({ agtLoginId, otp }) => {
const valid = await otpRepo.verify(agtLoginId, otp, 'FORGOT');
  if (!valid) {
    throw new Error("Invalid or expired OTP");
  }

  const resetToken = jwt.sign(
    { agtLoginId },
    process.env.RESET_PASSWORD_SECRET,
    { expiresIn: "10m" }
  );

  return { resetToken };
};

exports.resetPassword = async (resetToken, newPassword) => {
  let decoded;
  
  try {
    decoded = jwt.verify(resetToken, process.env.RESET_PASSWORD_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await agentRepo.updatePassword(decoded.agtLoginId, hashedPassword);

  const agent = await agentRepo.findByAgtLoginId(decoded.agtLoginId);
  await mailer.sendPasswordResetConfirmation(agent.Email);

  return { message: "Password reset successful" };
};

exports.hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, 10);
};