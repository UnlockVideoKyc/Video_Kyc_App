import { useState } from 'react';
import { Box, Typography, Divider, Button, TextField } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import ReplayIcon from '@mui/icons-material/Replay';
import dummyImage from "../assets/dummy.png";
import panImage from "../assets/pan.png";
import { useNavigate } from 'react-router-dom'; 

const FaceMatchPan = () => {
  const [status, setStatus] = useState('initial'); 

  const handleApprove = () => {
    setStatus('approved');
  };

  const handleReject = () => {
    setStatus('rejected');
  };

  const handleUndo = () => {
    setStatus('initial');
  };

  const navigate = useNavigate();
  
  const handleNextClick = () => {
  navigate('/check-pan-details-table'); 
  };

  return (
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
        fontSize: '1.25rem',
        // textAlign: 'center'
      }}>
        Face Match between Pan and Live Photo
      </Typography>
      
      <Divider sx={{ mb: 2 }} />

      {/* Images */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        gap: 4,
        mb: 3
      }}>
        {/* Pan Image */}
        <Box sx={{ 
          width: 220,
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

        {/* Captured Face */}
        <Box sx={{ 
          width: 220,
          height: 228,
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
      </Box>

      {/* Face Match Failed Message */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: 2
      }}>
        <Box sx={{ 
          backgroundColor: 'rgba(241, 1, 1, 0.1)',
          borderRadius: '4px',
          px: 2,
          py: 1,
          width: 'fit-content',
          textAlign: 'center'
        }}>
          <Typography sx={{ 
            color: '#F10101',
            fontWeight: 500
          }}>
            <strong>18%</strong> - Face Verification Failed!
          </Typography>
        </Box>
      </Box>

      {/* Approval Section - Question and buttons in same line */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 3,
        gap: 2,
        flexWrap: 'wrap'
      }}>
        <Typography sx={{ 
          color: '#1C43A6',
          fontSize: '16px',
          fontWeight: 500,
        }}>
          Does the face Match with Pan Photo?
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
      <Box sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="Add remark (optional)"
          fullWidth
          sx={{ 
            '& .MuiOutlinedInput-root': { 
              '& fieldset': { 
                borderColor: '#dee2e6' 
              } 
            } 
          }}
        />
      </Box>
      
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
  );
};

export default FaceMatchPan;