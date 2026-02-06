// import FinalReportComponents from "../../components/FinalReportComponents";





// const FinalReport = () => {
//   return (
//     <>

//     <div className="row">
//       <div className="col-md-12 mt-5" >
//         <FinalReportComponents/>
//       </div>

//     </div>

    
//     </>
    
//   )
// }

// export default FinalReport;


import { Box, Typography, Divider, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, TextField, Checkbox, FormControlLabel } from '@mui/material';
import KycReportTable from '../../components/KycReportTable';
import UserConsentDetailsTable from '../../components/UserConsentDetailsTable';
import CustomerDetailsTable from '../../components/CustomerDetailsTable';
import FaceVerificationTable from '../../components/FaceVerificationTable';
import LocationCheck from '../../components/LocationCheck';
import BrowserDetailTable from '../../components/BrowserDetailTable';
import QuestionAnswerTable from '../../components/QuestionAnswerTable';
import CloseIcon from '@mui/icons-material/Close';
import Check from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import dummyImage from "../../assets/dummy.png";
import panImage from "../../assets/pan.png";
import AgentScreenRecording from '../../components/AgentScreenRecording';
import { useLocation } from "react-router-dom";
import FinalRemarkTableAuditor from '../../components/FinalRemarkTableAuditor';


const FinalReport = () => {
  const [status, setStatus] = useState('initial');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [remark, setRemark] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedApproveOption, setSelectedApproveOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
const showExtra = location.state?.showExtra || false;


  const rejectionOptions = [
  "Your VKYC was rejected due to Address mismatch. Please try again.",
  "Your VKYC was rejected due to Name mismatch. Please try again.",
  "Your VKYC was rejected due to Date Of Birth mismatch. Please try again.",
  "Your VKYC was rejected due to Address & Name mismatch. Please try again.",
  "Your VKYC was rejected due to Address & Date of birth mismatch. Please try again.",
  "Your VKYC was rejected due to Name & Date Of Birth mismatch. Please try again.",
  "Your VKYC was rejected due to Gender mismatch. Please try again.",
  "Your VKYC was rejected due to Photo mismatch between Aadhar & Live photo. Please try again.",
  "Your VKYC was rejected due to Photo mismatch - PAN & Live photo. Please try again.",
  "Your VKYC was rejected due to Minor User.",
  "Customer doesn't have original PAN card",
  "Your VKYC was rejected due to Name, Address & Date of birth mismatch. Please try again",
  "Your VKYC was rejected due to Minor User & Customer does not have PAN card",
  "Your VKYC was rejected due to Minor User & Photo mismatch - Aadhar, PAN & Live photo. Please try again",
  "Your VKYC was rejected due to Minor User & Photo mismatch - PAN & Live photo. Please try again.",
  "Your VKYC was rejected due to Gender & Address mismatch. Please try again.",
  "Your VKYC was rejected due to Gender & Name mismatch. Please try again.",
  "Your VKYC was rejected due to Gender & Date Of Birth mismatch. Please try again.",
  "Your VKYC was rejected due to Address, Name & Gender mismatch. Please try again.",
  "Your VKYC was rejected due to Gender, Name & Date Of Birth mismatch. Please try again.",
  "Your VKYC was rejected due to Gender, Name, Address & Date of birth mismatch. Please try again.",
  "Your VKYC was rejected due to Photo mismatch - Aadhar, PAN & Live photo. Please try again.",
  "Your VKYC was rejected due to uploaded PAN Image is Blur/Not clear.",
  "Your VKYC was rejected due to customer/Applicant not present in the VKYC",
  "Your VKYC was rejected due to Name Mismatch Between Applicant and NSDL Data.",
  "Your VKYC was rejected due to DOB mismatch Between Physical PAN Card, Applicant and Aadhar",
  "Services Unavailable in your area. Visit the nearest Digikhata Kiosk (find in app) with original PAN and Aadhaar to complete Physical KYC. Contact support for help - 022-40633344",
  "Services Unavailable in your area.",
  "Other"
];

  const approveOptions = [
    "Your VKYC is Approved as per Process.",
    "Other"
  ];

  const handleApproveClick = () => {
    setModalType('approve');
    setModalOpen(true);
    setShowSuccess(false);
    setSelectedApproveOption('');
    setRemark('');
  };

  const handleRejectClick = () => {
    setModalType('reject');
    setModalOpen(true);
    setShowSuccess(false);
    setSelectedOptions([]);
    setRemark('');
    setSearchTerm('');
  };

  const handleOptionChange = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleApproveOptionChange = (option) => {
    setSelectedApproveOption(option === selectedApproveOption ? '' : option);
  };

  const handleModalSubmit = () => {
    if (modalType === 'reject' && selectedOptions.length === 0) return;
    if (modalType === 'approve' && !selectedApproveOption) return;
    setShowSuccess(true);
  };

  const handleNextClick = () => {
    setStatus(modalType === 'approve' ? 'approved' : 'rejected');
    setModalOpen(false);
    setShowSuccess(false);
    setRemark('');
    setSelectedOptions([]);
    setSelectedApproveOption('');
    navigate('/');
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setShowSuccess(false);
    setRemark('');
    setSelectedOptions([]);
    setSelectedApproveOption('');
    setSearchTerm('');
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12 mt-5" >
          <Box sx={{
            borderRadius: '8px',
            overflow: 'hidden',
            height: '100%',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: 'white',
            p: 3
          }}>
            <KycReportTable/>
            <UserConsentDetailsTable/>
            <CustomerDetailsTable/>

            <div className="row">
              <div className="col-md-4">
                {/* Aadhaar Photo Component */}
                <Box sx={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  width: '100%',
                  maxWidth: '600px',
                  backgroundColor: 'white',
                  p: 2,
                  mb: 3
                }}>
                  <Box sx={{ px: 1 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#1C43A6',
                      fontWeight: 600,
                      mb: 1,
                      fontSize: '1.1rem'
                    }}>
                      Aadhaar Card Photo
                    </Typography>
                  </Box>
                  <Paper sx={{
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Box
                      component="img"
                      src={dummyImage}
                      alt="Aadhaar Card"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'none'
                      }}
                    >
                    </Box>
                  </Paper>
                </Box>
              </div>
              <div className="col-md-4">
                {/* PAN Photo Component */}
                <Box sx={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  width: '100%',
                  maxWidth: '600px',
                  backgroundColor: 'white',
                  p: 2,
                  mb: 3
                }}>
                  <Box sx={{ px: 1 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#1C43A6',
                      fontWeight: 600,
                      mb: 1,
                      fontSize: '1.1rem'
                    }}>
                      PAN Card Photo
                    </Typography>
                  </Box>
                  <Paper sx={{
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Box
                      component="img"
                      src={panImage}
                      alt="PAN Card"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'none'
                      }}
                    >
                    </Box>
                  </Paper>
                </Box>
              </div>
              <div className="col-md-4">
                {/* Live Photo Component */}
                <Box sx={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  width: '100%',
                  maxWidth: '600px',
                  backgroundColor: 'white',
                  p: 2,
                  mb: 3
                }}>
                  <Box sx={{ px: 1 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#1C43A6',
                      fontWeight: 600,
                      mb: 1,
                      fontSize: '1.1rem'
                    }}>
                      Live Photo
                    </Typography>
                  </Box>
                  <Paper sx={{
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Box
                      component="img"
                      src={dummyImage}
                      alt="Live Photo"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'none'
                      }}
                    >
                    </Box>
                  </Paper>
                </Box>
              </div>
            </div>

            <FaceVerificationTable/>

            <div className="row">
              <div className="col-md-6">
                <LocationCheck/>
              </div>
              <div className="col-md-6">
                <BrowserDetailTable/>
              </div>
            </div>
        
          {showExtra && <AgentScreenRecording />}

        
            <QuestionAnswerTable/>
            <FinalRemarkTableAuditor/>

            {/* Final Remark Table Component */}
            <Box sx={{ mb: 4 }}>
              {/* Approval Section */}
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                gap: 2,
                flexWrap: 'wrap',
                mt: 3
              }}>
                <Typography sx={{ 
                  color: 'var(--dark-color)',
                  fontSize: '20px',
                  fontWeight: 700,
                }}>
                  Mark the Status of the Application
                </Typography>

                {status === 'initial' ? (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleApproveClick}
                      sx={{
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        color: '#28a745',
                        textTransform: 'none',
                        px: 2,
                        py: 0.5,
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: 'rgba(40, 167, 69, 0.2)'
                        }
                      }}
                    >
                      <Box sx={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        mr: 1,
                        backgroundColor: '#28a745',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        justifyContent: 'center'
                      }}>
                        <Check sx={{ color: 'white', fontSize: '0.8rem' }} />
                      </Box>
                      Approve
                    </Button>

                    <Button
                      variant="contained"
                      onClick={handleRejectClick}
                      sx={{
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        color: '#dc3545',
                        textTransform: 'none',
                        px: 2,
                        py: 0.5,
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: 'rgba(220, 53, 69, 0.2)'
                        }
                      }}
                    >
                      <Box sx={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        mr: 1,
                        backgroundColor: '#dc3545',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        justifyContent: 'center'
                      }}>
                        <CloseIcon sx={{ color: 'white', fontSize: '0.8rem' }} />
                      </Box>
                      Reject
                    </Button>
                  </Box>
                ) : (
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
                        <CloseIcon sx={{ color: 'white', fontSize: '0.8rem' }} />
                      )}
                    </Box>
                    {status === 'approved' ? 'Approved' : 'Rejected'}
                  </Button>
                )}
              </Box>

              <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="confirmation-modal"
                aria-describedby="confirmation-modal-description"
              >
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: showSuccess ? '400px' : modalType === 'approve' ? '500px' : { xs: '90%', sm: '1200px' },
                  height: showSuccess ? 'auto' : modalType === 'approve' ? 'auto' : { xs: '90%', sm: '850px' },
                  maxHeight: '90vh',
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  p: { xs: 2, sm: 3 },
                  borderRadius: '8px',
                  outline: 'none',
                }}>
                  {!showSuccess ? (
                    <>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        position: 'sticky',
                        top: 0,
                        bgcolor: 'background.paper',
                        zIndex: 1,
                        pt: 1,
                        pb: 2,
                        gap: 2
                      }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600,
                          color: '#1C43A6',
                          fontSize: { xs: '1.1rem', sm: '1.25rem' },
                          flexShrink: 0
                        }}>
                          {modalType === 'approve' ? 'Select Reason for Accept' : 'Select Rejection Reason'}
                        </Typography>

                        {/* Search Bar - Only for Reject Modal */}
                        {modalType === 'reject' && (
                          <TextField
                            placeholder="Search rejection reasons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                            sx={{
                              flexGrow: 1,
                              maxWidth: '500px',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#dee2e6',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#1C43A6',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1C43A6',
                                },
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <SearchIcon 
                                  sx={{ 
                                    color: 'text.secondary', 
                                    mr: 1,
                                    fontSize: '20px'
                                  }} 
                                />
                              ),
                            }}
                          />
                        )}

                        <Button 
                          onClick={handleModalClose}
                          sx={{
                            minWidth: 'auto',
                            p: 0,
                            color: 'text.secondary',
                            flexShrink: 0
                          }}
                        >
                          <CloseIcon />
                        </Button>
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {modalType === 'approve' ? (
                        <Box sx={{ p: 2 }}>
                          <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                            Please select a reason for approval:
                          </Typography>
                          <Box sx={{ mb: 3 }}>
                            {approveOptions.map((option, index) => (
                              <FormControlLabel
                                key={index}
                                control={
                                  <Checkbox
                                    checked={selectedApproveOption === option}
                                    onChange={() => handleApproveOptionChange(option)}
                                    color="primary"
                                  />
                                }
                                label={
                                  <Typography sx={{ fontSize: '0.875rem' }}>
                                    {option}
                                  </Typography>
                                }
                                sx={{ 
                                  m: 0,
                                  mb: 1,
                                  alignItems: 'anchor-center'
                                }}
                              />
                            ))}
                          </Box>
                          
                          {selectedApproveOption === 'Other' && (
                            <TextField
                              fullWidth
                              multiline
                              rows={3}
                              placeholder="Add Remark"
                              value={remark}
                              onChange={(e) => setRemark(e.target.value)}
                              sx={{ mb: 3 }}
                            />
                          )}
                        </Box>
                      ) : (
                        <>
                          <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                            Please select at least one reason for rejection:
                          </Typography>
                          <Box sx={{ 
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: { xs: '8px', sm: '16px' },
                            mb: 3,
                            overflowY: 'auto',
                            maxHeight: '65vh',
                          }}>
                            {rejectionOptions.map((option, index) => (
                              <FormControlLabel
                                key={index}
                                control={
                                  <Checkbox
                                    checked={selectedOptions.includes(option)}
                                    onChange={() => handleOptionChange(option)}
                                    color="primary"
                                    size="small"
                                  />
                                }
                                label={
                                  <Typography sx={{ fontSize: '0.875rem' }}>
                                    {option}
                                  </Typography>
                                }
                                sx={{ 
                                  m: 0,
                                  alignItems: 'anchor-center'
                                }}
                              />
                            ))}
                          </Box>
                        </>
                      )}

                      <Divider sx={{ mb: 1 }} />

                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                      }}>
                        <Button 
                          variant="contained"
                          onClick={handleModalSubmit}
                          disabled={
                            (modalType === 'reject' && selectedOptions.length === 0) ||
                            (modalType === 'approve' && !selectedApproveOption)
                          }
                          sx={{ 
                            backgroundColor: modalType === 'approve' ? '#1C43A6' : '#1C43A6',
                            color: 'white',
                            '&:hover': { 
                              backgroundColor: modalType === 'approve' ? '#15337D' : '#15337D'
                            },
                            textTransform: 'none',
                            px: 4,
                            py: 1,
                            fontWeight: 500,
                            fontSize: '1rem',
                          }}
                        >
                          Submit
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box sx={{ textAlign: 'center', p: 3 }}>
                          {modalType === 'approve' ? (
                            <Check sx={{
                              fontSize: '3rem',
                              color: '#28a745',
                              mb: 2
                            }} />
                          ) : (
                            <CloseIcon sx={{
                              fontSize: '3rem',
                              color: '#dc3545',
                              mb: 2
                            }} />
                          )}
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          {modalType === 'approve' ? 'Approved Successfully!' : 'Rejected Successfully!'}
                        </Typography>
                        <Typography sx={{ mb: 3, color: 'text.secondary' }}>
                          The VKYC application has been {modalType === 'approve' ? 'approved' : 'rejected'}.
                        </Typography>
                        <Button 
                          variant="contained"
                          onClick={handleNextClick}
                          sx={{ 
                            backgroundColor: modalType === 'approve' ? '#1C43A6' : '#1C43A6',
                            color: 'white',
                            '&:hover': { 
                              backgroundColor: modalType === 'approve' ? '#15337D' : '#15337D'
                            },
                            textTransform: 'none',
                            px: 4,
                            py: 1,
                            fontWeight: 500,
                            fontSize: '1rem',
                          }}
                        >
                          Continue
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              </Modal>
            </Box>
          </Box>
        </div>
      </div>
    </>
  )
}

export default FinalReport;