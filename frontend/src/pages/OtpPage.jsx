import React, { useEffect, useState, useRef } from "react";
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
import loginImage from "../assets/login-bg.png";

// ---------------------------------------
// Helper Functions
// ---------------------------------------
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

  // ---------------------------------------
  // Detect LOGIN or FORGOT mode
  // ---------------------------------------
  const detectMode = () => {
    const fp = localStorage.getItem("fp_agtLoginId");
    const login = localStorage.getItem("agtLoginId");

    if (fp && !login) return "FORGOT";
    if (login && !fp) return "LOGIN";

    return location.pathname.includes("forgot") ? "FORGOT" : "LOGIN";
  };

  const otpPurpose = detectMode();

  // ---------------------------------------
  // Config
  // ---------------------------------------
  const config = {
    LOGIN: {
      userIdKey: "agtLoginId",
      expiryKey: "otpExpiry",
      verifyEndpoint: `http://localhost:5000/api/auth/verify-otp`,
      resendEndpoint: `http://localhost:5000/api/auth/resend-otp`,
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
      verifyEndpoint: `http://localhost:5000/api/auth/verify-forgot-otp`,
      resendEndpoint: `http://localhost:5000/api/auth/resend-otp`,
      successRedirect: "/change-password",
      backLink: "/forgot-password",
      successAction: (data) => localStorage.setItem("resetToken", data.resetToken),
      cleanup: () => {
        localStorage.removeItem("fp_expiry");
      },
    },
  };

  const current = config[otpPurpose];

  // ---------------------------------------
  // States
  // ---------------------------------------
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  // ---------------------------------------
  // Load initial expiry
  // ---------------------------------------
  useEffect(() => {
    const expiry = localStorage.getItem(current.expiryKey);
    setTimeLeft(getTimeLeft(expiry));
  }, [current.expiryKey]);

  // ---------------------------------------
  // Timer - updates every second
  // ---------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      const expiry = localStorage.getItem(current.expiryKey);
      const left = getTimeLeft(expiry);
      setTimeLeft(left);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpPurpose]);

  // ---------------------------------------
  // OTP input handlers
  // ---------------------------------------
  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1].focus();
    if (error) setError("");
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // ---------------------------------------
  // Verify OTP
  // ---------------------------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    const userId = localStorage.getItem(current.userIdKey);
    if (!userId) return setError("Session expired. Please restart.");

    if (otp.some((d) => d === "")) return setError("Enter all 6 digits");

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

      navigate(current.successRedirect);
    } catch (err) {
      setError(err.message);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // Resend OTP
  // ---------------------------------------
  const handleResendOtp = async () => {
    const userId = localStorage.getItem(current.userIdKey);
    if (!userId) return setError("Session expired");

    setResending(true);
    setError("");

    try {
      const res = await fetch(current.resendEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agtLoginId: Number(userId), purpose: otpPurpose }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend");

      const newExpiry = data.expiresAt
        ? new Date(data.expiresAt)
        : new Date(Date.now() + 5 * 60 * 1000);

      localStorage.setItem(current.expiryKey, newExpiry.toISOString());

      setTimeLeft(Math.floor((newExpiry.getTime() - Date.now()) / 1000));
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  // Focus first input on load
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // ---------------------------------------
  // UI
  // ---------------------------------------
  return (
    <Paper sx={{ minHeight: "100vh", display: "flex" }}>
      <Box
        sx={{
          width: { xs: "0%", lg: "60%" },
          display: { xs: "none", lg: "flex" },
        }}
      >
        <img src={loginImage} alt="otp" style={{ width: "100%", height: "100%" }} />
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
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
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
                  onChange={(e) => handleOtpChange(i, e.target.value)}
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
              disabled={loading}
              sx={{ mb: 3 }}
            >
              {resending ? "Sending..." : "Resend OTP"}
            </Button>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || otp.some((d) => d === "")}
              sx={{ py: 1.5 }}
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
