import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

const FinalRemarkTableAuditor = () => {
  // Static data for now
  const remarkData = {
    agentName: 'HEENA MAKWANA',
    kycDateTime: '24-12-2025 12:07:09 PM',
    statusUpdate: 'Approved',
    finalRemark: 'Your VKYC is approved as per process'
  };

  const tableRows = [
    { label: 'Agent Name', value: remarkData.agentName },
    { label: 'KYC Date And Time', value: remarkData.kycDateTime },
    { label: 'Status Update', value: remarkData.statusUpdate },
    { label: 'Final Remark', value: remarkData.finalRemark }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <TableContainer component={Paper} sx={{ 
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
          {/* Header Row */}
          <TableBody>
            {/* <TableRow sx={{ 
              backgroundColor: '#f8f9fa',
              '& td': {
                fontWeight: 600,
                color: '#212529',
                borderBottom: '1px solid #dee2e6',
                fontSize: '18px',
                textAlign: 'center',
                py: 2
              }
            }}>
              <TableCell colSpan={2}>
                Final Remark
              </TableCell>
            </TableRow> */}

            {/* Subheader Row */}
            <TableRow sx={{ 
              backgroundColor: '#f8f9fa',
              '& td': {
                fontWeight: 600,
                color: '#212529',
                borderBottom: '1px solid #dee2e6',
                fontSize: '16px',
                textAlign: 'center',
                py: 1.5
              }
            }}>
              <TableCell colSpan={2}>
                Agent Remark
              </TableCell>
            </TableRow>

            {/* Data Rows */}
            {tableRows.map((row, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  '& td': {
                    borderBottom: index === tableRows.length - 1 ? 'none' : '1px solid #dee2e6',
                    fontSize: '16px',
                    py: 1.5
                  }
                }}
              >
                <TableCell sx={{ 
                  fontWeight: 500,
                  width: '30%',
                  color: '#212529'
                }}>
                  {row.label}
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: row.label === 'Status Update' ? 600 : 400,
                  color: row.label === 'Status Update' && row.value === 'Approved' ? '#28a745' : '#212529'
                }}>
                  {row.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FinalRemarkTableAuditor;