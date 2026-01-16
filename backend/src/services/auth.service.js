const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/user.repo");
const otpRepo = require("../repositories/otp.repo");
const mailer = require("../utils/mailer");
const { generateOTP } = require("../utils/otp");


exports.login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("User not found");

    // const match = await bcrypt.compare(password, user.password);
//   if (!match) throw new Error("Invalid password");
// const bcrypt = require('bcrypt');

    if (password !== user.password)
      return res.status(401).json({ message: "Invalid password" });

  const otp = generateOTP();
  await otpRepo.create(user.id, otp);
  await mailer.sendOTP(email, otp);

  const expiry = await otpRepo.getLatestExpiry(user.id);

  return { message: "OTP sent", userId: user.id, expiresAt: expiry };
};


exports.verifyOtp = async ({ userId, otp }) => {
  const valid = await otpRepo.verify(userId, otp);
  if (!valid) throw new Error("Invalid OTP");

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { message: "Login successful", token };
};


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

exports.getDashboardData = async (filter) => {
  const { start, end } = getDateRange(filter);

  const approved = await dashboardRepo.countByStatus(
    "APPROVED",
    start,
    end
  );

  const rejected = await dashboardRepo.countByStatus(
    "REJECTED",
    start,
    end
  );

  const discrepancy = await dashboardRepo.countByStatus(
    "DISCREPANCY",
    start,
    end
  );

  return {
    label: filter,
    total: approved + rejected + discrepancy,
    approved,
    rejected,
    discrepancy,
  };
};
