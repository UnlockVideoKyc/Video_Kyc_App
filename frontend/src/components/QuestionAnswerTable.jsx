import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const QuestionAnswerTable = () => {
  const questionData = [
    { 
      question: '1. What is the day today?', 
      answer: '1. Tuesday', 
      agentStatus: 'check', 
      remark: '' 
    },
    { 
      question: '2. What is the date today?', 
      answer: '2. 17-06-2025', 
      agentStatus: 'check', 
      remark: '' 
    },
    { 
      question: '3. Please read the 6 digits number visible on the screen 328691', 
      answer: '3. 328691', 
      agentStatus: 'check', 
      remark: '' 
    },
  ];

  const getAgentStatusIcon = () => {
    return (
      <Box sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: '#28a745',
        color: 'white'
      }}>
        <CheckIcon sx={{ fontSize: '16px' }} />
      </Box>
    );
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ 
        mb: 3,
        boxShadow: 'none',
        border: '1px solid #dee2e6'
      }}>
        <Table sx={{
          '& .MuiTableCell-root': {
            borderRight: '1px solid #dee2e6',
            '&:last-child': {
              borderRight: 'none'
            }
          }
        }}>
          <TableHead>
            <TableRow sx={{ 
              backgroundColor: '#f8f9fa',
              '& th': {
                fontWeight: 600,
                color: '#212529',
                borderBottom: '1px solid #dee2e6',
                fontSize: '16px',
                whiteSpace: 'nowrap'
              }
            }}>
              <TableCell>Question</TableCell>
              <TableCell>Answer</TableCell>
              <TableCell>Agent Status</TableCell>
              <TableCell>Remark</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questionData.map((row, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  '& td': {
                    borderBottom: '1px solid #dee2e6',
                    fontSize: '16px'
                  },
                  '&:last-child td': {
                    borderBottom: 'none'
                  }
                }}
              >
                <TableCell sx={{ fontWeight: 500 }}>{row.question}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{row.answer}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {getAgentStatusIcon()}
                </TableCell>
                <TableCell>{row.remark}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default QuestionAnswerTable;