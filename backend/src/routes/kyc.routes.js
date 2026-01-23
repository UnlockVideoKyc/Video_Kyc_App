const express = require("express");
const router = express.Router();
const kycController = require("../controllers/kyc.controller");


router.get("/waitlist", kycController.getVideoKycWaitlist);
router.get("/live-schedule", kycController.getLiveScheduleKyc);
router.get("/missed", kycController.getMissedCallsKyc);
router.get("/search", kycController.searchKyc);
router.get("/refresh", kycController.refreshDashboard);
router.get("/search-past", kycController.searchPastKyc);
router.get("/search-missed", kycController.searchMissedKyc);


module.exports = router;


