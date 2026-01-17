const router = require("express").Router();

// Main API routes
router.use("/auth", require("./auth.routes"));

// Health check route
router.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    service: "Video KYC Backend"
  });
});

module.exports = router;