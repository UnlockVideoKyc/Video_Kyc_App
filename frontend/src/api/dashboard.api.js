export const fetchDashboardData = async (range) => {
  const response = await fetch(
    `http://localhost:5000/api/auth/work-dashboard?filter=${range}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
};
