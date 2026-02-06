
import  apiFetch  from "./http";

export const fetchDashboardData = (range) => {
  return apiFetch(`/auth/work-dashboard?filter=${range}`);
};

//10