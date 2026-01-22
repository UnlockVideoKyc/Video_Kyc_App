import apiFetch from "./http";

 const getPastKycCalls = () =>
  apiFetch("/auth/past");


export default getPastKycCalls;
