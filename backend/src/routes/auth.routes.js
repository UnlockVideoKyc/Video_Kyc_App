const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authDashboard = require("../controllers/auth.dashboarddata");
const pastKycController = require("../repositories/pastkyc.repo")
const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

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
router.get("/past", auth, authorize(1, 2, 3), pastKycController.getPastKycCalls);
module.exports = router;