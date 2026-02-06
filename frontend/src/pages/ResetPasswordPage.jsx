import React, { useState } from "react";
import API_BASE_URL from "../config/api";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { VisibilityOff, Visibility, Lock } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import loginImage from "../assets/login-bg.png";
import wavingHand from "../assets/waving-hand.png";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const resetToken = localStorage.getItem("resetToken");
    if (!resetToken) {
      setError("Session expired. Please try again.");

      Swal.fire({
        icon: "warning",
        title: "Session Expired",
        text: "Please try again.",
        confirmButtonColor: "#3085d6",
      });

      setTimeout(() => navigate("/forgot-password"), 1500);
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all fields");

      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all fields",
        confirmButtonColor: "#d33",
      });

      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");

      Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must be at least 6 characters long",
        confirmButtonColor: "#d33",
      });

      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");

      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match",
        confirmButtonColor: "#d33",
      });

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resetToken}`,
          },
          body: JSON.stringify({
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccess("Password reset successfully!");

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Password reset successfully!",
        confirmButtonColor: "#3085d6",
      });

      localStorage.removeItem("resetToken");
      localStorage.removeItem("fp_agtLoginId");
      localStorage.removeItem("fp_expiry");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg = err.message || "Something went wrong";
      setError(msg);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: msg,
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        overflow: "hidden",
      }}
    >
      {/* Left Image */}
      <Box
        sx={{
          width: { xs: "0%", lg: "60%" },
          display: { xs: "none", lg: "flex" },
        }}
      >
        <Box
          component="img"
          src={loginImage}
          alt="Reset Password"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      {/* Right Form */}
      <Box
        sx={{
          width: { xs: "100%", lg: "40%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5, md: 6 },
            width: "100%",
            maxWidth: "500px",
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h4" fontWeight={700}>
                Set New Password
              </Typography>
              <Box
                component="img"
                src={wavingHand}
                alt="wave"
                sx={{ width: 36, height: 36 }}
              />
            </Box>
            <Typography sx={{ mt: 1 }}>
              Create a new secure password for your account
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword.newPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange("newPassword")}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("newPassword")}
                    >
                      {showPassword.newPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Password must be at least 6 characters long"
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPassword.confirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              sx={{ mb: 4 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                    >
                      {showPassword.confirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ py: 1.5, mb: 2 }}
              style={{ backgroundColor: "#1C43A6", color: "white" }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Reset Password"
              )}
            </Button>

            <Typography
              component={Link}
              to="/login"
              sx={{ display: "block", textAlign: "center", textDecoration: "none" }}
              style={{ color: "#1C43A6" }}
            >
              ← Back to Login
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Paper>
  );
};

export default ResetPasswordPage;
