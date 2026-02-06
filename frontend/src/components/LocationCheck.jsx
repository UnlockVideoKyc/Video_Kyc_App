import { Box, Typography, Paper } from '@mui/material';
import mapImage from "../assets/map2.png";

const LocationCheck = () => {
  return (
    <Box sx={{
      width: '100%',
      maxWidth: { xs: '100%', md: '880px' },
      mb: 3,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <Box sx={{ px: 1, mb: 2 }}>
        <Typography variant="h6" sx={{ 
          color: '#1C43A6',
          fontWeight: 600,
          fontSize: { xs: '1rem', sm: '1.1rem' }
        }}>
          Location Check
        </Typography>
      </Box>

      {/* Map Container - Responsive height */}
      <Paper sx={{
        width: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        height: {
          xs: '250px',  // Mobile
          sm: '300px',  // Tablet
          md: '350px',  // Small desktop
          lg: '400px'   // Large desktop
        }
      }}>
        {/* Map Image */}
        <Box
          component="img"
          src={mapImage}
          alt="Map"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      </Paper>
    </Box>
  );
};

export default LocationCheck;