import { Box, Typography, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';




const UserConsentDetailsTable = () => {
  const userData = [
    { userconsentstatusandtimestamps: 'Yes, on 13-06-2025 17:28:26',  consentdetails: 'I provide my consent to all the points mentioned here' }

  ];


  return (
    <Box sx={{
    //   borderRadius: '8px',
    //   overflow: 'hidden',
    //   height: '100%',
    //   boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    //   backgroundColor: 'white',
    //   p: 3
    }}>
      <Typography variant="h6" sx={{ 
        color: '#1C43A6',
        fontWeight: 600,  
        mb: 2,
        fontSize: '1.25rem'
      }}>
        User Consent Details
      </Typography>
      
      <Divider sx={{ mb: 2 }} />

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
              <TableCell sx={{ 
                  textAlign: 'center'
                }}>User Consent Status and Timestamps</TableCell>

              <TableCell sx={{ 
                  textAlign: 'center'
                }}>Consent Details</TableCell>
                
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((row, index) => (
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
                <TableCell sx={{ 
                //   fontWeight: 600,
                  textAlign: 'center'
                }}><strong>{row.userconsentstatusandtimestamps}</strong>
                </TableCell>

                <TableCell sx={{ 
                  fontWeight: 600,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                 }}>
                  {row.consentdetails}
                  <InfoIcon sx={{ 
                    color: '#1C43A6',
                    fontSize: '18px'
                  }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </Box>




  );
};

export default UserConsentDetailsTable;