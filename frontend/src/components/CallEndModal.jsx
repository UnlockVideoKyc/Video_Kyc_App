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
  useTheme
} from '@mui/material';
import { Close, CallEnd as CallEndIcon } from '@mui/icons-material';

const CallEndModal = ({ open, onClose, onConfirm }) => {
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
    const finalRemark = selectedOptions.includes("Other") 
      ? `${selectedOptions.join(', ')}: ${remark}`
      : selectedOptions.join(', ');
    onConfirm(selectedOptions, finalRemark);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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
      }}>
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
            onClick={onClose}
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
            fontSize: '1rem' // Fixed 16px equivalent
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
            fontSize: '1rem' // Fixed 16px equivalent
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
          sx={{ 
            mb: 3,
            '& .MuiInputBase-root': {
              fontSize: '1rem' // Fixed 16px equivalent
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
            startIcon={<CallEndIcon sx={{ color: 'white' }} />}
            onClick={handleSubmit}
            disabled={selectedOptions.length === 0}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              height: { xs: 40, sm: 45 },
              padding: { xs: '6px 12px', sm: '8px 16px' },
              backgroundColor: 'error.main',
              color: 'white',
              '&:hover': { 
                backgroundColor: 'error.dark'
              },
              textTransform: 'none',
              px: 2,           
              py: 1,
              fontWeight: 500,
              fontSize: '1rem', // Fixed 16px equivalent
              '& .MuiButton-startIcon': {
                marginRight: '6px',
                '& > *:first-of-type': {
                  fontSize: { xs: '18px', sm: '20px' }
                }
              }
            }}
          >
            End Call
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CallEndModal;