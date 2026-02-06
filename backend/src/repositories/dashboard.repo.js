const db = require("../config/db");

/* =========================
   BASE QUERY
========================= */

const BASE_QUERY = `
  SELECT
    SUM(CallStatus = 'APPROVED')     AS approved,
    SUM(CallStatus = 'REJECTED')     AS rejected,
    SUM(CallStatus = 'DISCREPANCY')  AS discrepancy
  FROM Past_Kyc_Calls
  WHERE CreatedAt IS NOT NULL
`;

/* =========================
   NORMALIZER
========================= */

const normalize = (row) => ({
  approved: Number(row?.approved) || 0,
  rejected: Number(row?.rejected) || 0,
  discrepancy: Number(row?.discrepancy) || 0
});

/* =========================
   ALL TIME
========================= */

exports.getAllCounts = async () => {
  const [rows] = await db.query(BASE_QUERY);
  return normalize(rows[0]);
};

/* =========================
   TODAY
========================= */

exports.getTodayCounts = async () => {
  const [rows] = await db.query(`
    ${BASE_QUERY}
    AND CreatedAt BETWEEN
      DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00')
      AND
      DATE_FORMAT(NOW(), '%Y-%m-%d 23:59:59')
  `);

  return normalize(rows[0]);
};

/* =========================
   LAST 7 DAYS
========================= */

exports.getWeeklyCounts = async () => {
  const [rows] = await db.query(`
    ${BASE_QUERY}
    AND CreatedAt >= NOW() - INTERVAL 7 DAY
  `);

  return normalize(rows[0]);
};

/* =========================
   LAST 30 DAYS
========================= */

exports.getMonthlyCounts = async () => {
  const [rows] = await db.query(`
    ${BASE_QUERY}
    AND CreatedAt >= NOW() - INTERVAL 30 DAY
  `);

  return normalize(rows[0]);
};
