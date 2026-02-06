const dashboardRepo = require("../repositories/dashboard.repo");

/* =========================
   FILTER CONSTANTS
========================= */

const FILTERS = {
  TODAY: "today",
  WEEK: "week",
  MONTH: "month",
  ALL: "all"
};

/* =========================
   DASHBOARD DATA
========================= */

const getDashboardData = async (filter = FILTERS.TODAY) => {
  filter = filter?.toLowerCase();

  if (!Object.values(FILTERS).includes(filter)) {
    filter = FILTERS.TODAY;
  }

  let stats;

  if (filter === FILTERS.ALL) {
    stats = await dashboardRepo.getAllCounts();
  } else if (filter === FILTERS.WEEK) {
    stats = await dashboardRepo.getWeeklyCounts();
  } else if (filter === FILTERS.MONTH) {
    stats = await dashboardRepo.getMonthlyCounts();
  } else {
    stats = await dashboardRepo.getTodayCounts();
  }

  return {
    label: filter,
    approved: Number(stats.approved) || 0,
    rejected: Number(stats.rejected) || 0,
    discrepancy: Number(stats.discrepancy) || 0,
    total:
      (Number(stats.approved) || 0) +
      (Number(stats.rejected) || 0) +
      (Number(stats.discrepancy) || 0)
  };
};

module.exports = {
  getDashboardData
};
