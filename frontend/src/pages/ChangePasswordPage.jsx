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
// import { toast } from 'react-toastify';
import { swalSuccess, swalError, swalWarning } from "../utils/swal";

import loginImage from "../assets/login-bg.png";
import wavingHand from "../assets/waving-hand.png";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState({
    oldPassword: "",
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please login again.");
      toast.error("Session expired. Please login again.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/agent/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setSuccess("Password changed successfully!");
      swalSuccess("Success", "Password changed successfully!");
      setTimeout(() => {
        navigate("/work-dashboard");
      }, 1500);

    } catch (err) {
      console.error("Change password error:", err);
      const msg = err.message || "Something went wrong. Please try again.";
      setError(msg);
      swalError("Failed", msg);
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
        background: "white",
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        border: "none",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: { xs: "0%", lg: "60%" },
          height: "100vh",
          display: { xs: "none", lg: "flex" },
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={loginImage}
          alt="Change Password Visual"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
      <Box
        sx={{
          width: { xs: "100%", lg: "40%" },
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 0, lg: 0 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5, md: 6 },
            width: "100%",
            maxWidth: { xs: "100%", sm: "450px", md: "500px" },
            background: "white",
            borderRadius: { xs: 0, sm: "16px" },
            height: { xs: "100%", sm: "auto" },
            display: "flex",
            flexDirection: "column",
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
                justifyContent: "left",
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: "#212529",
                  fontSize: { xs: "2rem", sm: "2.125rem", md: "2.25rem" },
                  lineHeight: 1.2,
                }}
              >
                Set New Password
              </Typography>
              <Box
                component="img"
                src={wavingHand}
                alt="Waving hand"
                sx={{
                  width: { xs: "32px", sm: "34px", md: "36px" },
                  height: { xs: "32px", sm: "34px", md: "36px" },
                }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: "#212529",
                fontWeight: 500,
                fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem" },
                textAlign: "left",
              }}
            >
              Create a new secure password for your account
            </Typography>
          </Box>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: "8px",
                "& .MuiAlert-message": { fontSize: "0.875rem" },
              }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: "8px",
                "& .MuiAlert-message": { fontSize: "0.875rem" },
              }}
            >
              {success}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Old Password"
              type="password"
              variant="outlined"
              value={formData.oldPassword || ""}
              onChange={handleChange("oldPassword")}
              required
              disabled={loading}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#6c757d" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              type={showPassword.newPassword ? "text" : "password"}
              variant="outlined"
              value={formData.newPassword}
              onChange={handleChange("newPassword")}
              required
              disabled={loading}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": { borderColor: "#dee2e6" },
                  "&:hover fieldset": { borderColor: "#1C43A6" },
                  "&.Mui-focused fieldset": { borderColor: "#1C43A6" },
                },
                "& .MuiInputLabel-root": {
                  color: "#6c757d",
                  "&.Mui-focused": { color: "#1C43A6" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#6c757d" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("newPassword")}
                      edge="end"
                      sx={{ color: "#6c757d" }}
                      disabled={loading}
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
              variant="outlined"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              required
              disabled={loading}
              sx={{
                mb: 4,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": { borderColor: "#dee2e6" },
                  "&:hover fieldset": { borderColor: "#1C43A6" },
                  "&.Mui-focused fieldset": { borderColor: "#1C43A6" },
                },
                "& .MuiInputLabel-root": {
                  color: "#6c757d",
                  "&.Mui-focused": { color: "#1C43A6" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#6c757d" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                      edge="end"
                      sx={{ color: "#6c757d" }}
                      disabled={loading}
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
              sx={{
                backgroundColor: "#1C43A6",
                color: "white",
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#15337D" },
                "&:disabled": { backgroundColor: "#cccccc" },
                mb: 2,
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Reset Password"
              )}
            </Button>
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography
                component={Link}
                to="/login"
                sx={{
                  color: "#1C43A6",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  "&:hover": {
                    textDecoration: "underline",
                    color: "#15337D",
                  },
                }}
              >
                ← Back to Login
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Paper>
  );
};

export default ChangePasswordPage;