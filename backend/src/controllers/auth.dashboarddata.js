const dashboardService = require("../services/dashboardData.service");

exports.getDashboard = async (req, res) => {
  try {
    const filter = req.query.filter || "today";

    const data = await dashboardService.getDashboardData(filter);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Dashboard Controller Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data"
    });
  }
};
