const router = require("express").Router();
const agentController = require("../controllers/agent.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware")

router.get("/profile", authMiddleware, authorize(1), agentController.getProfile);
router.put("/change-password", authMiddleware, authorize(1), agentController.changePassword);

// At the end of the file, before module.exports


module.exports = router;
