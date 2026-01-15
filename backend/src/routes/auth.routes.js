const router = require("express").Router();
const controller = require("../controllers/auth.controller");

router.post("/login", controller.login);
router.post("/verify-otp", controller.verifyOtp);
router.post("/resend-otp", controller.resendOtp);
router.post("/forgot-password", controller.forgotPassword);
router.post("/verify-forgot-otp", controller.verifyForgotOtp);
router.post("/reset-password", controller.resetPassword);


module.exports = router;
