const db = require("../config/db");

exports.getVideoKycWaitlist = async (page, limit) => {
  const offset = (page - 1) * limit;

  const [countRows] = await db.query(`
    SELECT COUNT(*) AS total
    FROM Video_Kyc_Waitlist
  `);

  const total = countRows[0].total;

  // Data query (LIMIT & OFFSET directly injected)
  const [rows] = await db.query(`
    SELECT
      WaitlistId,
      CustomerName,
      ClientName,
      VcipId,
      CreatedAt
    FROM Video_Kyc_Waitlist
    ORDER BY CreatedAt DESC
    LIMIT ${limit} OFFSET ${offset}
  `);

  return {
    meta: {
      page,
      limit,
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
    },
    data: rows,
  };
};



exports.getLiveScheduleKyc = async () => {
  const [rows] = await db.execute(`
    SELECT
      l.LiveId,
      w.CustomerName,
      w.ClientName,
      w.VcipId,
      l.CustomerStatus,
      l.L_CallStatus,
      l.CreatedAt
    FROM Live_Schedule_Kyc l
    JOIN Video_Kyc_Waitlist w ON w.WaitlistId = l.WaitlistId
    WHERE l.CustomerStatus IN ('Live', 'Scheduled')
    ORDER BY l.CreatedAt DESC
  `);

  return rows;
};


exports.getMissedCallsKyc = async () => {
  const [rows] = await db.execute(`
    SELECT
      m.MissedId,
      w.CustomerName,
      w.ClientName,
      w.VcipId,
      m.MobileNumber,
      m.CustomerStatus,
      m.Remark,
      m.MissedDateTime,
      m.CreatedAt
    FROM Missed_Calls_Kyc m
    JOIN Video_Kyc_Waitlist w 
      ON w.WaitlistId = m.WaitlistId
    ORDER BY m.MissedDateTime DESC
  `);

  return rows;
};



exports.searchLiveKyc = async (query) => {
  const [rows] = await db.execute(`
    SELECT
      l.LiveId,
      w.CustomerName,
      w.ClientName,
      w.VcipId,
      l.CustomerStatus,
      l.L_CallStatus,
      l.CreatedAt
    FROM Live_Schedule_Kyc l
    JOIN Video_Kyc_Waitlist w ON w.WaitlistId = l.WaitlistId
    WHERE (w.CustomerName LIKE ? OR w.VcipId LIKE ?)
      AND l.CustomerStatus IN ('Live', 'Scheduled')
    ORDER BY l.CreatedAt DESC
  `, [`%${query}%`, `%${query}%`]);

  return rows;
};


exports.searchMissedKyc = async (query) => {
  const like = `%${query}%`;

  const [rows] = await db.execute(`
    SELECT
      m.MissedId,
      w.CustomerName,
      w.ClientName,
      w.VcipId,
      m.MobileNumber,
      m.CustomerStatus,
      m.Remark,
      m.MissedDateTime,
      m.CreatedAt
    FROM Missed_Calls_Kyc m
    JOIN Video_Kyc_Waitlist w ON w.WaitlistId = m.WaitlistId
    WHERE
      w.CustomerName LIKE ?
      OR w.ClientName LIKE ?
      OR w.VcipId LIKE ?
      OR m.MobileNumber LIKE ?
      OR m.Remark LIKE ?
    ORDER BY m.MissedDateTime DESC
  `, [like, like, like, like, like]);

  return rows;
};


// exports.searchPastKyc = async (query) => {
//   const likeQuery = `%${query}%`;

//   const [rows] = await db.query(
//     `
//     SELECT 
//       pkc.PastKycId,
//       vk.CustomerName AS customerName,
//       vk.ClientName AS clientName,
//       pkc.VcipId AS vcipId,
//       pkc.ConnectionId AS connectionId,
//       pkc.CallStatus AS callStatus,
//       pkc.CreatedAt
//     FROM Past_Kyc_Calls pkc
//     LEFT JOIN Video_Kyc_Waitlist vk
//       ON vk.WaitlistId = pkc.WaitlistId
//     WHERE 
//       COALESCE(vk.CustomerName, '') LIKE ?
//       OR COALESCE(vk.ClientName, '') LIKE ?
//       OR pkc.VcipId LIKE ?
//       OR pkc.ConnectionId LIKE ?
//       OR pkc.CallStatus LIKE ?
//     ORDER BY pkc.CreatedAt DESC
//     `,
//     [
//       likeQuery,
//       likeQuery,
//       likeQuery,
//       likeQuery,
//       likeQuery
//     ]
//   );

//   return rows;
// };




exports.searchPastKyc = async (query) => {
  const likeQuery = `%${query}%`;

  const [rows] = await db.query(
    `
    SELECT 
      pkc.PastKycId,
      vk.CustomerName AS customerName,
      vk.ClientName AS clientName,
      vk.MobileNumber As mobileNumber, 
      pkc.VcipId AS vcipId,
      pkc.ConnectionId AS connectionId,
      pkc.CallStatus AS callStatus,
      pkc.CreatedAt
    FROM Past_Kyc_Calls pkc
    LEFT JOIN Video_Kyc_Waitlist vk
      ON vk.WaitlistId = pkc.WaitlistId
    WHERE 
      COALESCE(vk.CustomerName, '') LIKE ?
      OR COALESCE(vk.ClientName, '') LIKE ?
      OR pkc.VcipId LIKE ?
      OR pkc.ConnectionId LIKE ?
      OR pkc.CallStatus LIKE ?
    ORDER BY pkc.CreatedAt DESC
    `,
    [
      likeQuery,
      likeQuery,
      likeQuery,
      likeQuery,
      likeQuery
    ]
  );

  return rows;
};
