const API_BASE_URL = `${API_BASE_URL}/api/kyc`;

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API Error");
  }
  return res.json();
};

export const getLiveSchedule = async () => {
  const res = await fetch(`${API_BASE_URL}/live-schedule`);
  return handleResponse(res);
};

export const getMissedCalls = async () => {
  const res = await fetch(`${API_BASE_URL}/missed`);
  return handleResponse(res);
};

export const searchKyc = async (query) => {
  const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
  return handleResponse(res);
};

export const refreshDashboard = async () => {
  const res = await fetch(`${API_BASE_URL}/refresh`);
  return handleResponse(res);
};
