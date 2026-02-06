import { Box, Typography, Divider, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';




const KycReportTable = () => {
  const kycData = [
    { agentData: 'Riddhi Jani', templateKyc: 'in VKYC', vcpId: '255511', date: '13-06-2025', timeStamp: '05:30;15 PM' }

  ];


  return (
    <Box sx={{
      // borderRadius: '8px',
      // overflow: 'hidden',
      // height: '100%',
      // boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      // backgroundColor: 'white',
      // p: 3
    }}>
      <Typography variant="h6" sx={{ 
        color: '#1C43A6',
        fontWeight: 600,  
        mb: 2,
        fontSize: '1.25rem'
      }}>
        KYC  Report
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
                }}>Agent Name</TableCell>

              <TableCell sx={{ 
                  textAlign: 'center'
                }}>Template KYC</TableCell>

              <TableCell sx={{ 
                  textAlign: 'center'
                }}>VCIP ID</TableCell>

              <TableCell sx={{ 
                  textAlign: 'center'
                }}>Date</TableCell>

              <TableCell sx={{ 
                  textAlign: 'center'
                }}>Time Stamp</TableCell>
                
            </TableRow>
          </TableHead>
          <TableBody>
            {kycData.map((row, index) => (
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
                }}><strong>{row.agentData}</strong>
                </TableCell>

                <TableCell sx={{ 
                  textAlign: 'center'
                }}><strong>{row.templateKyc}</strong>
                </TableCell>

                <TableCell sx={{ 
                  textAlign: 'center'
                }}><strong>{row.vcpId}</strong>
                </TableCell>

                <TableCell sx={{ 
                  textAlign: 'center'
                }}><strong>{row.date}</strong>
                </TableCell>
                
                <TableCell sx={{ 
                  fontWeight: 600,
                  textAlign: 'center'
                }}>
                  {row.timeStamp}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </Box>




  );
};

export default KycReportTable;