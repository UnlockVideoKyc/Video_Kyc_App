
const kycRepo = require("../repositories/kyc.repo");

exports.getVideoKycWaitlist = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);

    const result = await kycRepo.getVideoKycWaitlist(page, limit);

    return res.status(200).json({
      success: true,
      message: "Video KYC waitlist fetched",
      meta: result.meta,
      data: result.data,
    });
  } catch (err) {
    console.error("Waitlist Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.searchMissedKyc = async (req, res) => {
  try {
    const query = (req.query.q || "").trim();
    if (query.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const data = await kycRepo.searchMissedKyc(query);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("Search Missed Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getLiveScheduleKyc = async (req, res) => {
  try {
    const data = await kycRepo.getLiveScheduleKyc();

    res.status(200).json({
      success: true,
      message: "Live & Scheduled calls fetched",
      data,
    });
  } catch (err) {
    console.error("Live Schedule Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getMissedCallsKyc = async (req, res) => {
  try {
    const data = await kycRepo.getMissedCallsKyc();

    res.status(200).json({
      success: true,
      message: "Missed calls fetched",
      data,
    });
  } catch (err) {
    console.error("Missed Calls Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.searchKyc = async (req, res) => {
  try {
    const query = (req.query.q || "").trim();
    const view = req.query.view || "live";

    if (query.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const data =
      view === "live"
        ? await kycRepo.searchLiveKyc(query)
        : await kycRepo.searchMissedKyc(query);

    res.status(200).json({
      success: true,
      message: "Search results",
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



exports.refreshDashboard = async (req, res) => {
  try {
    const waitlist = await kycRepo.getVideoKycWaitlist(1, 10);
    const live = await kycRepo.getLiveScheduleKyc();
    const missed = await kycRepo.getMissedCallsKyc();

    res.status(200).json({
      success: true,
      message: "Dashboard refreshed",
      data: {
        waitlist: waitlist.data,
        live,
        missed,
      },
    });
  } catch (err) {
    console.error("Refresh Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



exports.searchPastKyc = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    if (q.length < 2) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const data = await kycRepo.searchPastKyc(q);

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (err) {
    console.error("Past KYC Search Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
