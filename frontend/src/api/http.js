


const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;

const apiFetch = async (url, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
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
