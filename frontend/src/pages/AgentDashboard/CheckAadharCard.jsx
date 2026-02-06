// import { useState } from "react";
// import VideoCallAgentSection from "../../components/VideoCallAgentSection"
// import VideoCallCustomerSection from "../../components/VideoCallCustomerSection"
// import FaceMatchAadhaar from "../../components/FaceMatchAadhaar"
// import HorizontalStepper from "../../components/HorizontalStepper"

// const CheckAadharCard = () => {
//   const [isFullScreen, setIsFullScreen] = useState(false);

//   const handleFullScreenToggle = (fullScreenState) => {
//     setIsFullScreen(fullScreenState);
//   };

//   return (
//     <>
//       <div className="row">
//         {/* <HorizontalStepper/> */}
//         <div className={isFullScreen ? "col-md-9" : "col-md-3"}>
//           <VideoCallAgentSection onFullScreenToggle={handleFullScreenToggle}/>
//         </div>
//         {!isFullScreen && (
//           <div className="col-md-3">
//             <VideoCallCustomerSection/>
//           </div>
//         )}
//         <div className={isFullScreen ? "col-md-3" : "col-md-6"}>
//           <FaceMatchAadhaar/>
//         </div>
//       </div>
//     </>
//   )
// }

// export default CheckAadharCard;

import { useState } from "react";
import VideoCallAgentSection from "../../components/VideoCallAgentSection"
import VideoCallCustomerSection from "../../components/VideoCallCustomerSection"
import { Box, Typography, Divider, Button, TextField } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import ReplayIcon from '@mui/icons-material/Replay';
import dummyImage from "../../assets/dummy.png";
import { useNavigate } from 'react-router-dom'; 

