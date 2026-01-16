// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");


// exports.login = async (req, res) => {
//   try {
//     const data = await authService.login(req.body);
//     res.json(data);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };



// exports.verifyOtp = async (req, res) => {
//   try {
//     const { userId, otp } = req.body;

//     const valid = await otpRepo.verify(userId, otp);
//     if (!valid) return res.status(400).json({ message: "Invalid or expired OTP" });

//     const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     return res.json({ message: "Login successful", token });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };




// exports.logout = async (req, res) => {
//   try {
//     // If using JWT stateless auth,
//     // logout is mostly handled on frontend
//     return res.status(200).json({
//       message: "Logged out successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Logout failed" });
//   }
// };


const userRepo = require("../repositories/user.repo");
const otpRepo = require("../repositories/otp.repo");
const mailer = require("../utils/mailer");
const { generateOTP } = require("../utils/otp");
const authService = require("../services/auth.service");
const dashboardRepo = require("../repositories/dashboard.repo");

exports.login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const data = await authService.verifyOtp(req.body);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  return res.status(200).json({ message: "Logged out successfully" });
};


exports.resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    await otpRepo.invalidateAll(userId);

    const otp = generateOTP();
    await otpRepo.create(userId, otp);

    const user = await userRepo.findById(userId);
    await mailer.sendOTP(user.email, otp);

    // Get the new expiry time and return it
    const expiry = await otpRepo.getLatestExpiry(userId);
    
    return res.json({ 
      message: "New OTP sent", 
      expiresAt: expiry 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// exports.getDashboardData = async (req, res) => {
//   try {
//     const { filter } = req.query;

//     if (!filter) {
//       return res.status(400).json({ message: "Filter is required" });
//     }

//     const data = await dashboardService.getDashboardData(filter);

//     return res.status(200).json({
//       message: "Dashboard data fetched successfully",
//       data,
//     });
//   } catch (err) {
//     console.error("Dashboard Error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };



const getDateRange = (filter) => {
  const start = new Date();
  const end = new Date();

  if (filter === "today") {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }

  if (filter === "week") {
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    start.setHours(0, 0, 0, 0);

    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  }

  if (filter === "month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);
  }

  return { start, end };
};

exports.getDashboardData = async (req, res) => {
  try {
    const { filter } = req.query;
    if (!filter) {
      return res.status(400).json({ message: "Filter is required" });
    }

    const { start, end } = getDateRange(filter);

    const approved = await dashboardRepo.countByStatus("APPROVED", start, end);
    const rejected = await dashboardRepo.countByStatus("REJECTED", start, end);
    const discrepancy = await dashboardRepo.countByStatus("DISCREPANCY", start, end);

    res.json({
      message: "Dashboard data fetched successfully",
      data: {
        label: filter,
        total: approved + rejected + discrepancy,
        approved,
        rejected,
        discrepancy,
      },
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: err.message });
  }
};
