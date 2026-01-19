// const db = require("../config/db");

// exports.getAllCounts = async () => {
//   const [rows] = await db.query(`
//     SELECT
//       SUM(FinalVcipStatus = 'APPROVED') AS approved,
//       SUM(FinalVcipStatus = 'REJECTED') AS rejected,
//       SUM(FinalVcipStatus = 'DISCREPANCY') AS discrepancy
//     FROM Reports
//   `);

//   return rows[0];
// };

// exports.getCountsByDate = async (start, end) => {
//   const [rows] = await db.query(
//     `
//     SELECT
//       SUM(FinalVcipStatus = 'APPROVED') AS approved,
//       SUM(FinalVcipStatus = 'REJECTED') AS rejected,
//       SUM(FinalVcipStatus = 'DISCREPANCY') AS discrepancy
//     FROM Reports
//     WHERE CreatedOn BETWEEN ? AND ?
//     `,
//     [start, end]
//   );

//   return rows[0];
// };



const db = require("../config/db");

exports.getAllCounts = async () => {
  const [rows] = await db.query(`
    SELECT
      SUM(CallStatus = 'Approved') AS approved,
      SUM(CallStatus = 'Rejected') AS rejected,
      SUM(CallStatus = 'Discrepancy') AS discrepancy
    FROM Past_Kyc_Calls
  `);

  return rows[0];
};

exports.getCountsByDate = async (start, end) => {
  const [rows] = await db.query(
    `
    SELECT
      SUM(CallStatus = 'Approved') AS approved,
      SUM(CallStatus = 'Rejected') AS rejected,
      SUM(CallStatus = 'Discrepancy') AS discrepancy
    FROM Past_Kyc_Calls
    WHERE CreatedAt BETWEEN ? AND ?
    `,
    [start, end]
  );

  return rows[0];
};
