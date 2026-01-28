const authService = require("../services/auth.service");
const agentRepo = require("../repositories/agent.repo");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const mailer = require("../utils/mailer");

/* =========================
   CHANGE PASSWORD
========================= */
exports.changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new password are required");
  }

  // Get agent using JWT login ID
  const agent = await agentRepo.findByAgtLoginId(req.agtLoginId);
  if (!agent) {
    throw new ApiError(404, "Agent not found");
  }

  // Validate old password
  const isValid = await authService.comparePassword(
    oldPassword,
    agent.AgtPassword
  );

  if (!isValid) {
    throw new ApiError(401, "Old password is incorrect");
  }

  // Hash & update new password
  const hashedPassword = await authService.hashPassword(newPassword);
  await agentRepo.updatePassword(req.agtLoginId, hashedPassword);

  // Email confirmation
  await mailer.sendPasswordResetConfirmation(agent.Email);

  res.status(200).json(
    new ApiResponse("Password changed successfully")
  );
});

/* =========================
   GET PROFILE
========================= */
exports.getProfile = asyncHandler(async (req, res) => {
  const agent = await agentRepo.findByAgtLoginId(req.agtLoginId);

  if (!agent) {
    throw new ApiError(404, "Agent not found");
  }

  res.status(200).json(
    new ApiResponse("Profile fetched successfully", {
      agentName: agent.AgentName,
      email: agent.Email,
      agtLoginId: agent.AgtLoginId,
    })
  );
});
