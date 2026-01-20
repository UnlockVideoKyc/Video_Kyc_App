import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Email, CalendarToday } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

import loginImage from "../assets/login-bg.png";
import wavingHand from "../assets/waving-hand.png";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    dateOfBirth: "",
  });

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    
    if (error) setError("");
  };

  const handleGetOTP = async (event) => {
    event.preventDefault();
    setError("");
    
    if (!formData.email || !formData.dateOfBirth) {
      setError("Please fill in all fields");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            email: formData.email,
            dob: formData.dateOfBirth,
          }),
        }
      );

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        
        if (response.status === 404) {
          throw new Error("Server endpoint not found. Please check the backend.");
        } else {
          throw new Error("Server returned an unexpected response.");
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP. Please check your details.");
      }

      // Save for OTP verification
      localStorage.setItem("fp_agtLoginId", data.agtLoginId);
      
      if (data.expiresAt) {
        localStorage.setItem("fp_expiry", data.expiresAt);
      } else {
        const fallbackExpiry = new Date(Date.now() + 5 * 60 * 1000);
        localStorage.setItem("fp_expiry", fallbackExpiry.toISOString());
      }

      localStorage.removeItem("resetToken");
      
      // Navigate to OTP page
      navigate("/forgot-password-otp");
      
    } catch (err) {
      console.error("Forgot password error:", err);
      
      // User-friendly error messages
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setError(`Cannot connect to server. Please check if backend is running on http://localhost:5000`);
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'white',
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        border: 'none',
        overflow: 'hidden'
      }}
    >
      {/* Left Side - Image */}
      <Box
        sx={{
          width: { xs: '0%', lg: '60%' },
          height: '100vh',
          display: { xs: 'none', lg: 'flex' },
          overflow: 'hidden'
        }}
      >
        <Box
          component="img"
          src={loginImage}
          alt="Forgot Password Visual"
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      {/* Right Side - Form */}
      <Box
        sx={{
          width: { xs: '100%', lg: '40%' },
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 0, lg: 0 }
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5, md: 6 },
            width: '100%',
            maxWidth: { xs: '100%', sm: '450px', md: '500px' },
            background: 'white',
            borderRadius: { xs: 0, sm: '16px' },
            height: { xs: '100%', sm: 'auto' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: { xs: 'center', sm: 'flex-start' }
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: 'left' }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{ 
                  fontWeight: 700, 
                  color: '#212529', 
                  fontSize: { xs: '2rem', sm: '2.125rem', md: '2.25rem' }, 
                  lineHeight: 1.2 
                }}
              >
                Forgot Password?
              </Typography>
              <Box
                component="img"
                src={wavingHand}
                alt="Waving hand"
                sx={{ 
                  width: { xs: '32px', sm: '34px', md: '36px' }, 
                  height: { xs: '32px', sm: '34px', md: '36px' } 
                }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{ 
                color: '#212529', 
                fontWeight: 500, 
                fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' },
                textAlign: 'left'
              }}
            >
              Enter your email and date of birth to reset your password
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: '8px',
                '& .MuiAlert-message': { fontSize: '0.875rem' }
              }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleGetOTP} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              value={formData.email}
              onChange={handleChange('email')}
              required
              disabled={loading}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#dee2e6' },
                  '&:hover fieldset': { borderColor: '#1C43A6' },
                  '&.Mui-focused fieldset': { borderColor: '#1C43A6' },
                },
                '& .MuiInputLabel-root': { 
                  color: '#6c757d', 
                  '&.Mui-focused': { color: '#1C43A6' } 
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#6c757d' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              variant="outlined"
              value={formData.dateOfBirth}
              onChange={handleChange('dateOfBirth')}
              required
              disabled={loading}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#dee2e6' },
                  '&:hover fieldset': { borderColor: '#1C43A6' },
                  '&.Mui-focused fieldset': { borderColor: '#1C43A6' },
                },
                '& .MuiInputLabel-root': { 
                  color: '#6c757d', 
                  '&.Mui-focused': { color: '#1C43A6' } 
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday sx={{ color: '#6c757d' }} />
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
                backgroundColor: '#1C43A6',
                color: 'white',
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': { backgroundColor: '#15337D' },
                '&:disabled': { backgroundColor: '#cccccc' },
                mb: 2
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Send Verification Code'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography
                component={Link}
                to="/login"
                sx={{
                  color: '#1C43A6',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  '&:hover': { 
                    textDecoration: 'underline', 
                    color: '#15337D' 
                  }
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

export default ForgotPasswordPage;