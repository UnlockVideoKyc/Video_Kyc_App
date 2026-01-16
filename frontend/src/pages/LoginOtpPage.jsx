import React, { useEffect, useState, useRef } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material';
import { Lock } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

import loginImage from '../assets/login-bg.png';

const getTimeLeftFromExpiry = () => {
  const expiry = localStorage.getItem('otpExpiry');
  if (!expiry) return 0;

  const diff = Math.floor(
    (new Date(expiry).getTime() - Date.now()) / 1000
  );

  return diff > 0 ? diff : 0;
};

// Helper function to format time properly
const formatTime = (seconds) => {
  if (seconds <= 0 || isNaN(seconds)) {
    return "00:00";
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const LoginOtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(() => {
    const time = getTimeLeftFromExpiry();
    return time > 0 ? time : 0;
  });
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  
  // Create refs for each OTP input
  const inputRefs = useRef([]);

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // ⏱ Countdown - Fixed to handle negative values
  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = getTimeLeftFromExpiry();
      setTimeLeft(newTime > 0 ? newTime : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input if a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1].focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handlePaste(e);
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const pastedOtp = pastedData.split('');
      const newOtp = [...otp];
      
      for (let i = 0; i < 6; i++) {
        if (i < pastedOtp.length) {
          newOtp[i] = pastedOtp[i];
        }
      }
      
      setOtp(newOtp);
      // Focus the last input after paste
      inputRefs.current[5].focus();
    }
  };

  // ✅ VERIFY OTP
const handleVerifyOtp = async (e) => {
  e.preventDefault();

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Session expired. Please login again.");
    navigate("/login");
    return;
  }

  if (otp.some(digit => digit === "")) {
    alert("Please enter all 6 digits of the OTP");
    return;
  }

  const otpString = otp.join("");

  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/verify-otp", 
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(userId),
          otp: otpString,
        }),
      }
    );

    
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      alert(data.message || "Invalid OTP");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
      return;
    }

    // Save JWT
    localStorage.setItem("token", data.token);

    // Cleanup
    localStorage.removeItem("userId");
    localStorage.removeItem("otpExpiry");

    navigate("/work-dashboard");
  } catch (error) {
    console.error("OTP verify error:", error);
    alert("Something went wrong. Please try again.");
  }
};


  // 🔁 RESEND OTP
  const handleResendOtp = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    try {
      setResending(true);

      const response = await fetch(
        '/api/auth/resend-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: Number(userId) }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to resend OTP');
        return;
      }

      alert('New OTP sent to your email');

      // Save new expiry sent from backend
      if (data.expiresAt) {
        localStorage.setItem('otpExpiry', data.expiresAt);
      } else {
        // Fallback: set 5 minutes from now if backend doesn't provide expiry
        const newExpiry = new Date(Date.now() + 5 * 60 * 1000);
        localStorage.setItem('otpExpiry', newExpiry.toISOString());
      }

      // Reset timer to 5 minutes (300 seconds)
      setTimeLeft(300);
      
      // Clear OTP inputs
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();

    } catch (err) {
      console.error(err);
      alert('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  // Auto-focus first input on component mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  return (
    <Paper sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Image */}
      <Box sx={{ width: '60%', display: { xs: 'none', lg: 'block' } }}>
        <img
          src={loginImage}
          alt="OTP"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      {/* Right Form */}
      <Box sx={{ 
        width: { xs: '100%', lg: '40%' }, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Paper sx={{ p: 5, maxWidth: 420, width: '100%' }} elevation={0}>
          <Typography variant="h4" fontWeight={700} mb={1}>
            OTP Verification
          </Typography>
          <Typography mb={3}>
            Enter the 6-digit code sent to your email
          </Typography>

          <form onSubmit={handleVerifyOtp}>
            {/* 6 OTP Input Boxes */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mb: 3,
              gap: 1
            }}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <TextField
                  key={index}
                  inputRef={el => inputRefs.current[index] = el}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  inputProps={{
                    maxLength: 1,
                    style: { 
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 'bold'
                    }
                  }}
                  sx={{
                    width: '55px',
                    height: '60px',
                    '& .MuiOutlinedInput-root': {
                      height: '100%',
                      '& fieldset': { 
                        borderColor: otp[index] ? '#1C43A6' : '#dee2e6',
                        borderWidth: otp[index] ? '2px' : '1px'
                      },
                      '&:hover fieldset': { borderColor: '#1C43A6' },
                      '&.Mui-focused fieldset': { 
                        borderColor: '#1C43A6',
                        borderWidth: '2px'
                      },
                    },
                    '& .MuiInputBase-input': {
                      textAlign: 'center',
                      padding: '12px 8px',
                    }
                  }}
                />
              ))}
            </Box>

            {/* ⏱ TIMER - FIXED DISPLAY */}
            <Typography variant="caption" display="block" mb={1} sx={{ fontSize: '0.9rem' }}>
              OTP expires in <span style={{ fontWeight: 'bold', color: timeLeft < 60 ? '#f44336' : '#1C43A6' }}>
                {formatTime(timeLeft)}
              </span>
            </Typography>

            {/* 🔁 RESEND */}
            <Button
              variant="text"
              onClick={handleResendOtp}
              disabled={resending || timeLeft > 290}
              sx={{ 
                mb: 2,
                color: '#1C43A6',
                '&:hover': { backgroundColor: 'rgba(28, 67, 166, 0.04)' }
              }}
            >
              {resending ? 'Sending...' : 'Resend OTP'}
            </Button>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 1, 
                py: 1.4,
                backgroundColor: '#1C43A6',
                '&:hover': { backgroundColor: '#15337D' }
              }}
              disabled={timeLeft <= 0 || otp.some(digit => digit === '')}
            >
              {timeLeft <= 0 ? 'OTP Expired' : 'Verify & Continue'}
            </Button>

            <Typography
              component={Link}
              to="/login"
              sx={{ 
                display: 'block', 
                textAlign: 'center', 
                mt: 2,
                textDecoration: 'none',
                color: '#1C43A6',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Back to Login
            </Typography>
          </form>
        </Paper>
      </Box>
    </Paper>
  );
};

export default LoginOtpPage;
