const dashboardRepo = require("../repositories/dashboard.repo");
const ApiError = require("../utils/ApiError"); 

/* =========================
   DATE RANGE
========================= */

exports.getDateRange = (filter) => {
  if (filter === "all") return null;

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

/* =========================
   DASHBOARD DATA
========================= */

exports.getDashboardData = async (filter = "today") => {
  const allowedFilters = ["today", "week", "month", "all"];

  if (!allowedFilters.includes(filter)) {
    throw new ApiError(400, "Invalid dashboard filter");
  }

  const range = exports.getDateRange(filter);

  let approved, rejected, discrepancy;

  if (!range) {
    approved = await dashboardRepo.countByStatus("APPROVED");
    rejected = await dashboardRepo.countByStatus("REJECTED");
    discrepancy = await dashboardRepo.countByStatus("DISCREPANCY");
  } else {
    approved = await dashboardRepo.countByStatus(
      "APPROVED",
      range.start,
      range.end
    );
    rejected = await dashboardRepo.countByStatus(
      "REJECTED",
      range.start,
      range.end
    );
    discrepancy = await dashboardRepo.countByStatus(
      "DISCREPANCY",
      range.start,
      range.end
    );
  }

  return {
    label: filter,
    total: approved + rejected + discrepancy,
    approved,
    rejected,
    discrepancy,
  };
};
