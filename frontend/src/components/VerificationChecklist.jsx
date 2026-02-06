import { Box, Typography, Divider, Button } from '@mui/material';
import {MicOutlined,VideocamOutlined,LocationOnOutlined,SpeedOutlined,NetworkWifiOutlined,AspectRatioOutlined,Check} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; 

const VerificationChecklist = () => {
  const navigate = useNavigate();
  
  const handleNextClick = () => {
  navigate('/check-location-map'); 
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
      {/* Title */}
      <Typography variant="h6" sx={{ 
        color: '#1C43A6',
        fontWeight: 600,  
        mb: 2,
        fontSize: '1.25rem'
      }}>
        Please Verify the below Instruction to Begin
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Bullet Points - Two Columns */}
{/* Bullet Points - Two Columns */}
<Box sx={{ 
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  gap: 1,
  mb: 3
}}>
  {/* First Column */}
  <Box>
    {[
      "User is alone on the call (unless BC assisted)",
      "User face can be seen clearly",
      "User voice can be heard clearly",
      "User is not allowed to attend any other call or message during the live call of V-KYC with agent.",
      "User is not allowed to minimize or switch the screen, until it has been asked by Agent."
    ].map((text, index) => (
      <Box key={`left-${index}`} sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px', mb: '8px' }}>
        <Box sx={{ 
          width: "8px", 
          height: "8px", 
          backgroundColor: "#1C43A6",
          minWidth: "8px",
          marginTop: "6px",  // Adjusted to match original text alignment
          borderRadius: '50%'
        }} />
        <Box component="li" sx={{ 
          listStyleType: 'none',
          pl: 0,
          m: 0,
          fontSize: 'inherit',  // Preserves original font size
          fontFamily: 'inherit' // Preserves original font family
        }}>
          {text}
        </Box>
      </Box>
    ))}
  </Box>

  {/* Second Column */}
  <Box>
    {[
      "User can see you clearly",
      "User is in a well-lit environment",
      "User should not talk with any other third person during the call.",
      "User can connect the head phone before verification starts, if the agent voice is not clear to him."
    ].map((text, index) => (
      <Box key={`right-${index}`} sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px', mb: '8px' }}>
        <Box sx={{ 
          width: "8px", 
          height: "8px", 
          backgroundColor: "#1C43A6",
          minWidth: "8px",
          marginTop: "6px",  
          borderRadius: '50%'
        }} />
        <Box component="li" sx={{ 
          listStyleType: 'none',
          pl: 0,
          m: 0,
          fontSize: 'inherit',  
          fontFamily: 'inherit' 
        }}>
          {text}
        </Box>
      </Box>
    ))}
  </Box>
</Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Technical Requirements with Checkmarks on Right */}
      <Box component="ul" sx={{ 
        listStyleType: 'none',
        pl: 0,
        m: 0,
        mb: 3,
        '& li': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',  
          mb: 1.5
        }
      }}>
        <li>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MicOutlined sx={{ color: 'inherit', mr: 1 }} />
            <Typography>Enabled Microphone</Typography>
          </Box>
          <Box sx={{ 
            width: 24,  
            height: 24, 
            borderRadius: '50%', 
            bgcolor: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ml: 1
          }}>
            <Check sx={{ color: 'white', fontSize: '1rem' }} />
          </Box>
        </li>
        <li>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VideocamOutlined sx={{ color: 'inherit', mr: 1 }} />
            <Typography>Enabled Camera</Typography>
          </Box>
          <Box sx={{ 
            width: 24, 
            height: 24, 
            borderRadius: '50%', 
            bgcolor: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ml: 1
          }}>
            <Check sx={{ color: 'white', fontSize: '1rem' }} />
          </Box>
        </li>
        <li>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOnOutlined sx={{ color: 'inherit', mr: 1 }} />
            <Typography>Enabled Location</Typography>
          </Box>
          <Box sx={{ 
            width: 24, 
            height: 24, 
            borderRadius: '50%', 
            bgcolor: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ml: 1
          }}>
            <Check sx={{ color: 'white', fontSize: '1rem' }} />
          </Box>
        </li>
        <li>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SpeedOutlined sx={{ color: 'inherit', mr: 1 }} />
            <Typography>10 Mbps Download Speed</Typography>
          </Box>
          <Box sx={{ 
            width: 24, 
            height: 24, 
            borderRadius: '50%', 
            bgcolor: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ml: 1
          }}>
            <Check sx={{ color: 'white', fontSize: '1rem' }} />
          </Box>
        </li>
        <li>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NetworkWifiOutlined sx={{ color: 'inherit', mr: 1 }} />
            <Typography>150 4g Mbps Upload Speed</Typography>
          </Box>
          <Box sx={{ 
            width: 24, 
            height: 24, 
            borderRadius: '50%', 
            bgcolor: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ml: 1
          }}>
            <Check sx={{ color: 'white', fontSize: '1rem' }} />
          </Box>
        </li>
        <li>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AspectRatioOutlined sx={{ color: 'inherit', mr: 1 }} />
            <Typography>360 x 800 Video Resolution</Typography>
          </Box>
          <Box sx={{ 
            width: 24, 
            height: 24, 
            borderRadius: '50%', 
            bgcolor: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ml: 1
          }}>
            <Check sx={{ color: 'white', fontSize: '1rem' }} />
          </Box>
        </li>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button 
          onClick={handleNextClick}
          variant="contained" 
          sx={{ 
            backgroundColor: '#1C43A6',
            '&:hover': { backgroundColor: '#15337D' },
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

export default VerificationChecklist;