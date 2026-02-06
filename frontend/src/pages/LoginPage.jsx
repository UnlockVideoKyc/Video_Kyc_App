import React, { useState, useEffect } from "react";
import API_BASE_URL from "../config/api";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { VisibilityOff, Visibility, Email, Lock } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { swalSuccess, swalError, swalWarning } from "../utils/swal";
import loginImage from "../assets/login-bg.png";
import wavingHand from "../assets/waving-hand.png";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const roleMap = {
    agent: 1,
    auditor: 2,
    "super-admin": 3,
  };

  useEffect(() => {
    localStorage.removeItem("agtLoginId");
    localStorage.removeItem("otpExpiry");
    localStorage.removeItem("token");
    localStorage.removeItem("roleId");
  }, []);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (error) setError("");
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password || !formData.role) {
      setError("Please fill all fields");
      swalWarning("Validation Error", "Please fill all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      swalWarning("Invalid Email", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          roleId: roleMap[formData.role],
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an unexpected response.");
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Login failed. Please check your credentials."
        );
      }

      localStorage.setItem("agtLoginId", data.agtLoginId);
      localStorage.setItem("roleId", roleMap[formData.role]);

      if (data.expiresAt) {
        localStorage.setItem("otpExpiry", data.expiresAt);
      } else {
        const fallbackExpiry = new Date(Date.now() + 5 * 60 * 1000);
        localStorage.setItem("otpExpiry", fallbackExpiry.toISOString());
      }

      localStorage.removeItem("token");

      await swalSuccess("OTP Sent", "Check your email for OTP");
      navigate("/otp");

    } catch (err) {
      let errMsg =
        err.message || "Network error. Please check your connection.";
      if (
        err.message?.includes("Failed to fetch") ||
        err.message?.includes("NetworkError")
      ) {
        errMsg = "Cannot connect to server. Please try again later.";
      }

      setError(errMsg);
      swalError("Login Failed", errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        overflow: "hidden",
      }}
    >
      {/* LEFT IMAGE */}
      <Box
        sx={{
          width: { xs: "0%", lg: "60%" },
          display: { xs: "none", lg: "flex" },
        }}
      >
        <Box
          component="img"
          src={loginImage}
          alt="Login Visual"
          sx={{ width: "100%", height: "100vh", objectFit: "cover" }}
        />
      </Box>

      {/* RIGHT FORM */}
      <Box
        sx={{
          width: { xs: "100%", lg: "40%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Paper elevation={0} sx={{ width: "100%", maxWidth: 460, px: 4 }}>
          {/* HEADER */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography fontSize={32} fontWeight={700}>
                Hello, Again!
              </Typography>
              <Box component="img" src={wavingHand} sx={{ width: 32 }} />
            </Box>
            <Typography fontSize={16} fontWeight={500}>
              Welcome Back
            </Typography>
          </Box>

          {/* ERROR */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              value={formData.email}
              onChange={handleChange("email")}
              disabled={loading}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Enter your Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange("password")}
              disabled={loading}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel>Select Role</InputLabel>
              <Select
                value={formData.role}
                onChange={handleChange("role")}
                label="Select Role"
              >
                <MenuItem value="agent">Agent</MenuItem>
                <MenuItem value="auditor">Auditor</MenuItem>
                <MenuItem value="super-admin">Super Admin</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                height: 52,
                borderRadius: "10px",
                backgroundColor: "#1E40AF",
                color: "#fff",
                mb: 2,
                "&:hover": { backgroundColor: "#1E3A8A" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Login"
              )}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Typography
                component={Link}
                to="/forgot-password"
                sx={{ color: "#1E40AF", textDecoration: "underline" }}
              >
                Forgot Password?
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Paper>
  );
};

export default LoginPage;