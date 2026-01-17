const db = require("../config/db");

exports.create = async (agtLoginId, otp, purpose) => {
  await db.query(
    `INSERT INTO OTP (AgtLoginId, OneTimePassword, Purpose, ExpiresAt, IsUsed, CreatedOn) 
     VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE), 0, NOW())`,
    [agtLoginId, otp, purpose]
  );
};


exports.verify = async (agtLoginId, otp, purpose) => {
  const [rows] = await db.query(
    `SELECT OtpId FROM OTP 
     WHERE AgtLoginId = ?
     AND OneTimePassword = ?
     AND Purpose = ?
     AND IsUsed = 0
     AND ExpiresAt > NOW()
     ORDER BY CreatedOn DESC LIMIT 1`,
    [agtLoginId, otp, purpose]
  );

  if (!rows.length) return false;

  await db.query(
    `UPDATE OTP SET IsUsed = 1 WHERE OtpId = ?`,
    [rows[0].OtpId]
  );

  return true;
};

exports.invalidateAll = async (agtLoginId, purpose) => {
  await db.query(
    `UPDATE OTP SET IsUsed = 1 
     WHERE AgtLoginId = ? AND Purpose = ? AND IsUsed = 0`,
    [agtLoginId, purpose]
  );
};


// otp.repo.js

exports.getLatestExpiry = async (agtLoginId, purpose) => {
  const [rows] = await db.query(
    `SELECT ExpiresAt FROM OTP 
     WHERE AgtLoginId = ? AND Purpose = ?
     ORDER BY CreatedOn DESC LIMIT 1`,
    [agtLoginId, purpose]
  );

  return rows.length ? rows[0].ExpiresAt : null;
};




exports.deleteExpiredOtps = async () => {
  await db.query(
    `DELETE FROM OTP WHERE ExpiresAt < NOW() AND IsUsed = 0`
  );
};