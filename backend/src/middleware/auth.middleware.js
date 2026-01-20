const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store login ID from token
    req.agtLoginId = decoded.agtLoginId;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
