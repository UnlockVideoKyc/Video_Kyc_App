const BASE_URL = "http://localhost:5000/api/kyc";

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API Error");
  }
  return res.json();
};

const getLiveSchedule = async () => {
  const res = await fetch(`${BASE_URL}/live-schedule`);
  return handleResponse(res);
};

const getMissedCalls = async () => {
  const res = await fetch(`${BASE_URL}/missed`);
  return handleResponse(res);
};

// videoKycWaitlist.api.js
 const searchMissedKyc = async (query) => {
  const res = await fetch(
    `${BASE_URL}/search-missed?q=${encodeURIComponent(query)}`
  );
  return res.json();
};


const searchKyc = async (query, view = "live") => {
  return handleResponse(
    await fetch(
      `${BASE_URL}/search?q=${encodeURIComponent(query)}&view=${view}`
    )
  );
};


const refreshDashboard = async () => {
  const res = await fetch(`${BASE_URL}/refresh`);
  return handleResponse(res);
};

/* ✅ NAMED EXPORTS */
export {
  getLiveSchedule,
  searchMissedKyc,
  searchKyc,
  refreshDashboard,
  getMissedCalls
};
