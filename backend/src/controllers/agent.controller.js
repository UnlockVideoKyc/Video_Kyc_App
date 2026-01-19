const agentRepo = require("../repositories/agent.repo");

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
