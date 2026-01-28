const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const agentRepo = require("../repositories/agent.repo");
const otpRepo = require("../repositories/otp.repo");
const mailer = require("../utils/mailer");
const { generateOTP } = require("../utils/otp");
const ApiError = require("../utils/ApiError"); 

exports.login = async ({ email, password }) => {
  const agent = await agentRepo.findByEmail(email);

  if (!agent) {
    throw new ApiError(404, "Agent not found with this email");
  }

  if (!agent.IsActive) {
    throw new ApiError(403, "Agent account is inactive");
  }

  const match = await bcrypt.compare(password, agent.AgtPassword);
  if (!match) {
    throw new ApiError(401, "Invalid password");
  }

  const otp = generateOTP();
  await otpRepo.create(agent.AgtLoginId, otp, "LOGIN");
  await mailer.sendOTP(agent.Email, otp);

  return {
    message: "OTP sent to your registered email",
    agtLoginId: agent.AgtLoginId,
    agentId: agent.AgentId,
  };
};

exports.verifyOtp = async ({ agtLoginId, otp }) => {
  const valid = await otpRepo.verify(agtLoginId, otp, "LOGIN");

  if (!valid) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  const token = jwt.sign(
    { agtLoginId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    message: "Login successful",
    token,
  };
};

exports.resendOtp = async ({ agtLoginId, purpose }) => {
  if (!purpose) {
    throw new ApiError(400, "OTP purpose required");
  }

  await otpRepo.invalidateAll(agtLoginId, purpose);

  const otp = generateOTP();
  await otpRepo.create(agtLoginId, otp, purpose);

  const agent = await agentRepo.findByAgtLoginId(agtLoginId);
  if (!agent) {
    throw new ApiError(404, "Agent not found");
  }

  await mailer.sendOTP(agent.Email, otp);

  const expiry = await otpRepo.getLatestExpiry(agtLoginId, purpose);

  return {
    message: "New OTP sent",
    expiresAt: expiry,
  };
};

exports.forgotPassword = async ({ email, dob }) => {
  const agent = await agentRepo.findByEmail(email);

  if (!agent) {
    throw new ApiError(404, "Agent not found with this email");
  }

  const frontendDate = new Date(dob);
  const dbDate = new Date(agent.Dob);

  const formatDate = (date) => date.toISOString().split("T")[0];

  if (formatDate(frontendDate) !== formatDate(dbDate)) {
    throw new ApiError(400, "Invalid Date of Birth");
  }

  const otp = generateOTP();
  await otpRepo.create(agent.AgtLoginId, otp, "FORGOT");

  await mailer.sendOTP(email, otp);

  const expiry = await otpRepo.getLatestExpiry(agent.AgtLoginId, "FORGOT");

  return {
    message: "OTP sent to registered email",
    agtLoginId: agent.AgtLoginId,
    expiresAt: expiry,
  };
};

exports.verifyForgotOtp = async ({ agtLoginId, otp }) => {
  const valid = await otpRepo.verify(agtLoginId, otp, "FORGOT");

  if (!valid) {
    throw new ApiError(400, "Invalid or expired OTP");
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
    decoded = jwt.verify(
      resetToken,
      process.env.RESET_PASSWORD_SECRET
    );
  } catch {
    throw new ApiError(401, "Invalid or expired reset token");
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

exports.comparePassword = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};
