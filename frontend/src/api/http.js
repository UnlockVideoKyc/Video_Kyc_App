const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const apiClient = async (path, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API Error");
  }

  return res.json();
};

export default apiClient;




// bjgd
