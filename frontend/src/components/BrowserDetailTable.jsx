import { Box, Typography, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const BrowserDetailTable = () => {
  const ipData = [
    { field: 'IP Address', value: '112.79.202.237' },
    { field: 'Location', value: 'FH58+7WG, SH 5, Nasirpur, Ravepur Vhaudden Pur, Uttar Pradesh 224122, India' },
    { field: 'Latitude and Longitude', value: '-' },
    { field: 'ISP', value: '-' },
    { field: 'IP Country Code', value: '-' },
    { 
      field: 'Browser Name', 
      value: (
        <>
          • Name: chrome<br />
          • Version: 87.0.4280<br />
          • OS: Android OS
        </>
      ) 
    },
  ];

  return (
    <Box sx={{
    //   borderRadius: '8px',
    //   overflow: 'hidden',
    //   height: '100%',
    //   boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    //   backgroundColor: 'white',
    //   p: 3,
      mb: 3
    }}>
      <Typography variant="h6" sx={{ 
        color: '#1C43A6',
        fontWeight: 600,  
        mb: 2,
        fontSize: '1.25rem'
      }}>
        Browser IP Details
      </Typography>
      
      {/* <Divider sx={{ mb: 2 }} /> */}

      {/* Main Table */}
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
          <TableBody>
            {ipData.map((row, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  '& td': {
                    borderBottom: '1px solid #dee2e6',
                    fontSize: '16px',
                    verticalAlign: 'top'
                  },
                  '&:last-child td': {
                    borderBottom: 'none'
                  }
                }}
              >
                <TableCell sx={{ 
                  fontWeight: 500,
                  width: '30%',
                //   backgroundColor: '#f8f9fa'
                }}>
                  {row.field}
                </TableCell>
                <TableCell sx={{ 
                  width: '70%'
                }}>
                  <strong>{row.value}</strong>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BrowserDetailTable;