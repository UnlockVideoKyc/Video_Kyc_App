const db = require("../config/db");


exports.findByEmail = async (email) => {
  const [rows] = await db.query(
    `
    SELECT
      ad.AgentId AS id,
      ad.AgentName AS name,
      ad.Email AS email,
      al.AgtPassword AS password,
      r.RoleName AS role
    FROM AgentsDetails ad
    JOIN AgentLogin al ON ad.AgtLoginId = al.AgtLoginId
    JOIN Roles r ON al.RoleId = r.RoleId
    WHERE ad.Email = ?
      AND al.IsActive = true
    `,
    [email]
  );

  return rows[0]; // undefined if not found
};

exports.findById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
};

