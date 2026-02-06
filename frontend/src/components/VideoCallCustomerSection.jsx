import { Box, Chip } from "@mui/material";
import dummyImage from "../assets/dummy.png";

const VideoCallCustomerSection = () => {
  return (
    <Box sx={{ 
      borderRadius: '8px', 
      overflow: 'hidden',
      height: '100%',
      boxShadow: 'none',
      backgroundColor: 'white',
      p: 2
    }}>
      {/* Video Area */}
      <Box sx={{ 
        position: 'relative',
        height: "500px", 
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#343a40',
        mb: 2
      }}>
        <Box
          component="img"
          // src="../assets/image.png"
          src={dummyImage}
          alt="Customer Video"
          sx={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover" 
          }}
        />

        {/* Customer Tag */}
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          p: '8px' 
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
      </Box>

      {/* Date and Time Display */}
      <Box sx={{
        textAlign: 'center',
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.875rem',
        color: '#212529',
        fontWeight: 500
      }}>
        17-Jun-2025, 05:30:21 PM
      </Box>
    </Box>
  );
};

export default VideoCallCustomerSection;