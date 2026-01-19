const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authDashboard = require("../controllers/auth.dashboarddata");
const pastKycController = require("../repositories/pastkyc.repo")

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
  authDashboard.getDashboard
);

// past kyc
router.get("/past", pastKycController.getPastKycCalls);
module.exports = router;