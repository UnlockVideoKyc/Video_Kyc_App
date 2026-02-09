import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Divider,
  useMediaQuery,
  useTheme,
  CircularProgress
} from '@mui/material';
import { Close, CallEnd as CallEndIcon } from '@mui/icons-material';

const CallEndModal = ({ open, onClose, onConfirm, isLoading = false }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [remark, setRemark] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const options = [
    "Customer connection is weak",
    "Customer is unable to follow the instructions",
    "Language barrier",
    "Customer will call again/reschedule",
    "Customer behaviour issues",
    "PAN card is not valid or tampered",
    "Customer unable to hear the Agent voice",
    "User device has poor camera quality",
    "Customer left the VKYC session - Force Closure by customer",
    "Agent unable to hear customer due to poor network quality",
    "Customer is constantly moving",
    "Agent unable to see customer",
    "Customer does not have a PAN card",
    "Agent unable to hear customer",
    "Customer is fraudulent",
    "Third Party Assistance on call",
    "Customer unable to see the Agent",
    "Verification questions not answered correctly",
    "Customer calling from outside India / Location is NA",
    "Agent unable to see customer due to poor network quality",
    "Other"
  ];

  const handleOptionChange = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleSubmit = () => {
    // Build the final remark
    let finalRemark = selectedOptions.join(', ');
    
    // If "Other" is selected and there's a custom remark, append it
    if (selectedOptions.includes("Other") && remark.trim()) {
      finalRemark = `${finalRemark}: ${remark.trim()}`;
    } else if (remark.trim()) {
      // If there's a remark but "Other" wasn't selected, still include it
      finalRemark = `${finalRemark}. Additional remark: ${remark.trim()}`;
    }

    onConfirm(selectedOptions, finalRemark);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="call-end-modal-title"
      aria-describedby="call-end-modal-description"
      sx={{
        overflow: 'auto',
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '600px' },
        maxHeight: isMobile ? '85vh' : '90vh',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '8px',
        p: { xs: 2, sm: 3 },
        outline: 'none',
        overflowY: 'auto',
        m: 1,
        mt: isMobile ? '10vh' : 0,
        position: 'relative'
      }}>
        {/* Loading overlay */}
        {isLoading && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            borderRadius: '8px'
          }}>
            <CircularProgress size={50} />
            <Typography sx={{ mt: 2, fontWeight: 500 }}>
              Ending call...
            </Typography>
          </Box>
        )}

        {/* Header with close button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2,
          position: 'sticky',
          top: -24,
          bgcolor: 'background.paper',
          zIndex: 1,
          pt: 1,
          pb: 2,
        }}>
          <Typography 
            variant="h6" 
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            Facing an Issue During the Call?
          </Typography>
          <Button 
            onClick={handleClose}
            disabled={isLoading}
            sx={{
              minWidth: 'auto',
              p: 0,
              color: 'text.secondary'
            }}
          >
            <Close />
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography 
          variant="body1" 
          sx={{
            color: 'text.secondary',
            mb: 3,
            fontSize: '1rem'
          }}
        >
          Please select one of the option below to end the call
        </Typography>

        {/* All options in a single grid */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: { xs: '8px', sm: '16px' },
          mb: 3,
          overflowY: 'auto',
          maxHeight: { xs: '40vh', sm: 'none' },
        }}>
          {options.map((option, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionChange(option)}
                  disabled={isLoading}
                  size={isMobile ? 'small' : 'medium'}
                  color="primary"
                  sx={{ 
                    padding: '4px',
                    alignSelf: 'flex-start'
                  }}
                />
              }
              label={
                <Typography sx={{ 
                  fontSize: '1rem',
                  lineHeight: 1.5,
                  marginLeft: '8px'
                }}>
                  {option}
                </Typography>
              }
              sx={{ 
                margin: 0,
                alignItems: 'flex-start',
                display: 'flex',
              }}
            />
          ))}
        </Box>

        {/* Remark field (always visible) */}
        <Typography 
          variant="body2" 
          sx={{
            fontWeight: 500,
            color: 'primary.main',
            mb: 1,
            fontSize: '1rem'
          }}
        >
          Add remark (optional)
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter remarks"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          disabled={isLoading}
          sx={{ 
            mb: 3,
            '& .MuiInputBase-root': {
              fontSize: '1rem'
            }
          }}
          size={isMobile ? 'small' : 'medium'}
        />

        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          bottom: 0,
          bgcolor: 'background.paper',
          pt: 2,
          pb: 1,
        }}>
          <Button 
            variant="contained"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CallEndIcon sx={{ color: 'white' }} />}
            onClick={handleSubmit}
            disabled={selectedOptions.length === 0 || isLoading}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              height: { xs: 40, sm: 45 },
              padding: { xs: '6px 12px', sm: '8px 16px' },
              backgroundColor: 'error.main',
              color: 'white',
              '&:hover': { 
                backgroundColor: 'error.dark'
              },
              '&:disabled': {
                backgroundColor: 'rgba(220, 53, 69, 0.5)',
                color: 'white'
              },
              textTransform: 'none',
              px: 2,           
              py: 1,
              fontWeight: 500,
              fontSize: '1rem',
              '& .MuiButton-startIcon': {
                marginRight: '6px',
                '& > *:first-of-type': {
                  fontSize: { xs: '18px', sm: '20px' }
                }
              }
            }}
          >
            {isLoading ? 'Ending Call...' : 'End Call'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CallEndModal;