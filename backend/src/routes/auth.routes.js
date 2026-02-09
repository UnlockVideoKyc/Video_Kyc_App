const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authDashboard = require("../controllers/auth.dashboarddata");
const pastKycController = require("../repositories/pastkyc.repo");
const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");
const db = require("../config/db"); // ✅ ADD THIS

// Authentication routes
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);

// Password reset routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-forgot-otp", authController.verifyForgotOtp);
router.post("/reset-password", authController.resetPassword);

// Utility route (for testing/development)
router.post("/hash-password", authController.hashPassword);

// work-dashboard pai chart
router.get(
  "/work-dashboard",
  auth,
  authorize(1, 2),
  authDashboard.getDashboard
);

// past kyc
// past kyc - UPDATED QUERY
router.get("/past", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        p.PastKycId,
        p.WaitlistId,
        p.VcipId,
        p.ConnectionId,
        p.CallStatus,
        p.CallDuration,
        p.DisconnectReason,
        p.CompletedAt,
        p.CreatedAt,
        w.CustomerName,
        w.ClientName,
        w.MobileNumber
       FROM Past_Kyc_Calls p
       LEFT JOIN Video_Kyc_Waitlist w ON p.WaitlistId = w.WaitlistId
       ORDER BY p.CompletedAt DESC
       LIMIT 100`
    );
    
    console.log(`📊 Fetched ${rows.length} past KYC records`);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching past calls:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;