const CheckAadharCard = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [status, setStatus] = useState('initial'); 
  
  const navigate = useNavigate();

  const handleFullScreenToggle = (fullScreenState) => {
    setIsFullScreen(fullScreenState);
  };

  const handleNextClick = () => {
    navigate('/check-aadhar-details-table'); 
  };

  const handleApprove = () => {
    setStatus('approved');
  };

  const handleReject = () => {
    setStatus('rejected');
  };

  const handleUndo = () => {
    setStatus('initial');
  };

  return (
    <>
      <div className="row">
        {/* <HorizontalStepper/> */}
        <div className={isFullScreen ? "col-md-9" : "col-md-3"}>
          <VideoCallAgentSection onFullScreenToggle={handleFullScreenToggle}/>
        </div>
        {!isFullScreen && (
          <div className="col-md-3">
            <VideoCallCustomerSection/>
          </div>
        )}
        <div className={isFullScreen ? "col-md-3" : "col-md-6"}>
          <Box sx={{
            borderRadius: '8px',
            overflow: 'hidden',
            height: '100%',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: 'white',
            p: 3
          }}>
            <Typography variant="h6" sx={{ 
              color: '#1C43A6',
              fontWeight: 600,  
              mb: 2,
              fontSize: '1.25rem'
            }}>
              Face Match between Aadhaar and Live Photo
            </Typography>
            
            <Divider sx={{ mb: 2 }} />

            {/* Images */}
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              mb: 3,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center'
            }}>
              {/* Live Photo */}
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <Box sx={{ 
                  width: 200,
                  height: 200,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#343a40'
                }}>
                  <Box
                    component="img"
                    src={dummyImage}
                    alt="Captured Face"
                    sx={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover" 
                    }}
                  />
                </Box>
                <Typography sx={{ 
                  mt: 1,
                  color: 'black',
                  fontWeight: 500,
                  fontSize: '0.875rem'
                }}>
                  Live Photo
                </Typography>
              </Box>

              {/* Aadhaar Photo */}
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <Box sx={{ 
                  width: 200,
                  height: 200,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#343a40'
                }}>
                  <Box
                    component="img"
                    src={dummyImage}
                    alt="Aadhaar Photo"
                    sx={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover" 
                    }}
                  />
                </Box>
                <Typography sx={{ 
                  mt: 1,
                  color: 'black',
                  fontWeight: 500,
                  fontSize: '0.875rem'
                }}>
                  Aadhaar Photo
                </Typography>
              </Box>
            </Box>

            {/* Face Match Success Message */}
            <Box sx={{ 
              backgroundColor: 'rgba(40, 167, 69, 0.1)',
              borderRadius: '4px',
              px: 2,
              py: 1,
              mb: 2,
              width: '100%',
              textAlign: 'center'
            }}>
              <Typography sx={{ 
                color: '#28a745',
                fontWeight: 500
              }}>
                <strong>100%</strong> - Face Match is Successfully Completed.
              </Typography>
            </Box>

            {/* Approval Section */}
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              gap: 2
            }}>
              <Typography sx={{ 
                color: '#1C43A6',
                fontSize: '16px',
                fontWeight: 500
              }}>
                Does the face Match with Aadhaar Photo?
              </Typography>

            {status === 'initial' ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleApprove}
                  sx={{
                    minWidth: 32,
                    width: 32,
                    height: 32,
                    p: 0,
                    borderRadius: '50%',
                    backgroundColor: '#017D1C',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#016518',
                    }
                  }}
                >
                  <Check sx={{ fontSize: '1rem' }} />
                </Button>
                <Button
                  variant="contained"
                  onClick={handleReject}
                  sx={{
                    minWidth: 32,
                    width: 32,
                    height: 32,
                    p: 0,
                    borderRadius: '50%',
                    backgroundColor: '#F10101',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#D00000',
                    }
                  }}
                >
                  <Close sx={{ fontSize: '1rem' }} />
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: status === 'approved' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                    color: status === 'approved' ? '#28a745' : '#dc3545',
                    textTransform: 'none',
                    px: 2,
                    py: 0.5,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: status === 'approved' ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)'
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    mr: 1,
                    backgroundColor: status === 'approved' ? '#28a745' : '#dc3545',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    justifyContent: 'center'
                  }}>
                    {status === 'approved' ? (
                      <Check sx={{ color: 'white', fontSize: '0.8rem' }} />
                    ) : (
                      <Close sx={{ color: 'white', fontSize: '0.8rem' }} />
                    )}
                  </Box>
                  {status === 'approved' ? 'Approved' : 'Rejected'}
                </Button>
                
                <Button
                  variant="contained"
                  onClick={handleUndo}
                  sx={{
                    backgroundColor: 'rgba(28, 67, 166, 0.1)',
                    color: '#1C43A6',
                    textTransform: 'none',
                    px: 2,
                    py: 0.5,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(28, 67, 166, 0.2)'
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    mr: 1,
                    backgroundColor: '#1C43A6',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    justifyContent: 'center'
                  }}>
                    <ReplayIcon sx={{ color: 'white', fontSize: '0.8rem' }} />
                  </Box>
                  Undo
                </Button>
              </Box>
            )}
          </Box>

            {/* Remark Field */}
            <TextField
              size="small"
              placeholder="Add remark (optional)"
              fullWidth
              sx={{ mt: 1, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#dee2e6' } } }}
            />

            
            <Divider sx={{ mb: 3 }} />
            
            {/* Next Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={handleNextClick} 
                variant="contained" 
                disabled={status === 'initial'}
                sx={{ 
                  backgroundColor: status !== 'initial' ? '#1C43A6' : '#e9ecef',
                  color: status !== 'initial' ? 'white' : '#adb5bd',
                  '&:hover': { 
                    backgroundColor: status !== 'initial' ? '#15337D' : '#e9ecef' 
                  },
                  textTransform: 'none',
                  px: 4,
                  py: 1,
                  fontWeight: 500
                }}
              >
                Next &gt;&gt;
              </Button>
            </Box>
          </Box>
        </div>
      </div>
    </>
  )
}

export default CheckAadharCard;