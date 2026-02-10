import { useState, useEffect, useRef } from "react"; // ✅ Updated imports
import {
  IconButton,
  Chip,
  TextField,
  Button,
  Box,
  Tooltip,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  Person as User,
  LocationOn as LocationIcon,
  Wifi as WifiIcon,
  Fullscreen as MaximizeIcon,
  FullscreenExit as MinimizeIcon,
  CallEnd as PhoneIcon
} from "@mui/icons-material";
import CallEndModal from "./CallEndModal";
import socketService from "../services/socket.service";
import webrtcService from "../services/webrtc.service";
import { endCall } from "../api/webrtc.api";

const VideoCallAgentSection = ({ onFullScreenToggle, localStream, connectionId, onCallEnded }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // ✅ ADD THIS REF
  const localVideoRef = useRef(null);
  
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [message, setMessage] = useState("");
  const [endCallModalOpen, setEndCallModalOpen] = useState(false);
  const [userTooltipOpen, setUserTooltipOpen] = useState(false);
  const [locationTooltipOpen, setLocationTooltipOpen] = useState(false);
  const [wifiTooltipOpen, setwifiTooltipOpen] = useState(false);
  const [isEndingCall, setIsEndingCall] = useState(false);

  // ✅ ADD THIS useEffect
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);
  const toggleFullScreen = () => {
    const newFullScreenState = !isFullScreen;
    setIsFullScreen(newFullScreenState);
    if (onFullScreenToggle) {
      onFullScreenToggle(newFullScreenState);
    }
  };

  const handleOpenEndCallModal = () => {
    setEndCallModalOpen(true);
  };

  const handleCloseEndCallModal = () => {
    setEndCallModalOpen(false);
  };

  const handleEndCall = async (selectedOptions, remark) => {
    try {
      setIsEndingCall(true);
      console.log('🔴 Ending call with:', { selectedOptions, remark, connectionId });

      // First, notify customer via socket about the end call reasons
      socketService.emit('call-ended-by-agent', {
        connectionId,
        reason: remark,
        selectedOptions
      });

      // Wait a moment for the message to be delivered
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call the backend API to end the call and move to past KYC
      const response = await endCall({
        connectionId,
        reason: remark,
        callStatus: 'REJECTED', // or determine based on selectedOptions
        endedBy: 'agent'
      });

      console.log('✅ Call ended successfully:', response);

      // Clean up WebRTC connection
      webrtcService.close();
      socketService.disconnect();

      // Close modal
      setEndCallModalOpen(false);

      // Notify parent component
      if (onCallEnded) {
        onCallEnded();
      }

      // Navigate back to dashboard or show success message
      window.location.href = '/work-dashboard';

    } catch (error) {
      console.error('❌ Error ending call:', error);
      alert('Failed to end call properly. Please try again.');
    } finally {
      setIsEndingCall(false);
    }
  };

