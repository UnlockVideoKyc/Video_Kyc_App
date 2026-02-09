import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button
} from '@mui/material';
import { CallEnd as CallEndIcon, Info as InfoIcon } from '@mui/icons-material';
import socketService from '../services/socket.service';

const CallEndedByAgentNotification = ({ connectionId, onClose }) => {
  const [endCallData, setEndCallData] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!connectionId) return;

    // Listen for agent ending the call
    const handleCallEnded = (data) => {
      console.log('📞 Call ended by agent:', data);
      setEndCallData(data);
      setShow(true);
    };

    socketService.on('call-ended-by-agent', handleCallEnded);

    return () => {
      // Clean up listener
      socketService.socket?.off('call-ended-by-agent', handleCallEnded);
    };
  }, [connectionId]);

  const handleOkay = () => {
    setShow(false);
    if (onClose) {
      onClose();
    }
    // Optionally redirect to a thank you page
    window.location.href = '/thank-you';
  };

  if (!show || !endCallData) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        p: 2
      }}
    >
      <Paper
        elevation={10}
        sx={{
          maxWidth: 500,
          width: '100%',
          p: 4,
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'error.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}
        >
          <CallEndIcon sx={{ fontSize: 40, color: 'error.main' }} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Call Ended by Agent
        </Typography>

        <Box
          sx={{
            bgcolor: 'info.lighter',
            border: '1px solid',
            borderColor: 'info.light',
            borderRadius: 1,
            p: 2,
            mb: 3,
            textAlign: 'left'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <InfoIcon sx={{ fontSize: 20, color: 'info.main', mr: 1, mt: 0.3 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Reason for ending the call:
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: 'text.primary',
              pl: 4,
              whiteSpace: 'pre-wrap'
            }}
          >
            {endCallData.reason || 'No reason provided'}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The agent has ended the video call. If you need further assistance, please contact customer support.
        </Typography>

        <Button
          variant="contained"
          onClick={handleOkay}
          fullWidth
          sx={{
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600
          }}
        >
          Okay
        </Button>
      </Paper>
    </Box>
  );
};

export default CallEndedByAgentNotification;