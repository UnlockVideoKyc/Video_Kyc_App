import React, { useState } from "react";
import {
  Paper, Box, Typography, TextField,
  Button, InputAdornment, IconButton,
  Alert, CircularProgress
} from "@mui/material";
import { VisibilityOff, Visibility, Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login-bg.png";

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

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const resetToken = localStorage.getItem("resetToken");
    if (!resetToken) {
      setError("Session expired. Please restart the process.");
      navigate("/forgot-password");
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      return setError("Please fill all fields");
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resetToken}`
          },
          body: JSON.stringify({ newPassword: formData.newPassword })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess("Password reset successful! Redirecting...");

      // clear tokens
      localStorage.removeItem("resetToken");
      localStorage.removeItem("fp_agtLoginId");
      localStorage.removeItem("fp_expiry");

      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ height: "100vh", display: "flex" }}>
      <Box sx={{ flex: 1, display: { xs: "none", lg: "block" } }}>
        <img src={loginImage} alt="bg" style={{ width: "100%", height: "100%" }} />
      </Box>

      <Box sx={{ flex: 1, p: 4, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ maxWidth: 400, width: "100%" }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Set New Password
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth label="New Password"
              type={showPassword.newPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange("newPassword")}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePasswordVisibility("newPassword")}>
                      {showPassword.newPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth label="Confirm Password"
              type={showPassword.confirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePasswordVisibility("confirmPassword")}>
                      {showPassword.confirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit" fullWidth variant="contained"
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Reset Password"}
            </Button>
          </form>
        </Box>
      </Box>
    </Paper>
  );
};

export default ResetPasswordPage;
