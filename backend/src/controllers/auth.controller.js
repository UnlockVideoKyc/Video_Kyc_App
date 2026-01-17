const authService = require("../services/auth.service");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // Changed from agentUserId to email
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await authService.login({ email, password }); // Updated
    return res.json(result);
    
  } catch (err) {
    console.error("Login error:", err.message);
    
    if (err.message.includes("not found")) {
      return res.status(404).json({ message: err.message });
    }
    
    if (err.message.includes("inactive")) {
      return res.status(403).json({ message: err.message });
    }
    
    if (err.message.includes("Invalid")) {
      return res.status(401).json({ message: err.message });
    }
    
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { agtLoginId, otp } = req.body;
    
    if (!agtLoginId || !otp) {
      return res.status(400).json({ message: "Agent Login ID and OTP are required" });
    }

    const result = await authService.verifyOtp({ agtLoginId, otp });
    return res.json(result);
    
  } catch (err) {
    console.error("OTP verification error:", err.message);
    
    if (err.message.includes("Invalid or expired")) {
      return res.status(400).json({ message: err.message });
    }
    
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
   const { agtLoginId, purpose } = req.body;

if (!agtLoginId || !purpose) {
  return res.status(400).json({ message: "Agent Login ID and purpose required" });
}

const result = await authService.resendOtp({ agtLoginId, purpose });

    return res.json(result);
    
  } catch (err) {
    console.error("Resend OTP error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, dob } = req.body;
    
    if (!email || !dob) {
      return res.status(400).json({ message: "Email and Date of Birth are required" });
    }

    const result = await authService.forgotPassword({ email, dob });
    return res.json(result);
    
  } catch (err) {
    console.error("Forgot password error:", err.message);
    
    if (err.message.includes("not found") || err.message.includes("Invalid")) {
      return res.status(400).json({ message: err.message });
    }
    
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyForgotOtp = async (req, res) => {
  try {
    const { agtLoginId, otp } = req.body;
    
    if (!agtLoginId || !otp) {
      return res.status(400).json({ message: "Agent Login ID and OTP are required" });
    }

    const result = await authService.verifyForgotOtp({ agtLoginId, otp });
    return res.json(result);
    
  } catch (err) {
    console.error("Forgot OTP verification error:", err.message);
    
    if (err.message.includes("Invalid or expired")) {
      return res.status(400).json({ message: err.message });
    }
    
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Reset token is required" });
    }

    const resetToken = authHeader.split(" ")[1];
    const { newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const result = await authService.resetPassword(resetToken, newPassword);
    return res.json(result);
    
  } catch (err) {
    console.error("Reset password error:", err.message);
    
    if (err.message.includes("Invalid or expired")) {
      return res.status(401).json({ message: err.message });
    }
    
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.hashPassword = async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedPassword = await authService.hashPassword(password);
    return res.json({ hashedPassword });
    
  } catch (err) {
    console.error("Hash password error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};