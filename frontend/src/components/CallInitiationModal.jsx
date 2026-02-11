import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Box, CircularProgress } from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import { useNavigate } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa";
import { MdVideocam, MdLocationOn } from "react-icons/md";
import Switch from "@mui/material/Switch";

import socketService from "../services/socket.service";
import webrtcService from "../services/webrtc.service";
import { initiateAgentSession } from "../api/webrtc.api";

const CallInitiationModal = ({
  open,
  onClose,
  customer,
  onCloseIconClick,
}) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [isFetchingConnection, setIsFetchingConnection] = useState(false);

  const [agentLocation, setAgentLocation] = useState({ latitude: null, longitude: null });
  const [connectionId, setConnectionId] = useState(null);
  const [customerData, setCustomerData] = useState(null);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
  if (videoRef.current && mediaStreamRef.current) {
    videoRef.current.srcObject = mediaStreamRef.current;

    videoRef.current
      .play()
      .catch(err => {
        console.warn("Autoplay blocked:", err);
      });
  }
}, [isVideoReady]);


  // ✅ Fetch connectionId from backend using VcipId
  useEffect(() => {
    const fetchConnectionId = async () => {
      if (!open) return;

      console.log('🔍 Modal opened with customer data:', customer);

      // Reset states
      setIsProcessing(false);
      setIsSuccess(false);
      setIsVideoReady(false);
      setProgressValue(0);
      setMicEnabled(false);
      setCameraEnabled(false);
      setLocationEnabled(false);
      setConnectionId(null);
      setCustomerData(null);

      if (!customer) {
        console.error('❌ No customer data provided!');
        alert('Error: No customer data available.');
        return;
      }

      // Handle if customer is an array (take first item)
      let customerObj = customer;
      if (Array.isArray(customer)) {
        console.log('⚠️ Customer is an array, taking first item');
        customerObj = customer[0];
      }

      // Extract VcipId
      const vcipId = customerObj?.VcipId || customerObj?.vcipId;
      
      if (!vcipId) {
        console.error('❌ No VcipId found in customer object!');
        alert('Error: VCIP ID not found.');
        return;
      }

      console.log('🔑 VcipId:', vcipId);
      setCustomerData(customerObj);

      // ✅ Check if connectionId already exists in customer object
      let extractedConnectionId = 
        customerObj.ConnectionId || 
        customerObj.connectionId || 
        customerObj.connection_id ||
        null;

      if (extractedConnectionId) {
        console.log('✅ ConnectionId found in customer object:', extractedConnectionId);
        setConnectionId(extractedConnectionId);
        return;
      }

      // ✅ If no connectionId, fetch it from backend using VcipId
      try {
        setIsFetchingConnection(true);
        console.log('📡 Fetching connectionId from backend for VCIP:', vcipId);

        const response = await fetch(
          `${API}/webrtc/connection/${vcipId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch connection: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("✅ Connection data received:", result);

        const fetchedConnectionId =
          result?.data?.connectionId ||
          result?.data?.ConnectionId;

        if (!fetchedConnectionId) {
          console.error("❌ Full response payload:", result);
          throw new Error("ConnectionId not found in response");
        }

        setConnectionId(fetchedConnectionId);
        console.log("✅ ConnectionId set to:", fetchedConnectionId);

      } catch (error) {
        console.error('❌ Error fetching connectionId:', error);
        alert(`Error: Could not fetch connection details. ${error.message}`);
      } finally {
        setIsFetchingConnection(false);
      }
    };

    fetchConnectionId();
  }, [open, customer]);

  const cleanupAllStreams = (force = false) => {
    if (!force && webrtcService?.peerConnection) {
      console.log("⚠️ Skipping cleanup: active WebRTC session");
      return;
    }

    console.log('🧹 Cleaning up all streams...');

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject = null;
    }
  };

  const requestMicPermission = async () => {
    try {
      console.log('🎤 Requesting microphone...');
      
      if (mediaStreamRef.current) {
        const audioTracks = mediaStreamRef.current.getAudioTracks();
        if (audioTracks.length > 0) {
          setMicEnabled(true);
          console.log('✅ Microphone already available in existing stream');
          return;
        }
      }
      
      const constraints = cameraEnabled 
        ? { audio: true, video: true }
        : { audio: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (mediaStreamRef.current && cameraEnabled) {
        stream.getTracks().forEach(track => {
          if (!mediaStreamRef.current.getTracks().find(t => t.kind === track.kind)) {
            mediaStreamRef.current.addTrack(track);
          }
        });
      } else {
        mediaStreamRef.current = stream;
      }
      
      setMicEnabled(true);
      console.log('✅ Microphone permission granted');
    } catch (error) {
      console.error('❌ Microphone permission denied:', error);
      alert('Microphone access denied. Please allow access in browser settings.');
    }
  };

  const requestCameraPermission = async () => {
    try {
      console.log('📹 Requesting camera...');
      
      if (mediaStreamRef.current) {
        const videoTracks = mediaStreamRef.current.getVideoTracks();
        if (videoTracks.length > 0) {
          setCameraEnabled(true);
          console.log('✅ Camera already available in existing stream');
          return;
        }
      }
      
      const constraints = micEnabled 
        ? { audio: true, video: true }
        : { video: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (mediaStreamRef.current && micEnabled) {
        stream.getTracks().forEach(track => {
          if (!mediaStreamRef.current.getTracks().find(t => t.kind === track.kind)) {
            mediaStreamRef.current.addTrack(track);
          }
        });
      } else {
        mediaStreamRef.current = stream;
      }
      
      setCameraEnabled(true);
      console.log('✅ Camera permission granted');
    } catch (error) {
      console.error('❌ Camera permission denied:', error);
      alert('Camera access denied. Please allow access in browser settings.');
    }
  };

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAgentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationEnabled(true);
          console.log('✅ Location permission granted:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('❌ Location permission denied:', error);
          alert('Location access denied. Please allow access in browser settings.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    let timer;
    let videoTimer;
    let progressInterval;

    if (isProcessing) {
      progressInterval = setInterval(() => {
        setProgressValue((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 1;
        });
      }, 40);

      timer = setTimeout(() => {
        setIsSuccess(true);
      }, 2000);

      videoTimer = setTimeout(async () => {
        try {
          console.log('🎥 Setting up video preview...');
          
          let stream = mediaStreamRef.current;
          
          webrtcService.localStream = stream;
          console.log('✅ Stream assigned to webrtcService');
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            console.log('✅ Stream assigned to video preview');
          }
          mediaStreamRef.current?.getVideoTracks().forEach(track => {
  track.enabled = true;
});
 
          setIsVideoReady(true);
          console.log('✅ Video preview ready');
        } catch (error) {
          console.error('❌ Failed to get video stream:', error);
          alert('Camera error: ' + error.message + '\n\nPlease:\n1. Close ALL apps using camera (Zoom, Teams, etc.)\n2. Reload this page\n3. Try again');
          setIsProcessing(false);
          setProgressValue(0);
        }
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(videoTimer);
      clearInterval(progressInterval);
    };
  }, [isProcessing]);

  const allPermissionsGranted = micEnabled && cameraEnabled && locationEnabled;

  const handleStartCall = () => {
    if (!allPermissionsGranted) {
      alert("Please enable Microphone, Camera and Location to start the call.");
      return;
    }

    if (!connectionId) {
      console.error('❌ Cannot start processing: connectionId is null');
      alert('Error: Connection ID not found. Please close and reopen this dialog.');
      return;
    }

    console.log('🚀 Starting call processing with connectionId:', connectionId);
    setIsProcessing(true);
  };

  const handleSubmit = async () => {
    try {
      if (!connectionId) {
        console.error('❌ Cannot submit: connectionId is null');
        alert('Error: Connection ID not found. Please try again.');
        return;
      }

      console.log('📤 Initiating agent session with connectionId:', connectionId);
      console.log('📍 Agent location:', agentLocation);

      if (!agentLocation.latitude || !agentLocation.longitude) {
        alert('Error: Location not available. Please enable location permission.');
        return;
      }

      // ✅ 1. Call backend to initiate agent session
      await initiateAgentSession({
        connectionId: connectionId,
        latitude: agentLocation.latitude,
        longitude: agentLocation.longitude
      });
      console.log('✅ Agent session initiated');

      // ✅ 2. Connect to socket
      console.log('🔌 Connecting to socket...');
      await socketService.connect();
      
      // ✅ 3. Join room
      console.log('🚪 Joining room:', connectionId);
      socketService.joinRoom(connectionId, 'agent');

      // ✅ 4. Create peer connection with remote stream callback
      console.log('🔗 Creating peer connection...');
      webrtcService.createPeerConnection(
        socketService,
        connectionId,
        (remoteStream) => {
          console.log('📹 Remote stream received in modal callback');
        }
      );

      // ✅ 5. Setup socket listeners - AGENT WAITS FOR OFFER
      socketService.on('offer', async (data) => {
        console.log('📨 Received OFFER from customer');
        await webrtcService.handleOffer(data.offer, socketService, connectionId);
      });

      socketService.on('answer', async (data) => {
        console.log('📨 Received ANSWER from customer (unexpected)');
        await webrtcService.handleAnswer(data.answer);
      });

      socketService.on('ice-candidate', async (data) => {
        console.log('🧊 Received ICE candidate');
        await webrtcService.handleIceCandidate(data.candidate);
      });

      // ✅ 6. Do NOT create offer - wait for customer's offer
      console.log('⏳ Waiting for customer to send offer...');

      // ✅ 7. Store in window for navigation
      window.webrtcStreams = {
        local: webrtcService.localStream,
        connectionId: connectionId,
        customer: customerData
      };

      console.log('✅ WebRTC setup complete, navigating to check-location...');

      // ✅ 8. Close modal and navigate
      onClose();
      navigate("/check-location", { 
        state: { 
          connectionId,
          customer: customerData
        } 
      });

    } catch (error) {
      console.error('❌ Failed to connect to customer:', error);
      alert('Failed to connect to customer: ' + error.message);
    }
  };

  const handleCloseIconClick = () => {
    cleanupAllStreams(true);
    onCloseIconClick();
    onClose();
  };

  const permissionRow = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const leftSection = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#212529",
    fontSize: "14px",
  };

  return (
    <Modal
      open={open}
      onClose={() => {}}
      aria-labelledby="call-modal-title"
      aria-describedby="call-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          maxWidth: "95vw",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          outline: "none",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Button
          onClick={handleCloseIconClick}
          sx={{
            position: "absolute",
            right: { xs: 8, sm: 16 },
            top: { xs: 8, sm: 16 },
            minWidth: "auto",
            color: "#6c757d",
          }}
        >
          <Close />
        </Button>

        <div style={{ textAlign: "left" }}>
          <h5
            style={{
              fontWeight: "bold",
              color: "#212529",
              marginBottom: "8px",
              fontSize: "1.25rem",
            }}
          >
            Audio / Video Check
          </h5>
          <p
            style={{
              color: "#6c757d",
              marginBottom: "16px",
              fontSize: "1rem",
            }}
          >
            {isFetchingConnection ? (
              <span>Loading connection details...</span>
            ) : (
              <span>
                VCIP - {customerData?.VcipId || customerData?.vcipId} - {customerData?.CustomerName || customerData?.customerName}
              </span>
            )}
          </p>

          <hr style={{ borderColor: "#A8A8A8", marginBottom: "16px" }} />

          {isFetchingConnection ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <CircularProgress size={30} />
              <p style={{ marginTop: "10px", color: "#6c757d" }}>
                Fetching connection details...
              </p>
            </div>
          ) : !connectionId ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p style={{ color: "#dc3545", fontWeight: "bold" }}>
                Error: Connection ID not found. Please try again.
              </p>
            </div>
          ) : (
            <>
              <p
                style={{
                  fontWeight: "bold",
                  marginBottom: "24px",
                  fontSize: "1rem",
                }}
              >
                Please check if your camera and mic is working and proceed.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginBottom: "20px",
                }}
              >
                <div style={permissionRow}>
                  <div style={leftSection}>
                    <FaMicrophone size={18} />
                    <span>
                      {micEnabled ? "Enabled Microphone" : "Disabled Microphone"}
                    </span>
                  </div>
                  <Switch
                    checked={micEnabled}
                    onChange={requestMicPermission}
                    color="primary"
                    disabled={isProcessing}
                  />
                </div>

                <div style={permissionRow}>
                  <div style={leftSection}>
                    <MdVideocam size={20} />
                    <span>
                      {cameraEnabled ? "Enabled Camera" : "Disabled Camera"}
                    </span>
                  </div>
                  <Switch
                    checked={cameraEnabled}
                    onChange={requestCameraPermission}
                    color="primary"
                    disabled={isProcessing}
                  />
                </div>

                <div style={permissionRow}>
                  <div style={leftSection}>
                    <MdLocationOn size={20} />
                    <span>
                      {locationEnabled ? "Enabled Location" : "Disabled Location"}
                    </span>
                  </div>
                  <Switch
                    checked={locationEnabled}
                    onChange={requestLocationPermission}
                    color="primary"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* ✅ Video Preview Section - ONLY SHOW AFTER START PROCESSING */}
              {isProcessing && (
                <>
                  <p
                    style={{
                      color: "#1C43A6",
                      marginBottom: "8px",
                      fontSize: "1rem",
                    }}
                  >
                    Video Preview
                  </p>

                  <Stack spacing={2} sx={{ marginBottom: "16px" }}>
                    <LinearProgress
                      variant="determinate"
                      value={progressValue}
                      color="primary"
                    />
                  </Stack>

                  {isSuccess && (
                    <div
                      style={{
                        backgroundColor: "rgba(1, 125, 28, 0.1)",
                        borderRadius: "4px",
                        padding: "12px",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "24px",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          backgroundColor: "#017D1C",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "12px",
                        }}
                      >
                        <Check style={{ color: "white", fontSize: "16px" }} />
                      </div>
                      <span style={{ color: "#017D1C" }}>
                        {isVideoReady
                          ? "Video Processing Successfully!"
                          : "Session Created Successfully!"}
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      height: "200px",
                      backgroundColor: "#000",
                      borderRadius: "4px",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {!isVideoReady ? (
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <CircularProgress size={40} sx={{ color: 'white' }} />
                        <div style={{ color: "#fff", textAlign: "center" }}>
                          Loading video preview...
                        </div>
                      </div>
                    ) : (
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                </>
              )}

              <Button
                variant="contained"
                onClick={isVideoReady ? handleSubmit : handleStartCall}
                disabled={
                  (!allPermissionsGranted && !isProcessing) ||
                  (isProcessing && !isVideoReady)
                }
                fullWidth
                sx={{
                  backgroundColor: "#1C43A6",
                  color: "white",
                  padding: "10px",
                  marginTop: isProcessing ? "0" : "16px",
                  "&:hover": {
                    backgroundColor: "#15317D",
                  },
                  "&:disabled": {
                    backgroundColor: "rgba(28, 67, 166, 0.3)",
                  },
                }}
              >
                {isProcessing
                  ? isVideoReady
                    ? "Submit"
                    : "Processing..."
                  : "Start Processing"}
              </Button>
            </>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default CallInitiationModal;