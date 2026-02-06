import React, { useEffect, useState, useRef } from "react";
import API_BASE_URL from "../config/api";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { swalError, swalWarning } from "../utils/swal";
import loginImage from "../assets/login-bg.png";

/* ---------- Helper Functions ---------- */
const getTimeLeft = (expiry) => {
  if (!expiry) return 0;
  const diff = Math.floor((new Date(expiry).getTime() - Date.now()) / 1000);
  return diff > 0 ? diff : 0;
};

const formatTime = (seconds) => {
  if (seconds <= 0 || isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const detectMode = () => {
    if (location.pathname.includes("forgot-password-otp")) return "FORGOT";
    return "LOGIN";
  };

  const otpPurpose = detectMode();

  const config = {
    LOGIN: {
      userIdKey: "agtLoginId",
      expiryKey: "otpExpiry",
      verifyEndpoint: `${API_BASE_URL}/auth/verify-otp`,
      resendEndpoint: `${API_BASE_URL}/auth/resend-otp`,
      successRedirect: "/work-dashboard",
      backLink: "/login",
      successAction: (data) => localStorage.setItem("token", data.token),
      cleanup: () => {
        localStorage.removeItem("agtLoginId");
        localStorage.removeItem("otpExpiry");
      },
    },
    FORGOT: {
      userIdKey: "fp_agtLoginId",
      expiryKey: "fp_expiry",
      verifyEndpoint: `${API_BASE_URL}/auth/verify-forgot-otp`,
      resendEndpoint: `${API_BASE_URL}/auth/resend-otp`,
      successRedirect: "/reset-password",
      backLink: "/forgot-password",
      successAction: (data) =>
        localStorage.setItem("resetToken", data.resetToken),
      cleanup: () => {
        localStorage.removeItem("fp_expiry");
      },
    },
  };

  const current = config[otpPurpose];

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const expiry = localStorage.getItem(current.expiryKey);
    setTimeLeft(getTimeLeft(expiry));
  }, [current.expiryKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      const expiry = localStorage.getItem(current.expiryKey);
      setTimeLeft(getTimeLeft(expiry));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpPurpose]);

  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (error) setError("");
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ---------- VERIFY OTP ---------- */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    const userId = localStorage.getItem(current.userIdKey);
    if (!userId) {
      setError("Session expired. Please restart.");
      swalError("Session Expired", "Please restart the process");
      return;
    }

    if (otp.some((d) => d === "")) {
      setError("Enter all 6 digits");
      swalWarning("Invalid OTP", "Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(current.verifyEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agtLoginId: Number(userId),
          otp: otp.join(""),
          purpose: otpPurpose,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP");

      current.successAction(data);
      current.cleanup();

      await Swal.fire({
        icon: "success",
        title:
          otpPurpose === "LOGIN"
            ? "Login Successful"
            : "OTP Verified",
        text:
          otpPurpose === "LOGIN"
            ? "OTP verified successfully"
            : "You can now reset your password",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });

      navigate(current.successRedirect);
    } catch (err) {
      const msg = err.message || "Invalid or expired OTP";
      setError(msg);
      swalError("OTP Error", msg);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RESEND OTP ---------- */
  const handleResendOtp = async () => {
    const userId = localStorage.getItem(current.userIdKey);
    if (!userId) {
      setError("Session expired");
      swalError("Session Expired", "Please restart the process");
      return;
    }

    setResending(true);
    setError("");
    try {
      const res = await fetch(current.resendEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agtLoginId: Number(userId), purpose: otpPurpose }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");

      const newExpiry = data.expiresAt
        ? new Date(data.expiresAt)
        : new Date(Date.now() + 5 * 60 * 1000);

      localStorage.setItem(current.expiryKey, newExpiry.toISOString());
      setTimeLeft(getTimeLeft(newExpiry));
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);

      Swal.fire({
        icon: "success",
        title: "OTP Resent",
        text: "New OTP sent successfully",
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      const msg = err.message || "Failed to resend OTP";
      setError(msg);
      swalError("OTP Error", msg);
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <Paper sx={{ minHeight: "100vh", display: "flex" }}>
      <Box
        sx={{
          width: { xs: "0%", lg: "60%" },
          display: { xs: "none", lg: "flex" },
        }}
      >
        <img
          src={loginImage}
          alt="otp"
          style={{ width: "100%", height: "100%" }}
        />
      </Box>

      <Box
        sx={{
          width: { xs: "100%", lg: "40%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 450 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            OTP Verification
          </Typography>

          <Typography sx={{ mb: 3, color: "#555" }}>
            Enter the 6-digit code sent to your email
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleVerifyOtp}>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              {otp.map((digit, i) => (
                <TextField
                  key={i}
                  inputRef={(el) => (inputRefs.current[i] = el)}
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(i, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={loading}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: "center", fontSize: "1.4rem" },
                  }}
                  sx={{ width: 55 }}
                />
              ))}
            </Box>

            <Typography sx={{ mb: 2, color: timeLeft < 60 ? "red" : "gray" }}>
              Code expires in <b>{formatTime(timeLeft)}</b>
            </Typography>

            <Button
              variant="text"
              onClick={handleResendOtp}
              disabled={loading || resending}
              sx={{ mb: 3 }}
              style={{ color: "#1C43A6" }}
            >
              {resending ? "Sending..." : "Resend OTP"}
            </Button>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || otp.some((d) => d === "")}
              sx={{ py: 1.5 }}
              style={{ backgroundColor: "#1C43A6", color: "white" }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Verify & Continue"
              )}
            </Button>

            <Typography
              component={Link}
              to={current.backLink}
              sx={{ display: "block", textAlign: "center", mt: 2 }}
              style={{ color: "#1C43A6" }}
            >
              ← Back
            </Typography>
          </form>
        </Box>
      </Box>
    </Paper>
  );
};

export default OtpPage;
