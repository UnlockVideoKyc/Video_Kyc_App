const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const agentRoutes = require("./agent.routes");
const kycRoutes = require("./kyc.routes");
const webrtcRoutes = require("./webrtc.routes"); // ✅ Make sure this exists

router.use("/auth", authRoutes);
router.use("/agent", agentRoutes);
router.use("/kyc", kycRoutes);
router.use("/webrtc", webrtcRoutes); // ✅ Make sure this is here

module.exports = router;