const db = require("../config/db");

// In agent.repo.js, update the findByAgtLoginId function:
exports.findByAgtLoginId = async (agtLoginId) => {
  const [rows] = await db.query(
    `SELECT 
       al.AgtLoginId, 
       al.AgtPassword, 
       al.IsActive,
       ad.AgentId,
       ad.Email,
       ad.AgentName
     FROM AgentLogin al
     LEFT JOIN AgentsDetails ad ON al.AgtLoginId = ad.AgtLoginId
     WHERE al.AgtLoginId = ?`,
    [agtLoginId]
  );
  return rows[0];
};


exports.findByEmail = async (email) => {
  const [rows] = await db.query(
    `SELECT a.AgentId, a.AgentName, a.Email, a.Dob, al.AgtLoginId, al.AgtPassword, al.IsActive 
     FROM AgentsDetails a 
     JOIN AgentLogin al ON a.AgtLoginId = al.AgtLoginId 
     WHERE a.Email = ?`,
    [email]
  );
  return rows[0];
};

// In agent.repo.js, update findById to handle both:
exports.findById = async (id) => {
  // Try to find by AgtLoginId first (since that's what's being passed)
  const [rows] = await db.query(
    `SELECT a.AgentId, a.AgentName, a.Email, a.Dob, al.AgtLoginId 
     FROM AgentsDetails a 
     JOIN AgentLogin al ON a.AgtLoginId = al.AgtLoginId 
     WHERE al.AgtLoginId = ?`,
    [id]
  );
  
  if (rows.length > 0) {
    return rows[0];
  }
  
  // If not found by AgtLoginId, try AgentId
  const [rows2] = await db.query(
    `SELECT AgentId, AgentName, Email, Dob, AgtLoginId FROM AgentsDetails WHERE AgentId = ?`,
    [id]
  );
  
  return rows2[0];
};

exports.updatePassword = async (agtLoginId, password) => {
  await db.query(
    `UPDATE AgentLogin SET AgtPassword = ?, UpdatedOn = NOW() WHERE AgtLoginId = ?`,
    [password, agtLoginId]
  );
};

exports.findByAgentUserId = async (agentUserId) => {
  const [rows] = await db.query(
    `SELECT a.AgentId, a.AgentName, a.Email, a.Dob, al.AgtLoginId, al.AgtPassword, al.IsActive 
     FROM AgentsDetails a 
     JOIN AgentLogin al ON a.AgtLoginId = al.AgtLoginId 
     WHERE a.AgentUserId = ?`,
    [agentUserId]
  );
  return rows[0];
};