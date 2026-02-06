// import { useState } from "react";
// import VideoCallAgentSection from "../../components/VideoCallAgentSection"
// import VideoCallCustomerSection from "../../components/VideoCallCustomerSection"
// // import HorizontalStepper from "../../components/HorizontalStepper"
// import QuestionAnswer from "../../components/QuestionAnswer"

// const QandA = () => {
//   const [isFullScreen, setIsFullScreen] = useState(false);

//   const handleFullScreenToggle = (fullScreenState) => {
//     setIsFullScreen(fullScreenState);
//   };

//   return (
//     <>
//       <div className="row">
//         {/* <HorizontalStepper/> */}
//         <div className={isFullScreen ? "col-md-9" : "col-md-3"}>
//           <VideoCallAgentSection onFullScreenToggle={handleFullScreenToggle}/>
//         </div>
//         {!isFullScreen && (
//           <div className="col-md-3">
//             <VideoCallCustomerSection/>
//           </div>
//         )}
//         <div className={isFullScreen ? "col-md-3" : "col-md-6"}>
//           <QuestionAnswer/>
//         </div>
//       </div>
//     </>
//   )
// }

// export default QandA;

import { useState } from "react";
import VideoCallAgentSection from "../../components/VideoCallAgentSection"
import VideoCallCustomerSection from "../../components/VideoCallCustomerSection"
import { Box, Typography, Divider, Button, TextField } from '@mui/material';
import { Check, Close, InfoOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const QandA = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [questionStates, setQuestionStates] = useState({
    1: { status: null, showOptions: false },
    2: { status: null, showOptions: false },
    3: { status: null, showOptions: false },
    4: { status: null, showOptions: false }
  });

  const navigate = useNavigate();

  const handleFullScreenToggle = (fullScreenState) => {
    setIsFullScreen(fullScreenState);
  };

  const handleNextClick = () => {
    navigate('/check-face');
  };

  const handleAskClick = (questionId) => {
    setQuestionStates(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], showOptions: true }
    }));
  };

  const handleStatusSelect = (questionId, status) => {
    setQuestionStates(prev => ({
      ...prev,
      [questionId]: { status, showOptions: false }
    }));
  };

  const getStatusDisplay = (questionId) => {
    const { status } = questionStates[questionId];
    if (status === 'correct') {
      return (
        <Box sx={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          borderRadius: '4px',
          px: 1.5,
          mt: 1,
          py: 0.5
        }}>
          <Typography sx={{ color: '#28a745', fontWeight: 500 }}>
            Correct
          </Typography>
        </Box>
      );
    }
    if (status === 'incorrect') {
      return (
        <Box sx={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderRadius: '4px',
          px: 1.5,
          mt: 1,
          py: 0.5
        }}>
          <Typography sx={{ color: '#dc3545', fontWeight: 500 }}>
            Incorrect
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const renderQuestionControls = (questionId) => {
    const { showOptions } = questionStates[questionId];
    
    if (showOptions) {
      return (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            sx={{
              minWidth: 0,
              width: 32,
              height: 32,
              borderRadius:'50%',
              p: 0,
              mt: 1,
              backgroundColor: '#28a745',
              '&:hover': { backgroundColor: '#218838' }
            }}
            onClick={() => handleStatusSelect(questionId, 'correct')}
          >
            <Check sx={{ color: 'white', fontSize: '1rem' }} />
          </Button>
          <Button
            variant="contained"
            sx={{
              minWidth: 0,
              width: 32,
              height: 32,
              borderRadius:'50%',
              p: 0,
              mt: 1,
              backgroundColor: '#dc3545',
              '&:hover': { backgroundColor: '#c82333' }
            }}
            onClick={() => handleStatusSelect(questionId, 'incorrect')}
          >
            <Close sx={{ color: 'white', fontSize: '1rem' }} />
          </Button>
        </Box>
      );
    }

    if (!questionStates[questionId].status) {
      return (
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#1C43A6',
            '&:hover': { backgroundColor: '#15337D' },
            textTransform: 'none',
            px: 2,
            py: 0.5,
            fontWeight: 500,
            mt: 1
          }}
          onClick={() => handleAskClick(questionId)}
        >
          ASK
        </Button>
      );
    }

    return getStatusDisplay(questionId);
  };

  return (
    <>
      <div className="row">
        {/* <HorizontalStepper/> */}
        <div className={isFullScreen ? "col-md-9" : "col-md-3"}>
          <VideoCallAgentSection onFullScreenToggle={handleFullScreenToggle}/>
        </div>
        {!isFullScreen && (
          <div className="col-md-3">
            <VideoCallCustomerSection/>
          </div>
        )}
        <div className={isFullScreen ? "col-md-3" : "col-md-6"}>
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
              // mb: 2,
              fontSize: '1.25rem'
            }}>
              Q and A
            </Typography>
          
            <Divider sx={{ mb: 2 }} />

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              // mb: 3,
              p: 1.5,
              backgroundColor: 'rgba(28, 67, 166, 0.1)',
              borderRadius: '4px'
            }}>
              <InfoOutlined sx={{
                color: '#1C43A6',
                fontSize: '20px',
                mr: 1.5
              }} />
              <Typography sx={{
                fontSize: '16px',
                color: '#1C43A6',
                fontWeight: 500
              }}>
                Please Note: that you can go forward only if 2 questions are correct.
              </Typography>
            </Box>

            {/* Question 1 */}
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
                  Q. What is your Last Name?
                </Typography>
                {renderQuestionControls(1)}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#212529' }}>
                  A. Jani
                </Typography>
              </Box>
              {/* {getStatusDisplay(1)} */}
              <TextField
                size="small"
                placeholder="Add remark (optional)"
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#dee2e6' } } }}
                // mt: 1,
              />
            </Box>

            <Divider sx={{ mb: 1 }} />

            {/* Question 2 */}
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
                  Q. Please read the 6 digits number visible on the screen 328691
                </Typography>
                {renderQuestionControls(2)}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#212529' }}>
                  A. 328691
                </Typography>
              </Box>
              {/* {getStatusDisplay(2)} */}
              <TextField
                size="small"
                placeholder="Add remark (optional)"
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#dee2e6' } } }}
                // mt: 1,
              />
            </Box>

            <Divider sx={{ mb: 1 }} />

            {/* Question 3 */}
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
                  Q. What is the day today?
                </Typography>
                {renderQuestionControls(3)}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#212529' }}>
                  A. Wednesday
                </Typography>
              </Box>
              {/* {getStatusDisplay(3)} */}
              <TextField
                size="small"
                placeholder="Add remark (optional)"
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#dee2e6' } } }}
                // mt: 1,
              />
            </Box>

            <Divider sx={{ mb: 1 }} />

            {/* Question 4 */}
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
                  Q. What is your First Name?
                </Typography>
                {renderQuestionControls(4)}
              </Box>
              {/* mb:1, */}
              <Box sx={{ display: 'flex', alignItems: 'center', }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#212529' }}>
                  A. Riddhi
                </Typography>
              </Box>
              {/* {getStatusDisplay(4)} */}
              <TextField
                size="small"
                placeholder="Add remark (optional)"
                fullWidth
                sx={{ mt: 1, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#dee2e6' } } }}
              />
            </Box>

            {/* <Divider sx={{ mb: 1 }} /> */}

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
        </div>
      </div>
    </>
  )
}

export default QandA;