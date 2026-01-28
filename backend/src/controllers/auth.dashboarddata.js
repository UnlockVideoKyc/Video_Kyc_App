const authService = require("../services/dashboardData.service");
const dashboardRepo = require("../repositories/dashboard.repo");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

/* =========================
   GET DASHBOARD DATA
========================= */
exports.getDashboard = asyncHandler(async (req, res) => {
  const filter = req.query.filter || "today";
  const range = authService.getDateRange(filter);

  let data;

  // ✅ NO DATE FILTER (ALL DATA)
  if (!range) {
    data = await dashboardRepo.getAllCounts();
  }
  // ✅ DATE FILTERED DATA
  else {
    data = await dashboardRepo.getCountsByDate(range.start, range.end);
  }

  if (!data) {
    throw new ApiError(404, "Dashboard data not found");
  }

  res.status(200).json(
    new ApiResponse("Dashboard data fetched successfully", data)
  );
});
