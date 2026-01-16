const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const authService = require("../services/auth.service");

router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.post("/verify-otp", controller.verifyOtp);
router.post("/resend-otp", controller.resendOtp);

router.get(
  "/work-dashboard",
  controller.getDashboardData
);

module.exports = router;
