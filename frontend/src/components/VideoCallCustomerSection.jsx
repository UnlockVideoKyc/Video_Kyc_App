import { Box, Chip } from "@mui/material";
import { useEffect, useRef } from "react";

const VideoCallCustomerSection = ({ remoteStream }) => {
  const videoRef = useRef(null);
  const currentStreamRef = useRef(null); // ✅ Track current stream

  useEffect(() => {
    // ✅ Only update if stream actually changed
    if (videoRef.current && remoteStream && currentStreamRef.current !== remoteStream) {
      console.log('🔗 Attaching stream to video element');
      
      videoRef.current.srcObject = remoteStream;
      currentStreamRef.current = remoteStream; // Save reference
      
      videoRef.current.play().catch(err => {
        console.warn('Autoplay blocked, trying muted:', err);
        videoRef.current.muted = true;
        videoRef.current.play();
      });
    }
  }, [remoteStream]);

  return (
    <Box sx={{ borderRadius: '8px', overflow: 'hidden', p: 2 }}>
      <Box sx={{ position: 'relative', height: 500, backgroundColor: '#000' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />

        <Chip
          label="Agent"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: "black",
            color: "white"
          }}
        />

        {!remoteStream && (
          <Box sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            flexDirection: 'column',
            gap: 2
          }}>
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div>Waiting for customer video...</div>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default VideoCallCustomerSection;