const router = require("express").Router();
const agentController = require("../controllers/agent.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/profile", authMiddleware, agentController.getProfile);

module.exports = router;
