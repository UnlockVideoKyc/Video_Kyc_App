const authService = require("../services/dashboardData.service");
const dashboardRepo = require("../repositories/dashboard.repo");
exports.getDashboard = async (req, res) => {
  try {
    const filter = req.query.filter || "today";
    const range = authService.getDateRange(filter);

    let data;

    // ✅ ALL DATA
    if (!range) {
      data = await dashboardRepo.getAllCounts();
    } 
    // ✅ DATE FILTERED
    else {
      data = await dashboardRepo.getCountsByDate(range.start, range.end);
    }

    res.json({
      success: true,
      data
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({
      success: false,
      message: "Dashboard error"
    });
  }
};