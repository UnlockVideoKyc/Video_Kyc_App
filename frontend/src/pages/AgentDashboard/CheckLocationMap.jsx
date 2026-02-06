// import { useState } from "react";
// import VideoCallAgentSection from "../../components/VideoCallAgentSection"
// import VideoCallCustomerSection from "../../components/VideoCallCustomerSection"
// import HorizontalStepper from "../../components/HorizontalStepper"
// import Checklocation from "../../components/Checklocation"

// const CheckLocationMap = () => {
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
//           <Checklocation/>
//         </div>
//       </div>
//     </>
//   )
// }

// export default CheckLocationMap;

import { useState } from "react";
import VideoCallAgentSection from "../../components/VideoCallAgentSection"
import VideoCallCustomerSection from "../../components/VideoCallCustomerSection"
import HorizontalStepper from "../../components/HorizontalStepper"
import { Box, Typography, Divider, Button } from '@mui/material';
import Check from '@mui/icons-material/Check';
import mapImage from "../../assets/map.png";
import { useNavigate } from 'react-router-dom'; 

const CheckLocationMap = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const navigate = useNavigate();

  const handleFullScreenToggle = (fullScreenState) => {
    setIsFullScreen(fullScreenState);
  };

  const handleNextClick = () => {
    navigate('/question-answer'); 
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
              Check Location
            </Typography>
            
            <Divider sx={{ mb: 2 }} />

          {/* Map Area */}
            <Box sx={{ 
              position: 'relative',
              height: "250px", 
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#343a40',
              mb: 2
            }}>
              <Box
                component="img"
                src={mapImage}
                alt="Map Image"
                sx={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover" 
                }}
              />
            </Box>

          <Box>
            <Box component="p" sx={{ margin: "4px 0", fontSize: '16px' }}>
              Location:  <strong>F2FV-MH5, Mumbai-Maharashtra 401209, India</strong>
            </Box>
            <Box component="p" sx={{ margin: "4px 0", fontSize: '16px' }}>
              IP Address: <strong>223.184.132.40</strong>
            </Box>
            <Box component="p" sx={{ margin: "4px 0", fontSize: '16px' }}>
              Latitude and Longitude: <strong>27.47618744.257895</strong>
            </Box>
          </Box>


          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1,  
            mb: 3,
            mt: 2,
            flexWrap: 'wrap'
          }}>
            {/* Check mark box */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1  
            }}>
              <Box sx={{
                width: 24,
                height: 24,
                backgroundColor: '#1C43A6',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Check sx={{ color: 'white', fontSize: '1rem' }} />
              </Box>
              <Typography sx={{ 
                fontSize: '16px',
                fontWeight: 600,
                color: '#1C43A6'
              }}>
                VPN Not Detected
              </Typography>
            </Box>
          
            {/* Vertical Divider */}
            <Divider orientation="vertical" flexItem sx={{ 
              borderColor: '#dee2e6',
              height: '20px',
              mx: 0.5  
            }} />
          
            <Typography sx={{ 
              fontSize: '16px',
              fontWeight: 600,
              color: '#1C43A6'
            }}>
              Proxy Not Detected
            </Typography>
            
            {/* Vertical Divider */}
            <Divider orientation="vertical" flexItem sx={{ 
              borderColor: '#dee2e6',
              height: '20px',
              mx: 0.5
            }} />
          
            <Typography sx={{ 
              fontSize: '16px',
              fontWeight: 600,
              color: '#1C43A6'
            }}>
              Tor Not Detected
            </Typography>
            
            {/* Vertical Divider */}
            <Divider orientation="vertical" flexItem sx={{ 
              borderColor: '#dee2e6',
              height: '20px',
              mx: 0.5
            }} />
          
            <Typography sx={{ 
              fontSize: '16px',
              fontWeight: 600,
              color: '#1C43A6'
            }}>
              India
            </Typography>
          </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={handleNextClick} 
                variant="contained" 
                sx={{ 
                  backgroundColor: '#1C43A6',
                  '&:hover': { backgroundColor: '#15337D' },
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

export default CheckLocationMap;