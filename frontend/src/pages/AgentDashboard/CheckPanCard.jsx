// import { useState } from "react";
// import VideoCallAgentSection from "../../components/VideoCallAgentSection"
// import VideoCallCustomerSection from "../../components/VideoCallCustomerSection"
// import CheckFacePan from "../../components/CheckFacePan"
// // import FaceMatchPan from "../../components/FaceMatchPan"
// // import HorizontalStepper from "../../components/HorizontalStepper"

// const CheckPanCard = () => {
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
//           {/* <FaceMatchPan/> */}
//           <CheckFacePan/>
//         </div>
//       </div>
//     </>
//   )
// }

// export default CheckPanCard;

import { useState } from "react";
import VideoCallAgentSection from "../../components/VideoCallAgentSection"
import VideoCallCustomerSection from "../../components/VideoCallCustomerSection"
import { Box, Typography, Divider, Button, TextField } from '@mui/material';
import { CameraAltOutlined, Check } from '@mui/icons-material';
import dummyImage from "../../assets/pan.png";
import { useNavigate } from 'react-router-dom'; 

const CheckPanCard = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [status, setStatus] = useState('initial'); 
  
  const navigate = useNavigate();

  const handleFullScreenToggle = (fullScreenState) => {
    setIsFullScreen(fullScreenState);
  };

  const handleNextClick = () => {
    navigate('/check-pan-details-table'); 
  };

  const handleCapture = () => {
    setStatus('captured');
  };

  const handleRetake = () => {
    setStatus('initial');
  };

  const handleConfirm = () => {
    setStatus('confirmed');
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
              PAN Card Upload
            </Typography>
            
            <Divider sx={{ mb: 2 }} />

            {/* Image Placeholder */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3
            }}>
              <Box sx={{ 
                width: 420,
                height: 250,
                borderRadius: '3%',
                overflow: 'hidden',
                backgroundColor: '#EFEFEF',
                mb: 2,
                border: '2px solid #dee2e6'
              }}>
                {status !== 'initial' && (
                  <Box
                    component="img"
                    src={dummyImage}
                    alt="Face Image"
                    sx={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "contain" 
                    }}
                  />
                )}
              </Box>

              {status === 'initial' ? (
                <Button 
                  variant="contained"
                  startIcon={<CameraAltOutlined />}
                  onClick={handleCapture}
                  sx={{ 
                    backgroundColor: '#1C43A6',
                    '&:hover': { backgroundColor: '#15337D' },
                    textTransform: 'none',
                    px: 4,
                    py: 1,
                    borderRadius: '4px',
                    fontWeight: 500
                  }}
                >
                  Capture
                </Button>
              ) : status === 'captured' ? (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="outlined"
                    onClick={handleRetake}
                    sx={{ 
                      color: '#1C43A6',
                      borderColor: '#1C43A6',
                      textTransform: 'none',
                      px: 4,
                      py: 1,
                      borderRadius: '4px',
                      fontWeight: 500,
                      '&:hover': {
                        borderColor: '#15337D',
                        backgroundColor: 'rgba(28, 67, 166, 0.04)'
                      }
                    }}
                  >
                    Retake
                  </Button>
                  <Button 
                    variant="contained"
                    onClick={handleConfirm}
                    sx={{ 
                      backgroundColor: '#1C43A6',
                      '&:hover': { backgroundColor: '#15337D' },
                      textTransform: 'none',
                      px: 4,
                      py: 1,
                      borderRadius: '4px',
                      fontWeight: 500
                    }}
                  >
                    Confirm
                  </Button>
                </Box>
              ) : (
                <Box sx={{ 
                  backgroundColor: 'rgba(40, 167, 69, 0.1)',
                  borderRadius: '4px',
                  px: 2,
                  py: 1,
                  width: '100%',
                  textAlign: 'center'
                }}>
                  <Typography sx={{ 
                    color: '#28a745',
                    fontWeight: 500
                  }}>
                    <strong>Pan Captured Successfully</strong>
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Optional Remark Field (shown after confirmation) */}
            {status === 'confirmed' && (
              <TextField
                size="small"
                placeholder="Add remark (optional)"
                fullWidth
                sx={{ mt: 1, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#dee2e6' } } }}
              />
            )}
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Next Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={handleNextClick} 
                variant="contained" 
                disabled={status !== 'confirmed'}
                sx={{ 
                  backgroundColor: status === 'confirmed' ? '#1C43A6' : '#e9ecef',
                  color: status === 'confirmed' ? 'white' : '#adb5bd',
                  '&:hover': { 
                    backgroundColor: status === 'confirmed' ? '#15337D' : '#e9ecef' 
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

export default CheckPanCard;