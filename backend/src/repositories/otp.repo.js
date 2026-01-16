const db = require("../config/db");

const OTP_EXPIRY_SECONDS = 100;

exports.create = async (userId, otp) => {
  await db.query(
    `
    INSERT INTO login_otps (user_id, otp, expires_at, is_used)
    VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND), 0)
    `,
    [userId, otp, OTP_EXPIRY_SECONDS]
  );
};

exports.verify = async (userId, otp) => {
  const [rows] = await db.query(
    `
    SELECT id
    FROM login_otps
    WHERE user_id = ?
      AND otp = ?
      AND is_used = 0
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [userId, otp]
  );

  if (!rows.length) return false;

  await db.query(
    `UPDATE login_otps SET is_used = 1 WHERE id = ?`,
    [rows[0].id]
  );

  return true;
};

exports.invalidateAll = async (userId) => {
  await db.query(
    `UPDATE login_otps SET is_used = 1 WHERE user_id = ?`,
    [userId]
  );
};

exports.getLatestExpiry = async (userId) => {
  const [rows] = await db.query(
    `
    SELECT expires_at
    FROM login_otps
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [userId]
  );

  return rows.length ? rows[0].expires_at : null;
};




