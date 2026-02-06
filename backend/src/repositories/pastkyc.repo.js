const db = require("../config/db");

exports.getPastKycCalls = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        w.CustomerName AS customerName,
        w.ClientName AS clientName,
        p.VcipId AS vcipId,
        w.MobileNumber AS mobileNumber, 
        p.ConnectionId AS connectionId,
        p.CallStatus AS callStatus
      FROM Past_Kyc_Calls p
      LEFT JOIN Video_Kyc_Waitlist w
        ON w.WaitlistId = p.WaitlistId
      ORDER BY p.CreatedAt DESC
    `);

    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error("Past KYC Fetch Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch past KYC calls"
    });
  }
};
