import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Box, CircularProgress } from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
// import dummyImage from "../assets/dummy.png";
import { useNavigate, Link } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa";
import { MdVideocam, MdLocationOn } from "react-icons/md";
import Switch from "@mui/material/Switch";

const CallInitiationModal = ({
  open,
  onClose,
  customer,
  onStartCall,
  onCloseIconClick,
}) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

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

  const videoRef = useRef(null);

  useEffect(() => {
    if (open) {
      setIsProcessing(false);
      setIsSuccess(false);
      setIsVideoReady(false);
      setProgressValue(0);
    }
  }, [open]);

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

      videoTimer = setTimeout(() => {
        setIsVideoReady(true);
      }, 4000);
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(videoTimer);
      clearInterval(progressInterval);
    };
  }, [isProcessing]);

  const allPermissionsGranted = micEnabled && cameraEnabled && locationEnabled;

  useEffect(() => {
  if (!allPermissionsGranted) {
    setIsProcessing(false);
    setIsSuccess(false);
    setIsVideoReady(false);
    setProgressValue(0);
    
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }
}, [allPermissionsGranted]);

  useEffect(() => {
    if (isVideoReady && cameraEnabled) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Camera access denied", err);
        });
    }

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoReady, cameraEnabled]);


  // ADD THIS NEW EFFECT BELOW YOUR OTHER EFFECTS
useEffect(() => {
  const syncPermissions = async () => {
    try {
      // 1. Sync Camera
      const cameraStatus = await navigator.permissions.query({ name: "camera" });
      setCameraEnabled(cameraStatus.state === "granted");
      cameraStatus.onchange = () => {
        setCameraEnabled(cameraStatus.state === "granted");
      };

      // 2. Sync Microphone
      const micStatus = await navigator.permissions.query({ name: "microphone" });
      setMicEnabled(micStatus.state === "granted");
      micStatus.onchange = () => {
        setMicEnabled(micStatus.state === "granted");
      };

      // 3. Sync Location
      const geoStatus = await navigator.permissions.query({ name: "geolocation" });
      setLocationEnabled(geoStatus.state === "granted");
      geoStatus.onchange = () => {
        setLocationEnabled(geoStatus.state === "granted");
      };
    } catch (err) {
      console.error("Permissions API not fully supported", err);
    }
  };

  if (open) {
    syncPermissions();
  }
}, [open]);

  // const allPermissionsGranted = micEnabled && cameraEnabled && locationEnabled;

  const handleStartCall = () => {
    if (!allPermissionsGranted) {
      alert("Please enable Microphone, Camera and Location to start the call.");
      return;
    }

    if (!isProcessing) {
      setIsProcessing(true);
      onStartCall();
    }
  };

  const handleSubmit = () => {
    onClose();
    navigate("/check-location");
  };

  const handleCloseIconClick = () => {
    onCloseIconClick();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={() => {}}
      aria-labelledby="call-modal-title"
      aria-describedby="call-modal-description"
      disableBackdropClick
      disableEscapeKeyDown
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
        {/* Close button - now calls handleCloseIconClick */}
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

        {/* Audio/Video Check Screen */}
        <div style={{ textAlign: "left" }}>
          <h5
            style={{
              fontWeight: "bold",
              color: "#212529",
              marginBottom: "8px",
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            Audio / Video Check
          </h5>
          <p
            style={{
              color: "#6c757d",
              marginBottom: "16px",
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            VCIP - {customer?.vcpId} - {customer?.customerName}
          </p>

          <hr style={{ borderColor: "#A8A8A8", marginBottom: "16px" }} />

          <p
            style={{
              fontWeight: "bold",
              marginBottom: "24px",
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            Please check if your camera and mic is not working and proceed.
          </p>

          {/* Permission Status */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            {/* Microphone */}
            <div style={permissionRow}>
              <div style={leftSection}>
                <FaMicrophone size={18} />
                <span>
                  {micEnabled ? "Enabled Microphone" : "Disabled Microphone"}
                </span>
              </div>
              <Switch
                checked={micEnabled}
                onChange={(e) => setMicEnabled(e.target.checked)}
                color="primary"
              />
            </div>

            {/* Camera */}
            <div style={permissionRow}>
              <div style={leftSection}>
                <MdVideocam size={20} />
                <span>
                  {cameraEnabled ? "Enabled Camera" : "Disabled Camera"}
                </span>
              </div>
              <Switch
                checked={cameraEnabled}
                onChange={(e) => setCameraEnabled(e.target.checked)}
                color="primary"
              />
            </div>

            {/* Location */}
            <div style={permissionRow}>
              <div style={leftSection}>
                <MdLocationOn size={20} />
                <span>
                  {locationEnabled ? "Enabled Location" : "Disabled Location"}
                </span>
              </div>
              <Switch
                checked={locationEnabled}
                onChange={(e) => setLocationEnabled(e.target.checked)}
                color="primary"
              />
            </div>
          </div>

          <p
            style={{
              color: "#1C43A6",
              marginBottom: "8px",
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            Video Preview
          </p>

          <Stack spacing={2} sx={{ marginBottom: "16px" }}>
            <LinearProgress
              determinate
              value={progressValue}
              color="primary"
              sx={{
                "--LinearProgress-radius": "2px",
                "--LinearProgress-thickness": "4px",
              }}
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
                fontSize: { xs: "0.875rem", sm: "1rem" },
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
                  flexShrink: 0, // Prevent shrinking on small screens
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
              height: { xs: "150px", sm: "200px" },
              backgroundColor: "#f8f9fa",
              borderRadius: "4px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {isProcessing ? (
              !isVideoReady ? (
                <CircularProgress size={40} />
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
              )
            ) : (
              <div style={{ color: "#6c757d", textAlign: "center" }}>
                Video will appear after processing
              </div>
            )}
          </div>

          <Button
            variant="contained"
            onClick={isVideoReady ? handleSubmit : handleStartCall}
            // This logic now prevents clicking if permissions are revoked 
            // at ANY stage of the process.
            disabled={
              !allPermissionsGranted || (isProcessing && !isVideoReady)
            }
            fullWidth
            sx={{
              backgroundColor: "#1C43A6",
              color: "white",
              padding: "10px",
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
        </div>
      </Box>
    </Modal>
  );
};
export default CallInitiationModal;  

