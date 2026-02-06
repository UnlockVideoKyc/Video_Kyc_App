import apiClient from "./http";

export const getLiveSchedule = () =>
  apiClient("/kyc/live-schedule");

export const getMissedCalls = () =>
  apiClient("/kyc/missed");

export const searchKyc = (query, view = "live") =>
  apiClient(`/kyc/search?q=${encodeURIComponent(query)}&view=${view}`);

export const refreshDashboard = () =>
  apiClient("/kyc/refresh");


export const searchPastKycCalls = (query) =>
  apiClient(`/api/past-kyc/search?q=${encodeURIComponent(query)}`);
