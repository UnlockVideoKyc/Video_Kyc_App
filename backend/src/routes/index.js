const router = require("express").Router();

router.use("/auth", require("./auth.routes"));

router.use("/agent", require("./agent.routes"));

//dashboard
router.use("/kyc", require("./kyc.routes"));


// Health check route
router.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    service: "Video KYC Backend"
  });




  
  
});

module.exports = router;