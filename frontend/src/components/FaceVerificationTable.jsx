import { Box, Typography, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const FaceVerificationTable = () => {
  const verificationData = [
    { 
      verification: 'Liveness Check', 
      match: '99.00%', 
      description: '', 
      agentStatus: 'check', 
      remark: '' 
    },
    { 
      verification: 'Face Match between Aadhar & Live Photo', 
      match: '99.00%', 
      description: '', 
      agentStatus: 'check', 
      remark: '' 
    },
    { 
      verification: 'Face Match Between Live Photo & PAN', 
      match: '1.00%', 
      description: '', 
      agentStatus: 'check', 
      remark: '' 
    },
  ];

  const getMatchColor = (match) => {
    if (match.includes('%')) {
      const percent = parseFloat(match);
      return percent >= 50 ? '#28a745' : '#dc3545';
    }
    return 'inherit';
  };

  const getAgentStatusIcon = (match) => {
    const percent = parseFloat(match);
    const isApproved = percent >= 50;
    const color = isApproved ? '#28a745' : '#dc3545';
    
    return (
      <Box sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: color,
        color: 'white'
      }}>
        {isApproved ? (
          <CheckIcon sx={{ fontSize: '16px' }} />
        ) : (
          <CloseIcon sx={{ fontSize: '16px' }} />
        )}
      </Box>
    );
  };

  return (
    <Box sx={{
    //   borderRadius: '8px',
    //   overflow: 'hidden',
    //   height: '100%',
    //   boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    //   backgroundColor: 'white',
    //   p: 3
    }}>
      {/* <Typography variant="h6" sx={{ 
        color: '#1C43A6',
        fontWeight: 600,  
        mb: 2,
        fontSize: '1.25rem'
      }}>
        Face Verification
      </Typography> */}
      
      {/* <Divider sx={{ mb: 2 }} /> */}

      {/* Main Table */}
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
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }
            }}>
              <TableCell>Face Verification</TableCell>
              <TableCell>Match</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Agent Status</TableCell>
              <TableCell>Remark</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {verificationData.map((row, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  '& td': {
                    borderBottom: '1px solid #dee2e6',
                    fontSize: '14px'
                  },
                  '&:last-child td': {
                    borderBottom: 'none'
                  }
                }}
              >
                <TableCell sx={{ fontWeight: 500 }}>{row.verification}</TableCell>
                <TableCell sx={{ 
                  color: getMatchColor(row.match),
                  fontWeight: 600,
                  textAlign: 'center'
                }}>
                  {row.match}
                </TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {getAgentStatusIcon(row.match, row.agentStatus)}
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

export default FaceVerificationTable;