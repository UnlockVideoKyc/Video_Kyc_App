// import { useState } from "react";
// import VideoCallAgentSection from "../../components/VideoCallAgentSection"
// import VideoCallCustomerSection from "../../components/VideoCallCustomerSection"
// // import FaceMatchAadhaarTable from "../../components/FaceMatchAadhaarTable"
// import FaceMatchPanTable from "../../components/FaceMatchPanTable"
// // import HorizontalStepper from "../../components/HorizontalStepper"

// const CheckPanDetailsTable = () => {
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
//           <FaceMatchPanTable/>
//         </div>
//       </div>
//     </>
//   )
// }

// export default CheckPanDetailsTable;

import { useState } from "react";
import VideoCallAgentSection from "../../components/VideoCallAgentSection"
import VideoCallCustomerSection from "../../components/VideoCallCustomerSection"
import { Box, Typography, Divider, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CallEndIcon from '@mui/icons-material/CallEnd';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import panImage from "../../assets/pan.png";
import { useNavigate } from 'react-router-dom'; 

const CheckPanDetailsTable = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [panData, setPanData] = useState([
    { field: 'Name', applicantData: 'Riddhi Jani', panCardDetails: 'Riddhi Jani', nsdlData: 'Y', match: '100%' },
    { field: 'Father Name', applicantData: '-', panCardDetails: '-', nsdlData: 'Y', match: '0%' },
    { field: 'Date of Birth', applicantData: '31-12-1999', panCardDetails: '31-12-1999', nsdlData: 'Y', match: '-' },
    { field: 'PAN', applicantData: '-', panCardDetails: '-', nsdlData: 'Y', match: '100%' },
  ]);
  const navigate = useNavigate();

  const handleFullScreenToggle = (fullScreenState) => {
    setIsFullScreen(fullScreenState);
  };

  const handleNextClick = () => {
    navigate('/final-report'); 
  };

  const handleEditClick = (index, field) => {
    setEditingField(`${index}-${field}`);
    setEditedValue(panData[index][field]);
  };

  const handleSave = (index, field) => {
    const newData = [...panData];
    newData[index][field] = editedValue;
    
    // Update match percentage if PAN card details changed
    if (field === 'panCardDetails') {
      const applicantData = newData[index].applicantData;
      const panCardDetails = editedValue;
      
      if (applicantData && panCardDetails) {
        if (applicantData === panCardDetails) {
          newData[index].match = '100%';
        } else if (applicantData === '-' || panCardDetails === '-') {
          newData[index].match = '0%';
        } else {
          // Simple match calculation
          const matchPercentage = applicantData.toLowerCase() === panCardDetails.toLowerCase() ? '100%' : '0%';
          newData[index].match = matchPercentage;
        }
      }
    }
    
    setPanData(newData);
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const handleKeyDown = (e, index, field) => {
    if (e.key === 'Enter') {
      handleSave(index, field);
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const getMatchColor = (match) => {
    if (match.includes('%')) {
      const percent = parseInt(match);
      return percent >= 50 ? '#28a745' : '#dc3545';
    }
    return 'inherit';
  };

  const isEditing = (index, field) => editingField === `${index}-${field}`;

  return (
    <>
      <div className="row">
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
              PAN Details Check
            </Typography>
            
            <Divider sx={{ mb: 2 }} />

            {/* Main Table */}
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
                      fontSize: '14px',
                      whiteSpace: 'nowrap'
                    }
                  }}>
                    <TableCell>User Details</TableCell>
                    <TableCell>Applicant from data</TableCell>
                    <TableCell>Pan Card Details- OCR</TableCell>
                    <TableCell>NSDL Data</TableCell>
                    <TableCell>Match</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {panData.map((row, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        '& td': {
                          borderBottom: '1px solid #dee2e6',
                          fontSize: '14px',
                          position: 'relative',
                        },
                        '&:last-child td': {
                          borderBottom: 'none'
                        }
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{row.field}</TableCell>
                      <TableCell><strong>{row.applicantData}</strong></TableCell>
                      
                      {/* Editable PAN Card Details Cell */}
                      <TableCell sx={{ minWidth: 180 }}>
                        {isEditing(index, 'panCardDetails') ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                              value={editedValue}
                              onChange={(e) => setEditedValue(e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, index, 'panCardDetails')}
                              size="small"
                              autoFocus
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  fontSize: '14px',
                                  height: '32px'
                                }
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleSave(index, 'panCardDetails')}
                              sx={{ 
                                color: '#28a745',
                                p: 0.5,
                                '&:hover': { backgroundColor: 'rgba(40, 167, 69, 0.1)' }
                              }}
                            >
                              <SaveIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={handleCancel}
                              sx={{ 
                                color: '#dc3545',
                                p: 0.5,
                                '&:hover': { backgroundColor: 'rgba(220, 53, 69, 0.1)' }
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1
                          }}>
                            <strong style={{ flex: 1 }}>{row.panCardDetails}</strong>
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(index, 'panCardDetails')}
                              sx={{
                                color: '#6c757d',
                                p: 0.5,
                                '&:hover': { 
                                  color: '#1C43A6',
                                  backgroundColor: 'rgba(28, 67, 166, 0.1)'
                                }
                              }}
                              title="Edit PAN details"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>
                      
                      <TableCell><strong>{row.nsdlData}</strong></TableCell>
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

            {/* PAN Verification Status Section */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3
            }}>
              <Box sx={{ 
                backgroundColor: 'rgba(28, 67, 166, 0.1)',
                borderRadius: '4px',
                px: 2,
                py: 1,
                width: 'fit-content',
                textAlign: 'center'
              }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}>
                  <Box sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: '#1C43A6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <CheckIcon sx={{ fontSize: '16px' }} />
                  </Box>
                  <Typography sx={{ 
                    color: '#1C43A6',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}>
                    PAN NSDL Verification is Valid
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Images */}
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              mb: 3
            }}>
              {/* Pan Image */}
              <Box sx={{ 
                width: '100%',
                height: 228,
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#EEEEEE'
              }}>
                <Box
                  component="img"
                  src={panImage}
                  alt="Pan Card"
                  sx={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "none" 
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={handleNextClick} 
                variant="contained"
                startIcon={<CallEndIcon sx={{ color: 'white' }} />}
                sx={{ 
                  minWidth: 'auto', 
                  width: 'auto',    
                  height: 45,
                  padding: '8px 16px', 
                  backgroundColor: '#dc3545',
                  color: 'white',
                  '&:hover': { 
                    backgroundColor: '#c82333'
                  },
                  textTransform: 'none',
                  px: 2,           
                  py: 1,
                  fontWeight: 500,
                  fontSize: '16px',
                  '& .MuiButton-startIcon': {
                    marginRight: '6px' 
                  }
                }}
              >
                End Call
              </Button>
            </Box>
          </Box>
        </div>
      </div>
    </>
  )
}

export default CheckPanDetailsTable;