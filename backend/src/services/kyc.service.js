const kycRepo = require("../repositories/kyc.repo");

exports.fetchCustomerForCall = async (vcipId) => {
  const customer = await kycRepo.getCustomerForVideoCall(vcipId);

  if (!customer) {
    throw new Error("Customer not found for this waitlist");
  }

  return customer;
};
