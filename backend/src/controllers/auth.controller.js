const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

/* =========================
   LOGIN
========================= */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const errors = [];
  if (!email) errors.push({ field: "email", message: "Email is required" });
  if (!password) errors.push({ field: "password", message: "Password is required" });

  if (errors.length) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const data = await authService.login({ email, password });

  res.status(200).json(
    new ApiResponse("Login successful", data)
  );
});

/* =========================
   VERIFY OTP
========================= */
exports.verifyOtp = asyncHandler(async (req, res) => {
  const { agtLoginId, otp } = req.body;

  const errors = [];
  if (!agtLoginId) {
    errors.push({ field: "agtLoginId", message: "Agent Login ID is required" });
  }
  if (!otp) {
    errors.push({ field: "otp", message: "OTP is required" });
  }

  if (errors.length) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const data = await authService.verifyOtp({ agtLoginId, otp });

  res.status(200).json(
    new ApiResponse("OTP verified successfully", data)
  );
});

/* =========================
   RESEND OTP
========================= */
exports.resendOtp = asyncHandler(async (req, res) => {
  const { agtLoginId, purpose } = req.body;

  const errors = [];
  if (!agtLoginId) {
    errors.push({ field: "agtLoginId", message: "Agent Login ID is required" });
  }
  if (!purpose) {
    errors.push({ field: "purpose", message: "Purpose is required" });
  }

  if (errors.length) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const data = await authService.resendOtp({ agtLoginId, purpose });

  res.status(200).json(
    new ApiResponse("OTP resent successfully", data)
  );
});

/* =========================
   FORGOT PASSWORD
========================= */
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email, dob } = req.body;

  const errors = [];
  if (!email) errors.push({ field: "email", message: "Email is required" });
  if (!dob) errors.push({ field: "dob", message: "Date of birth is required" });

  if (errors.length) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const data = await authService.forgotPassword({ email, dob });

  res.status(200).json(
    new ApiResponse("OTP sent for password reset", data)
  );
});

/* =========================
   VERIFY FORGOT OTP
========================= */
exports.verifyForgotOtp = asyncHandler(async (req, res) => {
  const { agtLoginId, otp } = req.body;

  const errors = [];
  if (!agtLoginId) {
    errors.push({ field: "agtLoginId", message: "Agent Login ID is required" });
  }
  if (!otp) {
    errors.push({ field: "otp", message: "OTP is required" });
  }

  if (errors.length) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const data = await authService.verifyForgotOtp({ agtLoginId, otp });

  res.status(200).json(
    new ApiResponse("Forgot OTP verified successfully", data)
  );
});

/* =========================
   RESET PASSWORD
========================= */
exports.resetPassword = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Reset token is required");
  }

  const resetToken = authHeader.split(" ")[1];
  const { newPassword } = req.body;

  if (!newPassword) {
    throw new ApiError(400, "New password is required");
  }

  await authService.resetPassword(resetToken, newPassword);

  res.status(200).json(
    new ApiResponse("Password reset successful")
  );
});

/* =========================
   HASH PASSWORD (DEV ONLY)
========================= */
exports.hashPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const hashedPassword = await authService.hashPassword(password);

  res.status(200).json(
    new ApiResponse("Password hashed successfully", { hashedPassword })
  );
});
