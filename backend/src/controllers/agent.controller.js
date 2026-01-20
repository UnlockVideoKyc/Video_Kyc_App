

const authService = require("../services/auth.service");
const agentRepo = require("../repositories/agent.repo");

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new password required" });
    }

    // Get agent details using JWT login ID
    const agent = await agentRepo.findByAgtLoginId(req.agtLoginId);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Check old password
    const isValid = await authService.comparePassword(oldPassword, agent.AgtPassword);
    if (!isValid) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await authService.hashPassword(newPassword);

    // Update password
    await agentRepo.updatePassword(req.agtLoginId, hashedPassword);

    // Send email confirmation
    await require("../utils/mailer").sendPasswordResetConfirmation(agent.Email);

    return res.json({ message: "Password changed successfully" });

  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const agent = await agentRepo.findByAgtLoginId(req.agtLoginId);

    if (!agent)
      return res.status(404).json({ message: "Agent not found" });

    return res.json({
      agentName: agent.AgentName,
      email: agent.Email,
      agtLoginId: agent.AgtLoginId,
    });

  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
