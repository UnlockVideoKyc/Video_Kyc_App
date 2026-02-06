import apiFetch from "./http";

const searchPastKycCalls = (query) =>
  apiFetch(`/kyc/search-past?q=${query}`);

export default searchPastKycCalls;