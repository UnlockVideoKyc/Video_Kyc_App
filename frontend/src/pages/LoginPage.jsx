// import React, { useState } from 'react';
// import {
//   Box,
//   TextField,
//   InputAdornment,
//   Button,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Paper,
//   Grid,
//   Container,
// } from '@mui/material';
// import {
//   Email as EmailIcon,
//   Lock as LockIcon,
//   Person as PersonIcon
// } from '@mui/icons-material';

// // Import images
// import loginImage from '../assets/login-bg.png'; 
// import wavingHand from '../assets/waving-hand.png'; 

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     role: ''
//   });

//   const handleChange = (field) => (event) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: event.target.value
//     }));
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log('Login data:', formData);
//   };

//   return (
//     <Container 
//       maxWidth={false} 
//       disableGutters 
//       sx={{ 
//         height: '100vh',
//         overflow: 'hidden'
//       }}
//     >
//       <Grid container sx={{ height: '100vh' }}>
//         {/* Left Side - Image */}
//         <Grid 
//           item 
//           xs={false}
//           lg={7}
//           sx={{
//             display: { xs: 'none', lg: 'block' },
//             height: '100vh',
//             overflow: 'hidden'
//           }}
//         >
//           <Box
//             component="img"
//             src={loginImage}
//             alt="Login Background"
//             sx={{
//               width: '100%',
//               height: '100%',
//               objectFit: 'cover',
//               display: 'block'
//             }}
//           />
//         </Grid>

//         {/* Right Side - Login Content */}
//         <Grid 
//           item 
//           xs={12}
//           lg={5}
//           sx={{
//             height: '100vh',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: 'white',
//             overflow: 'auto',
//           }}
//         >
//           <Paper 
//             elevation={0}
//             sx={{
//               width: '100%',
//               maxWidth: {
//                 xs: '400px',
//                 md: '450px',
//                 lg: '400px',
//                 xl: '450px'
//               },
//               backgroundColor: 'transparent',
//               p: { 
//                 xs: 3,
//                 md: 4,
//                 lg: 4,
//                 xl: 5
//               },
//               mx: {
//                 xs: 2,
//                 md: 3,
//                 lg: 4,
//               }
//             }}
//           >
//             {/* Header Section */}
//             <Box sx={{ 
//               mb: 4, 
//               textAlign: { xs: 'center', lg: 'left' }
//             }}>
//               {/* Hello, Again! with waving hand */}
//               <Box sx={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 gap: 1,
//                 mb: 1,
//                 justifyContent: { xs: 'center', lg: 'flex-start' }
//               }}>
//                 <Typography 
//                   variant="h3" 
//                   component="h1"
//                   sx={{
//                     fontWeight: 700,
//                     color: '#212529',
//                     fontSize: { 
//                       xs: '1.75rem',
//                       md: '2rem',
//                       lg: '2.125rem',
//                       xl: '2.25rem'
//                     },
//                     lineHeight: 1.2
//                   }}
//                 >
//                   Hello, Again!
//                 </Typography>
//                 <Box
//                   component="img"
//                   src={wavingHand}
//                   alt="Waving hand"
//                   sx={{
//                     width: { 
//                       xs: '28px', 
//                       md: '32px', 
//                       lg: '34px',
//                       xl: '36px'
//                     },
//                     height: { 
//                       xs: '28px', 
//                       md: '32px', 
//                       lg: '34px',
//                       xl: '36px'
//                     }
//                   }}
//                 />
//               </Box>

//               {/* Subheading */}
//               <Typography 
//                 variant="h6"
//                 sx={{
//                   color: '#6c757d',
//                   fontWeight: 400,
//                   fontSize: { 
//                     xs: '0.9rem', 
//                     md: '1rem', 
//                     lg: '1.05rem',
//                     xl: '1.1rem'
//                   }
//                 }}
//               >
//                 Welcome Back
//               </Typography>
//             </Box>

//             {/* Login Form */}
//             <Box component="form" onSubmit={handleSubmit}>
//               {/* Email Field */}
//               <TextField
//                 fullWidth
//                 label="Email Address"
//                 variant="outlined"
//                 value={formData.email}
//                 onChange={handleChange('email')}
//                 sx={{
//                   mb: 3,
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': {
//                       borderColor: '#dee2e6',
//                     },
//                     '&:hover fieldset': {
//                       borderColor: '#1C43A6',
//                     },
//                     '&.Mui-focused fieldset': {
//                       borderColor: '#1C43A6',
//                     },
//                   },
//                   '& .MuiInputLabel-root': {
//                     color: '#6c757d',
//                     '&.Mui-focused': {
//                       color: '#1C43A6',
//                     },
//                   },
//                 }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <EmailIcon sx={{ color: '#6c757d' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//               />

