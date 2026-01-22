const BASE_URL = "http://localhost:5000/api";

const apiFetch = async (url, options = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
};

export default apiFetch;
