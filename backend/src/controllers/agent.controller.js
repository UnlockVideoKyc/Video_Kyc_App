const authService = require("../services/auth.service");
const agentRepo = require("../repositories/agent.repo");

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new password required" });
    }

    // ✅ correct: take agtLoginId from req.user
    const { agtLoginId } = req.user;

    const agent = await agentRepo.findByAgtLoginId(agtLoginId);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    const isValid = await authService.comparePassword(
      oldPassword,
      agent.AgtPassword
    );
    if (!isValid) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await authService.hashPassword(newPassword);

    // ✅ FIX HERE
    await agentRepo.updatePassword(agtLoginId, hashedPassword);

    await require("../utils/mailer")
      .sendPasswordResetConfirmation(agent.Email);

    return res.json({ message: "Password changed successfully" });

  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // ✅ FIX HERE
    const { agtLoginId } = req.user;

    const agent = await agentRepo.findByAgtLoginId(agtLoginId);

    if (!agent)
      return res.status(404).json({ message: "Agent not found" });

    return res.json({
      agentName: agent.AgentName,
      email: agent.Email,
      agtLoginId: agent.AgtLoginId,
    });

  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