//               {/* Password Field */}
//               <TextField
//                 fullWidth
//                 label="Enter your Password"
//                 type="password"
//                 variant="outlined"
//                 value={formData.password}
//                 onChange={handleChange('password')}
//                 sx={{
//                   mb: 3,
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': {
//                       borderColor: '#dee2e6',
//                     },
//                     '&:hover fieldset': {
//                       borderColor: '#1C43A6',
//                     },
//                     '&.Mui-focused fieldset': {
//                       borderColor: '#1C43A6',
//                     },
//                   },
//                   '& .MuiInputLabel-root': {
//                     color: '#6c757d',
//                     '&.Mui-focused': {
//                       color: '#1C43A6',
//                     },
//                   },
//                 }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <LockIcon sx={{ color: '#6c757d' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//               />

//               {/* Role Dropdown */}
//               <FormControl fullWidth sx={{ mb: 4 }}>
//                 <InputLabel 
//                   sx={{
//                     color: '#6c757d',
//                     '&.Mui-focused': {
//                       color: '#1C43A6',
//                     },
//                   }}
//                 >
//                   Select Role
//                 </InputLabel>
//                 <Select
//                   value={formData.role}
//                   onChange={handleChange('role')}
//                   label="Select Role"
//                   startAdornment={
//                     <InputAdornment position="start" sx={{ mr: 1 }}>
//                       <PersonIcon sx={{ color: '#6c757d' }} />
//                     </InputAdornment>
//                   }
//                   sx={{
//                     '& .MuiOutlinedInput-notchedOutline': {
//                       borderColor: '#dee2e6',
//                     },
//                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                       borderColor: '#1C43A6',
//                     },
//                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                       borderColor: '#1C43A6',
//                     },
//                   }}
//                 >
//                   <MenuItem value="agent">Agent</MenuItem>
//                   <MenuItem value="auditor">Auditor</MenuItem>
//                   <MenuItem value="super-admin">Super Admin</MenuItem>
//                 </Select>
//               </FormControl>

//               {/* Login Button */}
//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 sx={{
//                   backgroundColor: '#1C43A6',
//                   color: 'white',
//                   py: 1.5,
//                   fontSize: '1rem',
//                   fontWeight: 500,
//                   textTransform: 'none',
//                   borderRadius: '4px',
//                   '&:hover': {
//                     backgroundColor: '#15337D',
//                   },
//                   mb: 2
//                 }}
//               >
//                 Login
//               </Button>

//               {/* Forgot Password Link */}
//               <Box sx={{ textAlign: 'center' }}>
//                 <Typography
//                   component="a"
//                   href="#"
//                   sx={{
//                     color: '#1C43A6',
//                     textDecoration: 'none',
//                     fontSize: '0.875rem',
//                     fontWeight: 500,
//                     '&:hover': {
//                       textDecoration: 'underline',
//                       color: '#15337D'
//                     }
//                   }}
//                 >
//                   Forgot Password?
//                 </Typography>
//               </Box>
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default LoginPage;

import React, { useState } from 'react';
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
} from '@mui/material';
import { VisibilityOff, Visibility, Email, Lock } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

// Import your images
import loginImage from '../assets/login-bg.png';
import wavingHand from '../assets/waving-hand.png';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  if (!formData.email || !formData.password || !formData.role) {
    alert("Please fill all fields");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      }
    );

    // If backend returned error status
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Login failed");
    }

    const data = await response.json();

    console.log("Login response:", data);

    // Save userId
    localStorage.setItem("userId", data.userId);

    // Save OTP expiry
    if (data.expiresAt) {
      localStorage.setItem("otpExpiry", data.expiresAt);
    } else {
      const fallbackExpiry = new Date(Date.now() + 5 * 60 * 1000);
      localStorage.setItem("otpExpiry", fallbackExpiry.toISOString());
    }

    // Clear old token if any
    localStorage.removeItem("token");

    // Redirect to OTP page
    navigate("/otp");
  } catch (error) {
    console.error("Login error:", error);
    alert(error.message || "Network error. Please try again.");
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
          alt="Login Visual"
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      {/* Right Side - Login Form */}
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
                Hello, Again!
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
                display: 'flex' 
              }}
            >
              Welcome Back
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
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
              label="Enter your Password"
              type={showPassword ? 'text' : 'password'} // Toggle between text and password
              variant="outlined"
              value={formData.password}
              onChange={handleChange('password')}
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
                    <Lock sx={{ color: '#6c757d' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{ color: '#6c757d' }}
                      disabled={loading}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth sx={{ mb: 4 }} disabled={loading}>
              <InputLabel sx={{ 
                color: '#6c757d', 
                '&.Mui-focused': { color: '#1C43A6' } 
              }}>
                Select Role
              </InputLabel>
              <Select
                value={formData.role}
                onChange={handleChange('role')}
                label="Select Role"
                required
                sx={{
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#dee2e6' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1C43A6' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1C43A6' },
                }}
              >
                <MenuItem value="agent">Agent</MenuItem>
                <MenuItem value="auditor">Auditor</MenuItem>
                <MenuItem value="super-admin">Super Admin</MenuItem>
              </Select>
            </FormControl>

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
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography
                component={Link}
                to="/forgot-password"
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