const handleNotifyCustomer = () => {
  if (!message.trim()) {
    alert('Please enter a message');
    return;
  }
  
  if (!connectionId) {
    alert('No connection ID available');
    console.error('❌ No connectionId available');
    return;
  }
  
  console.log('📤 Notifying customer:', message);
  console.log('📍 Using connectionId:', connectionId);
  
  socketService.emit('agent-message', {
  connectionId,
  message
});

  
  setMessage('');
  console.log('✅ Message sent to customer');
};

  const handleUserTooltipOpen = () => {
    if (isMobile) {
      setUserTooltipOpen(true);
    }
  };

  const handleUserTooltipClose = () => {
    if (isMobile) {
      setUserTooltipOpen(false);
    }
  };

  const toggleUserTooltip = () => {
    setUserTooltipOpen(!userTooltipOpen);
  };

  const handleLocationTooltipOpen = () => {
    if (isMobile) {
      setLocationTooltipOpen(true);
    }
  };

  const handleLocationTooltipClose = () => {
    if (isMobile) {
      setLocationTooltipOpen(false);
    }
  };

  const toggleLocationTooltip = () => {
    setLocationTooltipOpen(!locationTooltipOpen);
  };

  const togglewifiTooltip = () => {
    setwifiTooltipOpen(!wifiTooltipOpen);
  };

  return (
    <Box sx={{
      borderRadius: '8px',
      overflow: 'hidden',
      height: '100%',
      boxShadow: 'none',
      backgroundColor: 'white'
    }}>
      <Box sx={{ p: 0 }}>
        <Box sx={{
          position: 'relative',
          height: isFullScreen ? '600px' : { xs: '300px', sm: '400px' },
          borderRadius: '8px 8px 0 0',
          overflow: 'hidden',
          margin: { xs: '0 8px', sm: '0 16px' },
          marginTop: { xs: '12px', sm: '16px' },
          marginBottom: '0',
          width: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 32px)' },
          backgroundColor: '#343a40'
        }}>
          <video
            ref={(videoElement) => {
              if (videoElement && localStream) {
                videoElement.srcObject = localStream;
              }
            }}
            autoPlay
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />

          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            p: { xs: '4px', sm: '8px' }
          }}>
            <Chip
              label="Customer"
              size="small"
              sx={{
                backgroundColor: "black",
                color: "white",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                borderRadius: '4px'
              }}
            />
          </Box>
          
          {!localStream && (
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: '16px',
              textAlign: 'center'
            }}>
              Loading video...
            </Box>
          )}
        </Box>

        {/* Call Controls */}
        <Box sx={{
          p: { xs: '8px', sm: '12px' },
          backgroundColor: "white"
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: '4px', sm: '8px' },
            flexWrap: 'wrap'
          }}>
            {/* User Info Button */}
            <Tooltip
              title={
                <Box sx={{ p: 1, fontFamily: "'Inter', sans-serif" }}>
                  <Box component="h3" sx={{
                    margin: "0 0 8px 0",
                    fontSize: '16px',
                    color: '#212529',
                    paddingBottom: '8px',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    Customer Details
                  </Box>
                  <Box component="p" sx={{ margin: "4px 0", fontSize: '14px' }}>
                    <strong>Name:</strong> Riddhi Jani
                  </Box>
                  <Box component="p" sx={{ margin: "4px 0", fontSize: '14px' }}>
                    <strong>Father Name:</strong> Yogesh Jani
                  </Box>
                  <Box component="p" sx={{ margin: "4px 0", fontSize: '14px' }}>
                    <strong>Date of Birth:</strong> 31-12-1999
                  </Box>
                  <Box component="p" sx={{ margin: "4px 0", fontSize: '14px' }}>
                    <strong>Gender:</strong> Female
                  </Box>
                  <Box component="p" sx={{ margin: "4px 0", fontSize: '14px' }}>
                    <strong>Email ID:</strong> jani@gmail.com
                  </Box>
                  <Box component="p" sx={{ margin: "4px 0", fontSize: '14px' }}>
                    <strong>Mobile No:</strong> 8754588129
                  </Box>
                </Box>
              }
              arrow
              placement="bottom"
              open={isMobile ? userTooltipOpen : undefined}
              onOpen={handleUserTooltipOpen}
              onClose={handleUserTooltipClose}
              disableFocusListener={isMobile}
              disableHoverListener={isMobile}
              disableTouchListener={isMobile}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: 'white',
                    color: '#212529',
                    border: '1px solid #dee2e6',
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                    maxWidth: { xs: '280px', sm: 'none' }
                  }
                },
                arrow: {
                  sx: {
                    color: 'white',
                    '&:before': {
                      border: '1px solid #dee2e6'
                    }
                  }
                }
              }}
            >
              <IconButton
                onClick={isMobile ? toggleUserTooltip : undefined}
                sx={{
                  bgcolor: "rgba(28, 67, 166, 0.1)",
                  color: "#1C43A6",
                  "&:hover": { bgcolor: "rgba(28, 67, 166, 0.2)" },
                  fontFamily: "'Inter', sans-serif",
                  fontSize: { xs: '18px', sm: '20px' }
                }}
              >
                <User fontSize="inherit" />
              </IconButton>
            </Tooltip>

            {/* Location Button */}
            <Tooltip
              title={
                <Box sx={{ p: 1, fontFamily: "'Inter', sans-serif" }}>
                  <Box component="h3" sx={{
                    margin: "0 0 8px 0",
                    fontSize: '16px',
                    color: '#212529',
                    paddingBottom: '8px',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    Location Details
                  </Box>
                  <Box component="p" sx={{ margin: "4px 0", fontSize: '14px' }}>
                    <strong>Location:</strong> F2FV-MH5, Mumbai-Maharashtra
                  </Box>
                  <Box component="p" sx={{ margin: "4px 0", fontSize: '14px' }}>
                    401209, India
                  </Box>
                  <Box component="p" sx={{ margin: "4px 0", fontSize: '14px' }}>
                    <strong>IP Address:</strong> 223.184.132.40
                  </Box>
                  <Box component="p" sx={{ margin: "4px 0", fontSize: '14px' }}>
                    <strong>Latitude & Longitude:</strong> 27.47618744.257895
                  </Box>
                </Box>
              }
              arrow
              placement="bottom"
              open={isMobile ? locationTooltipOpen : undefined}
              onOpen={handleLocationTooltipOpen}
              onClose={handleLocationTooltipClose}
              disableFocusListener={isMobile}
              disableHoverListener={isMobile}
              disableTouchListener={isMobile}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: 'white',
                    color: '#212529',
                    border: '1px solid #dee2e6',
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                    maxWidth: { xs: '280px', sm: 'none' }
                  }
                },
                arrow: {
                  sx: {
                    color: 'white',
                    '&:before': {
                      border: '1px solid #dee2e6'
                    }
                  }
                }
              }}
            >
              <IconButton
                onClick={isMobile ? toggleLocationTooltip : undefined}
                sx={{
                  bgcolor: "rgba(28, 67, 166, 0.1)",
                  color: "#1C43A6",
                  "&:hover": { bgcolor: "rgba(28, 67, 166, 0.2)" },
                  fontFamily: "'Inter', sans-serif",
                  fontSize: { xs: '18px', sm: '20px' }
                }}
              >
                <LocationIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>

            {/* WiFi Button */}
            <Tooltip
              title={
                <Box sx={{ p: 1, fontFamily: "'Inter', sans-serif" }}>
                  <Box component="h3" sx={{
                    margin: "0 0 8px 0",
                    fontSize: '16px',
                    color: '#212529',
                    paddingBottom: '8px',
                    borderBottom: '1px solid #dee2e6',
                    textAlign: "center"
                  }}>
                    Agent Speed Network
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '32px',
                    margin: '16px 0'
                  }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box component="strong" sx={{
                        display: 'block',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '2px'
                      }}>
                        175
                      </Box>
                      <Box sx={{
                        fontSize: '12px',
                        color: 'text.secondary'
                      }}>
                        incoming
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box component="strong" sx={{
                        display: 'block',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '2px'
                      }}>
                        175
                      </Box>
                      <Box sx={{
                        fontSize: '12px',
                        color: 'text.secondary'
                      }}>
                        outgoing
                      </Box>
                    </Box>
                  </Box>
                  <Box component="h3" sx={{
                    margin: "0 0 8px 0",
                    fontSize: '16px',
                    color: '#212529',
                    paddingBottom: '8px',
                    borderBottom: '1px solid #dee2e6',
                    textAlign: "center"
                  }}>
                    Customer Speed Network
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '32px',
                    margin: '16px 0'
                  }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box component="strong" sx={{
                        display: 'block',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '2px'
                      }}>
                        175
                      </Box>
                      <Box sx={{
                        fontSize: '12px',
                        color: 'text.secondary'
                      }}>
                        incoming
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box component="strong" sx={{
                        display: 'block',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '2px'
                      }}>
                        175
                      </Box>
                      <Box sx={{
                        fontSize: '12px',
                        color: 'text.secondary'
                      }}>
                        outgoing
                      </Box>
                    </Box>
                  </Box>
                </Box>
              }
              arrow
              placement="bottom"
              open={isMobile ? wifiTooltipOpen : undefined}
              onOpen={handleLocationTooltipOpen}
              onClose={handleLocationTooltipClose}
              disableFocusListener={isMobile}
              disableHoverListener={isMobile}
              disableTouchListener={isMobile}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: 'white',
                    color: '#212529',
                    border: '1px solid #dee2e6',
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                    maxWidth: { xs: '280px', sm: 'none' }
                  }
                },
                arrow: {
                  sx: {
                    color: 'white',
                    '&:before': {
                      border: '1px solid #dee2e6'
                    }
                  }
                }
              }}
            >
              <IconButton
                onClick={isMobile ? togglewifiTooltip : undefined}
                sx={{
                  bgcolor: "rgba(28, 67, 166, 0.1)",
                  color: "#1C43A6",
                  "&:hover": { bgcolor: "rgba(28, 67, 166, 0.2)" },
                  fontFamily: "'Inter', sans-serif",
                  fontSize: { xs: '18px', sm: '20px' }
                }}
              >
                <WifiIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>

            {/* Fullscreen and End Call Buttons */}
            {[
              {
                icon: isFullScreen ? MinimizeIcon : MaximizeIcon,
                label: 'Fullscreen',
                onClick: toggleFullScreen
              },
              {
                icon: PhoneIcon,
                label: 'End Call',
                sx: {
                  bgcolor: "rgba(220, 53, 69, 0.9)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(220, 53, 69, 1)" }
                },
                onClick: handleOpenEndCallModal
              }
            ].map((button, index) => (
              <IconButton
                key={index}
                onClick={button.onClick}
                disabled={isEndingCall}
                sx={{
                  bgcolor: "rgba(28, 67, 166, 0.1)",
                  color: "#1C43A6",
                  "&:hover": { bgcolor: "rgba(28, 67, 166, 0.2)" },
                  fontFamily: "'Inter', sans-serif",
                  fontSize: { xs: '18px', sm: '20px' },
                  ...button.sx
                }}
              >
                <button.icon fontSize="inherit" />
              </IconButton>
            ))}
          </Box>
        </Box>

        {/* Call Information */}
        <Box sx={{ p: { xs: '8px', sm: '12px' }, backgroundColor: "white" }}>
          <Box sx={{ marginBottom: "1px" }}>
            {[
              "Poor Internet connection detected, please connect to another network.",
              "Request you to stay stable in front of the camera",
              "Please follow the instructions displayed on your screen"
            ].map((text, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px', mb: '8px' }}>
                <Box sx={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#1C43A6",
                  minWidth: "8px",
                  marginTop: "4px",
                  borderRadius: '50%'
                }} />
                <Box
                  component="small"
                  sx={{
                    fontWeight: 500,
                    color: "#212529",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: "1.4",
                    fontSize: { xs: '0.8rem', sm: 'inherit' }
                  }}
                >
                  {text}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Message Input */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Write a Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              mb: 1,
              fontFamily: "'Inter', sans-serif",
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#dee2e6',
                },
                '&:hover fieldset': {
                  borderColor: '#1C43A6',
                },
              }
            }}
          />

          {/* Notify Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleNotifyCustomer}
            sx={{
              py: 1.5,
              backgroundColor: "#1C43A6",
              '&:hover': {
                backgroundColor: "#15337D",
              },
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              textTransform: 'none',
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}
          >
            Notify Customer
          </Button>
        </Box>
      </Box>

      <CallEndModal
        open={endCallModalOpen}
        onClose={handleCloseEndCallModal}
        onConfirm={handleEndCall}
        isLoading={isEndingCall}
      />
    </Box>
  );
};

export default VideoCallAgentSection;