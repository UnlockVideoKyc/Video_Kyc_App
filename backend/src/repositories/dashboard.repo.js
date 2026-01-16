const db = require("../config/db");

exports.countByStatus = async (status, start, end) => {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS count
    FROM Reports
    WHERE FinalVcipStatus = ?
      AND CreatedOn BETWEEN ? AND ?
    `,
    [status, start, end]
  );

  return rows[0].count;
};
