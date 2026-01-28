const db = require("../config/db");

exports.getAllCounts = async () => {
  const [rows] = await db.query(`
    SELECT
      COALESCE(SUM(CallStatus = 'Approved'), 0) AS approved,
      COALESCE(SUM(CallStatus = 'Rejected'), 0) AS rejected,
      COALESCE(SUM(CallStatus = 'Discrepancy'), 0) AS discrepancy
    FROM Past_Kyc_Calls
  `);

  return rows[0];
};

exports.getCountsByDate = async (start, end) => {
  const [rows] = await db.query(
    `
    SELECT
      COALESCE(SUM(CallStatus = 'Approved'), 0) AS approved,
      COALESCE(SUM(CallStatus = 'Rejected'), 0) AS rejected,
      COALESCE(SUM(CallStatus = 'Discrepancy'), 0) AS discrepancy
    FROM Past_Kyc_Calls
    WHERE CreatedAt BETWEEN ? AND ?
    `,
    [start, end]
  );

  return rows[0];
};
