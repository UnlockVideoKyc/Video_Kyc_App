const db = require("../config/db");

exports.findByEmail = async (email) => {
  const [rows] = await db.query(
    `
    SELECT 
      id,
      email,
      password,
      DATE(date_of_birth) AS date_of_birth
    FROM users
    WHERE email = ?
    `,
    [email]
  );
  return rows[0];
};


exports.findById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT 
      id,
      email,
      password,
      DATE(date_of_birth) AS date_of_birth
    FROM users
    WHERE id = ?
    `,
    [id]
  );
  return rows[0];
};

exports.updatePassword = async (userId, password) => {
  await db.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [password, userId]
  );
};

