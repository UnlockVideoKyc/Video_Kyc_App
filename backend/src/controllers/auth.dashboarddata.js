const db = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
    const { filter = 'live' } = req.query; // ✅ Default to 'live'
    
    // Your existing dashboard logic here
    // Make sure it handles the filter parameter
    
    const [approved] = await db.query(
      `SELECT COUNT(*) as count FROM Past_Kyc_Calls WHERE CallStatus = 'Approved'`
    );
    
    const [rejected] = await db.query(
      `SELECT COUNT(*) as count FROM Past_Kyc_Calls WHERE CallStatus = 'Rejected'`
    );
    
    const [discrepancy] = await db.query(
      `SELECT COUNT(*) as count FROM Past_Kyc_Calls WHERE CallStatus = 'Discrepancy'`
    );
    
    res.json({
      success: true,
      data: {
        approved: approved[0]?.count || 0,
        rejected: rejected[0]?.count || 0,
        discrepancy: discrepancy[0]?.count || 0
      }
    });
    
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
