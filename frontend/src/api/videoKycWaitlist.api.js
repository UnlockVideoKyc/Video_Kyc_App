// const BASE_URL = "http://localhost:5000/api/kyc";

// const handleResponse = async (res) => {
//   if (!res.ok) {
//     const error = await res.text();
//     throw new Error(error || "API Error");
//   }
//   return res.json();
// };

// export const getLiveSchedule = async () => {
//   const res = await fetch(`${BASE_URL}/live-schedule`);
//   return handleResponse(res);
// };

// export const getMissedCalls = async () => {
//   const res = await fetch(`${BASE_URL}/missed`);
//   return handleResponse(res);
// };

// export const searchKyc = async (query) => {
//   const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
//   return handleResponse(res);
// };

// export const refreshDashboard = async () => {
//   const res = await fetch(`${BASE_URL}/refresh`);
//   return handleResponse(res);
// };


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

const searchKyc = async (query) => {
  const res = await fetch(
    `${BASE_URL}/search?q=${encodeURIComponent(query)}`
  );
  return handleResponse(res);
};

const refreshDashboard = async () => {
  const res = await fetch(`${BASE_URL}/refresh`);
  return handleResponse(res);
};

/* ✅ NAMED EXPORTS */
export {
  getLiveSchedule,
  getMissedCalls,
  searchKyc,
  refreshDashboard,
};
