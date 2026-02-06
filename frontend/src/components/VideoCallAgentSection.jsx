import { useState } from "react";
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
import dummyImage from "../assets/dummy.png";
import CallEndModal from "./CallEndModal";


const VideoCallAgentSection = ({ onFullScreenToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [message, setMessage] = useState("");
  const [endCallModalOpen, setEndCallModalOpen] = useState(false);
  const [userTooltipOpen, setUserTooltipOpen] = useState(false);
  const [locationTooltipOpen, setLocationTooltipOpen] = useState(false);
  const [wifiTooltipOpen, setwifiTooltipOpen] = useState(false);

  const toggleFullScreen = () => {
    const newFullScreenState = !isFullScreen;
    setIsFullScreen(newFullScreenState);
    // Notify parent component to hide customer section
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

  const handleEndCall = (selectedOptions, remark) => {
    console.log('Ending call with:', { selectedOptions, remark });
    setEndCallModalOpen(false);
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
        {/* Video Call Area - Responsive Height */}
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
          <Box
            component="img"
            src={dummyImage}
            alt="Agent Video"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />

          {/* Agent Tag */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            p: { xs: '4px', sm: '8px' }
          }}>
            <Chip
              label="Agent"
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
        </Box>

        {/* Call Controls - Responsive Padding */}
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
            {/* User Info Button with Responsive Tooltip */}
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

            {/* Location Button with Responsive Tooltip */}
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

            {/*WIFI Button with Responsive Tooltip */}
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

            {/* Other Buttons with Responsive Sizing */}
            {[
              // { icon: WifiIcon, label: 'Network' },
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
      />
    </Box>
  );
};

export default VideoCallAgentSection;