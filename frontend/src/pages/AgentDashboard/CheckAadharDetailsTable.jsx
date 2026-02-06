// import { useState } from "react";
// import VideoCallAgentSection from "../../components/VideoCallAgentSection"
// import VideoCallCustomerSection from "../../components/VideoCallCustomerSection"
// import FaceMatchAadhaarTable from "../../components/FaceMatchAadhaarTable"
// import HorizontalStepper from "../../components/HorizontalStepper"

// const CheckAadharDetailsTable = () => {
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
//           <FaceMatchAadhaarTable/>
//         </div>
//       </div>
//     </>
//   )
// }

// export default CheckAadharDetailsTable;


import { useState } from "react";
import VideoCallAgentSection from "../../components/VideoCallAgentSection"
import VideoCallCustomerSection from "../../components/VideoCallCustomerSection"
import { Box, Typography, Divider, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

const CheckAadharDetailsTable = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const navigate = useNavigate();

  const handleFullScreenToggle = (fullScreenState) => {
    setIsFullScreen(fullScreenState);
  };

  const handleNextClick = () => {
    navigate('/check-pan-face'); 
  };

  const data = [
    { field: 'Name', userData: 'Riddhi Jani', kycData: 'Riddhi Jani', match: '100%' },
    { field: 'Father Name', userData: '-', kycData: 'Yogesh Jani', match: '0%' },
    { field: 'Date of Birth', userData: '31-12-1999', kycData: '31-12-1999', match: '-' },
    { field: 'Gender', userData: 'Female', kycData: 'Female', match: '100%' },
    { field: 'Current Address', userData: 'Mumbai, India 401209', kycData: 'Mumbai, India 401209', match: '-' },
    { field: 'Permanent Address', userData: 'Mumbai, India 401209', kycData: 'Mumbai, India 401209', match: '70%' },
    { field: 'Mobile Number', userData: '8830245847', kycData: '-', match: '100%' },
    { field: 'Email Address', userData: '-', kycData: '-', match: '100%' },
  ];

  const getMatchColor = (match) => {
    if (match.includes('%')) {
      const percent = parseInt(match);
      return percent >= 50 ? '#28a745' : '#dc3545';
    }
    return 'inherit';
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

            <TableContainer component={Paper} sx={{ 
              mb: 3,
              boxShadow: 'none',
              border: '1px solid #dee2e6'
            }}>
              <Table sx={{
                '& .MuiTableCell-root': {
                  borderRight: '1px solid #dee2e6',
                  '&:last-child': {
                    borderRight: 'none'
                  }
                }
              }}>
                <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: '#f8f9fa',
                    '& th': {
                      fontWeight: 600,
                      color: '#212529',
                      borderBottom: '1px solid #dee2e6',
                      fontSize: '16px'
                    }
                  }}>
                    <TableCell>User Details</TableCell>
                    <TableCell>
                      Applicant from data <span style={{ color: '#1C43A6' }}>Digikhata</span>
                    </TableCell>
                    <TableCell>
                      KYC Data <span style={{ color: '#1C43A6' }}>Digilocker</span>
                    </TableCell>
                    <TableCell>Match</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        '& td': {
                          borderBottom: '1px solid #dee2e6',
                          fontSize: '16px'
                        },
                        '&:last-child td': {
                          borderBottom: 'none'
                        }
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{row.field}</TableCell>
                      <TableCell><strong>{row.userData}</strong></TableCell>
                      <TableCell><strong>{row.kycData}</strong></TableCell>
                      <TableCell sx={{ 
                        color: getMatchColor(row.match),
                        fontWeight: 600,
                        textAlign: 'center'
                      }}>
                        {row.match}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={handleNextClick} 
                variant="contained" 
                sx={{ 
                  backgroundColor: '#1C43A6',
                  color: 'white',
                  '&:hover': { 
                    backgroundColor: '#15337D' 
                  },
                  textTransform: 'none',
                  px: 4,
                  py: 1,
                  fontWeight: 500,
                  fontSize: '16px'
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

export default CheckAadharDetailsTable;