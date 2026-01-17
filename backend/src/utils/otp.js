exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.validateOTP = (otp) => {
  if (!otp) return false;
  if (otp.length !== 6) return false;
  return /^\d+$/.test(otp);
};