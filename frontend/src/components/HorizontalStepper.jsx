import React from 'react';
import {Stepper,Step,StepLabel,Box,Container,StepConnector,stepConnectorClasses,styled} from '@mui/material';
import {LocationOn as LocationOnIcon,QuestionAnswer as QuestionAnswerIcon,Portrait as PortraitIcon,ContactMail as AadharIcon,} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

const steps = [
  { label: 'Check Location', icon: <LocationOnIcon sx={{ color: 'white' }} /> },
  { label: 'Q and A', icon: <QuestionAnswerIcon sx={{ color: 'white' }} /> },
  { label: 'Check Liveness Face', icon: <PortraitIcon sx={{ color: 'white' }} /> },
  { label: 'Check Aadhar Card', icon: <AadharIcon sx={{ color: 'white' }} /> },
  { label: 'Check PAN Card', icon: <AadharIcon sx={{ color: 'white' }} /> },
];

// Custom connector with dotted line
const DottedConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 20,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderTopWidth: 2,
    borderColor: theme.palette.grey[400],
    borderTopStyle: 'dotted',
    borderRadius: 1,
    marginLeft: 8,
    marginRight: 8,
  },
}));


const StepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active || ownerState.completed 
    ? theme.palette.primary.main 
    : theme.palette.grey[400],
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}));

function StepIcon(props) {
  const { active, completed, icon } = props;

  return (
    <StepIconRoot ownerState={{ active, completed }}>
      {icon}
    </StepIconRoot>
  );
}

 const HorizontalStepper=() => {
  const location = useLocation();

  // Determine active step based on current route with exact matching
  const getActiveStep = () => {
    const path = location.pathname;
    
    // Use exact path matching or specific patterns
    if (path === '/check-location-map' || path.includes('/check-location-map')) return 0;
    if (path === '/question-answer' || path.includes('/question-answer')) return 1;
    if (path === '/check-face' || path.includes('/check-face')) return 2;
    if (path === '/check-aadhar' || path.includes('/check-aadhar')) return 3;
    if (path === '/check-pan' || path.includes('/check-pan')) return 4;
    
    return 0; // Default to first step
  };

  const activeStep = getActiveStep();

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <Box sx={{ 
        width: '100%', 
        mt: 4, 
        px: 2, 
        backgroundColor: 'white',
        mb: 2, 
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        p: 2 
      }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<DottedConnector />}
          sx={{
            width: '100%',
            '& .MuiStepLabel-label.Mui-active': {
              color: 'primary.main',
              fontWeight: 'bold',
            },
            '& .MuiStepLabel-label.Mui-completed': {
              color: 'primary.main',
            },
          }}
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel
                StepIconComponent={StepIcon}
                icon={step.icon}
                sx={{
                  '& .MuiStepLabel-labelContainer': {
                    maxWidth: '150px',
                    whiteSpace: 'normal',
                    textAlign: 'center',
                    '@media (max-width: 600px)': {
                      maxWidth: '80px',
                      fontSize: '0.75rem',
                    }
                  },
                  '& .MuiStepLabel-iconContainer': {
                    padding: '0px 0'
                  }
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Container>
  );
}

export default HorizontalStepper;