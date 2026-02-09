const express = require("express");
const router = express.Router();
const webrtcController = require("../controllers/webrtc.controller");
const auth = require("../middleware/auth.middleware");
const db = require("../config/db");

// ✅ GET CONNECTION ID BY VCIP ID - ADD THIS FIRST (NO AUTH REQUIRED)
router.get("/connection/:vcipId", async (req, res) => {
  try {
    const { vcipId } = req.params;
    
    console.log(`🔍 GET /webrtc/connection/${vcipId} - Looking up connectionId`);

    // Query database for connectionId
    const [rows] = await db.query(
      `SELECT ConnectionId, VcipId, CustomerName, ClientName, MobileNumber
       FROM Video_Kyc_Waitlist 
       WHERE VcipId = ? 
       ORDER BY CreatedAt DESC
       LIMIT 1`,
      [vcipId]
    );

    console.log(`📊 Query result:`, rows);

    if (rows.length === 0) {
      console.log(`❌ No record found for VCIP: ${vcipId}`);
      return res.status(404).json({
        success: false,
        message: "Connection ID not found for this VCIP ID"
      });
    }

    const connectionData = rows[0];
    console.log(`✅ Found connectionId: ${connectionData.ConnectionId}`);

    res.status(200).json({
      success: true,
      data: {
        connectionId: connectionData.ConnectionId,
        vcipId: connectionData.VcipId,
        customerName: connectionData.CustomerName,
        clientName: connectionData.ClientName,
        mobileNumber: connectionData.MobileNumber
      }
    });

  } catch (error) {
    console.error("❌ Error fetching connectionId:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

// Customer routes (no auth needed for mobile app)
router.post("/customer/initiate", webrtcController.initiateCustomer);

// Agent routes (auth required)
router.post("/agent/initiate", auth, webrtcController.initiateAgent);
router.post("/end-call", auth, webrtcController.endCall);
router.post("/metrics", auth, webrtcController.saveMetrics);

module.exports = router;