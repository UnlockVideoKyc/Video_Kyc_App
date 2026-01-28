const kycRepo = require("../repositories/kyc.repo");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

/* =========================
   WAITLIST
========================= */
exports.getVideoKycWaitlist = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 10);

  const result = await kycRepo.getVideoKycWaitlist(page, limit);

  res.status(200).json(
    new ApiResponse("Video KYC waitlist fetched", {
      meta: result.meta,
      data: result.data,
    })
  );
});

/* =========================
   SEARCH MISSED
========================= */
exports.searchMissedKyc = asyncHandler(async (req, res) => {
  const query = (req.query.q || "").trim();

  if (query.length < 2) {
    return res.status(200).json(
      new ApiResponse("Search query too short", [])
    );
  }

  const data = await kycRepo.searchMissedKyc(query);

  res.status(200).json(
    new ApiResponse("Missed KYC search results", {
      count: data.length,
      data,
    })
  );
});

/* =========================
   LIVE + SCHEDULED
========================= */
exports.getLiveScheduleKyc = asyncHandler(async (req, res) => {
  const data = await kycRepo.getLiveScheduleKyc();

  res.status(200).json(
    new ApiResponse("Live & scheduled calls fetched", data)
  );
});

/* =========================
   MISSED CALLS
========================= */
exports.getMissedCallsKyc = asyncHandler(async (req, res) => {
  const data = await kycRepo.getMissedCallsKyc();

  res.status(200).json(
    new ApiResponse("Missed calls fetched", data)
  );
});

/* =========================
   SEARCH (LIVE / MISSED)
========================= */
exports.searchKyc = asyncHandler(async (req, res) => {
  const query = (req.query.q || "").trim();
  const view = req.query.view || "live";

  if (query.length < 2) {
    return res.status(200).json(
      new ApiResponse("Search query too short", [])
    );
  }

  const data =
    view === "live"
      ? await kycRepo.searchLiveKyc(query)
      : await kycRepo.searchMissedKyc(query);

  res.status(200).json(
    new ApiResponse("Search results fetched", {
      count: data.length,
      data,
    })
  );
});

/* =========================
   REFRESH DASHBOARD
========================= */
exports.refreshDashboard = asyncHandler(async (req, res) => {
  const waitlist = await kycRepo.getVideoKycWaitlist(1, 10);
  const live = await kycRepo.getLiveScheduleKyc();
  const missed = await kycRepo.getMissedCallsKyc();

  res.status(200).json(
    new ApiResponse("Dashboard refreshed successfully", {
      waitlist: waitlist.data,
      live,
      missed,
    })
  );
});

/* =========================
   SEARCH PAST KYC
========================= */
exports.searchPastKyc = asyncHandler(async (req, res) => {
  const q = (req.query.q || "").trim();

  if (q.length < 2) {
    return res.status(200).json(
      new ApiResponse("Search query too short", [])
    );
  }

  const data = await kycRepo.searchPastKyc(q);

  res.status(200).json(
    new ApiResponse("Past KYC search results", {
      count: data.length,
      data,
    })
  );
});
