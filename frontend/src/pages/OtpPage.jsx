import React, { useEffect, useState, useRef } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import loginImage from '../assets/login-bg.png';

const getTimeLeftFromExpiry = (storageKey) => {
  const expiry = localStorage.getItem(storageKey);
  if (!expiry) return 0;

  const diff = Math.floor(
    (new Date(expiry).getTime() - Date.now()) / 1000
  );

  return diff > 0 ? diff : 0;
};

const formatTime = (seconds) => {
  if (seconds <= 0 || isNaN(seconds)) {
    return "00:00";
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const OtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine if this is for login or forgot password
  const isForgotPassword = location.pathname.includes('forgot-password-otp');
  
  // Configuration based on type
  const config = {
    // For Login OTP
    login: {
      title: "OTP Verification",
      subtitle: "Enter the 6-digit code sent to your email",
      userIdKey: 'userId',
      expiryKey: 'otpExpiry',
      verifyEndpoint: 'http://localhost:5000/api/auth/verify-otp',
      resendEndpoint: 'http://localhost:5000/api/auth/resend-otp',
      successRedirect: '/work-dashboard',
      backLink: '/login',
      backText: 'Back to Login',
      storageCleanup: () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('otpExpiry');
      },
      successStorage: (data) => {
        localStorage.setItem('token', data.token);
      }
    },
    // For Forgot Password OTP
    forgotPassword: {
      title: "OTP Verification",
      subtitle: "Enter the 6-digit code sent to your email",
      userIdKey: 'fp_userId',
      expiryKey: 'fp_expiry',
      verifyEndpoint: 'http://localhost:5000/api/auth/verify-forgot-otp',
      resendEndpoint: 'http://localhost:5000/api/auth/resend-otp',
      successRedirect: '/change-password',
      backLink: '/forgot-password',
      backText: 'Back to Forgot Password',
      storageCleanup: () => {
        localStorage.removeItem('fp_expiry');
        // Don't remove fp_userId - it's needed for reset-password
      },
      successStorage: (data) => {
        localStorage.setItem('resetToken', data.resetToken);
      }
    }
  };

  const currentConfig = isForgotPassword ? config.forgotPassword : config.login;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(() => {
    const time = getTimeLeftFromExpiry(currentConfig.expiryKey);
    return time > 0 ? time : 0;
  });
  const [resending, setResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = getTimeLeftFromExpiry(currentConfig.expiryKey);
      setTimeLeft(newTime > 0 ? newTime : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentConfig.expiryKey]);

  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (error) setError('');
    
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handlePaste(e);
    }
  };

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
      inputRefs.current[5].focus();
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    const userId = localStorage.getItem(currentConfig.userIdKey);
    if (!userId) {
      setError('Session expired. Please restart the process.');
      return;
    }

    if (otp.some(digit => digit === '')) {
      setError('Please enter all 6 digits of the OTP');
      return;
    }

    const otpString = otp.join('');
    setLoading(true);

    try {
      const response = await fetch(
        currentConfig.verifyEndpoint,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: Number(userId),
            otp: otpString,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      // Perform type-specific success actions
      currentConfig.successStorage(data);
      currentConfig.storageCleanup();
      
      navigate(currentConfig.successRedirect);
      
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Failed to verify OTP');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP
  const handleResendOtp = async () => {
    const userId = localStorage.getItem(currentConfig.userIdKey);
    if (!userId) {
      setError('Session expired. Please restart the process.');
      return;
    }

    setResending(true);
    setError('');

    try {
      const response = await fetch(
        currentConfig.resendEndpoint,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: Number(userId) }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      if (data.expiresAt) {
        localStorage.setItem(currentConfig.expiryKey, data.expiresAt);
      } else {
        const newExpiry = new Date(Date.now() + 5 * 60 * 1000);
        localStorage.setItem(currentConfig.expiryKey, newExpiry.toISOString());
      }

      setTimeLeft(300);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();

    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

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
          alt="OTP Verification"
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
            <Typography
              variant="h3"
              component="h1"
              sx={{ 
                fontWeight: 700, 
                color: '#212529', 
                fontSize: { xs: '2rem', sm: '2.125rem', md: '2.25rem' }, 
                lineHeight: 1.2,
                textAlign: 'left',
                mb: 1
              }}
            >
              {currentConfig.title}
            </Typography>
            <Typography
              variant="h6"
              sx={{ 
                color: '#212529', 
                fontWeight: 500, 
                fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' },
                textAlign: 'left'
              }}
            >
              {currentConfig.subtitle}
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
          <Box component="form" onSubmit={handleVerifyOtp} sx={{ width: '100%' }}>
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
                  disabled={loading || timeLeft <= 0}
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
                      '&.Mui-disabled fieldset': { 
                        borderColor: '#e9ecef',
                        backgroundColor: '#f8f9fa'
                      }
                    },
                    '& .MuiInputBase-input': {
                      textAlign: 'center',
                      padding: '12px 8px',
                    }
                  }}
                />
              ))}
            </Box>

            {/* Timer */}
            <Typography variant="caption" display="block" mb={2} sx={{ 
              fontSize: '0.9rem',
              color: timeLeft < 60 ? '#f44336' : '#6c757d'
            }}>
              Code expires in <span style={{ fontWeight: 'bold' }}>
                {formatTime(timeLeft)}
              </span>
            </Typography>

            {/* Resend Button */}
            <Button
              variant="text"
              onClick={handleResendOtp}
              disabled={resending || timeLeft > 290}
              sx={{ 
                mb: 3,
                color: '#1C43A6',
                fontSize: '0.875rem',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': { 
                  backgroundColor: 'rgba(28, 67, 166, 0.04)',
                  textDecoration: 'underline'
                },
                '&.Mui-disabled': {
                  color: '#adb5bd'
                }
              }}
            >
              {resending ? 'Sending...' : 'Resend Code'}
            </Button>

            {/* Verify Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || timeLeft <= 0 || otp.some(digit => digit === '')}
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
                mb: 3
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : timeLeft <= 0 ? (
                'Code Expired'
              ) : (
                'Verify & Continue'
              )}
            </Button>

            {/* Back Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                component={Link}
                to={currentConfig.backLink}
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
                ← {currentConfig.backText}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Paper>
  );
};

export default OtpPage;