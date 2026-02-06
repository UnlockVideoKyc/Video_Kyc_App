import { Box, Typography, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const CustomerDetailsTable = () => {
  const customerData = [
    { 
      parameter: 'Name',
      applicantData: 'Praveen Chand',
      templateKYC: 'Praveen Chand',
      panOCR: 'PRAMCHD KUMAR',
      editedPAN: '-',
      nsdlData: 'N',
      match: '55.50%'
    },
    { 
      parameter: 'Father\'s Name',
      applicantData: 'N/A',
      templateKYC: 'N/A',
      panOCR: 'RAJ KARAN',
      editedPAN: '-',
      nsdlData: 'N/A',
      match: '0.00%'
    },
    { 
      parameter: 'Date of Birth',
      applicantData: '21-07-2007',
      templateKYC: '21-07-2007',
      panOCR: '20/05/1995',
      editedPAN: '-',
      nsdlData: 'Y',
      match: '35.00%'
    },
    { 
      parameter: 'Gender',
      applicantData: 'M',
      templateKYC: 'M',
      panOCR: 'N/A',
      editedPAN: '-',
      nsdlData: '-',
      match: '100%'
    },
    { 
      parameter: 'Current Address',
      applicantData: '28 ambedkar nagar uttar pradesh 224227',
      templateKYC: '28 ambedkar nagar uttar pradesh 224227',
      panOCR: '-',
      editedPAN: '-',
      nsdlData: '-',
      match: '75.00%'
    },
    { 
      parameter: 'Permanent Address',
      applicantData: '28 ambedkar nagar uttar pradesh 224227',
      templateKYC: '28 ambedkar nagar uttar pradesh 224227',
      panOCR: '-',
      editedPAN: '-',
      nsdlData: '-',
      match: '75.00%'
    },
    { 
      parameter: 'Mobile Number',
      applicantData: '73*****66',
      templateKYC: '73*****66',
      panOCR: '-',
      editedPAN: '-',
      nsdlData: '-',
      match: '-'
    },
    { 
      parameter: 'Email Address',
      applicantData: 'N/A',
      templateKYC: 'N/A',
      panOCR: '-',
      editedPAN: '-',
      nsdlData: '-',
      match: '-'
    },
    { 
      parameter: 'PAN NSDL Status',
      applicantData: '-',
      templateKYC: '-',
      panOCR: '-',
      editedPAN: '-',
      nsdlData: 'VALID',
      match: '-'
    },
    { 
      parameter: 'PAN Number',
      applicantData: '-',
      templateKYC: '-',
      panOCR: 'GVCPK8269L',
      editedPAN: '-',
      nsdlData: 'GVCPK8269L',
      match: '100%'
    },
    { 
      parameter: 'OVD ID',
      applicantData: '-',
      templateKYC: '-',
      panOCR: '-',
      editedPAN: '-',
      nsdlData: '-',
      match: '-'
    },
    { 
      parameter: 'Occupational Details',
      applicantData: 'Other, 0 - 5 Lakh',
      templateKYC: 'Other, 0 - 5 Lakh',
      panOCR: '-',
      editedPAN: '-',
      nsdlData: 'Other, 0 - 5 Lakh',
      match: '-'
    },
  ];

  const getMatchColor = (match) => {
    if (match.includes('%')) {
      const percent = parseFloat(match);
      return percent >= 50 ? '#28a745' : '#dc3545'; 
    }
    return 'inherit';
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
      <Typography variant="h6" sx={{ 
        color: '#1C43A6',
        fontWeight: 600,  
        mb: 2,
        fontSize: '1.25rem'
      }}>
        Customer Details
      </Typography>
      
      <Divider sx={{ mb: 2 }} />

      <TableContainer component={Paper} sx={{ 
        mb: 3,
        boxShadow: 'none',
        border: '1px solid #dee2e6',
        maxHeight: 'auto',
        overflow: 'auto'
      }}>
        <Table stickyHeader sx={{
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
                whiteSpace: 'nowrap',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                backgroundColor: '#f8f9fa'
              }
            }}>
              <TableCell>User Parameters</TableCell>
              <TableCell>Applicant Data <span style={{ color: '#1C43A6' }}>Digikhata</span></TableCell>
              <TableCell>Template KYC <span style={{ color: '#1C43A6' }}>Digilocker</span></TableCell>
              <TableCell>PAN Details <span style={{ color: '#1C43A6' }}>OCR</span></TableCell>
              <TableCell>Edited PAN Details</TableCell>
              <TableCell>NSDL Data</TableCell>
              <TableCell>Match</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customerData.map((row, index) => (
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
                <TableCell sx={{ fontWeight: 500 }}>{row.parameter}</TableCell>
                <TableCell><strong>{row.applicantData}</strong></TableCell>
                <TableCell><strong>{row.templateKYC}</strong></TableCell>
                <TableCell><strong>{row.panOCR}</strong></TableCell>
                <TableCell><strong>{row.editedPAN}</strong></TableCell>
                <TableCell><strong>{row.nsdlData}</strong></TableCell>
                <TableCell sx={{ 
                  color: getMatchColor(row.match),
                  fontWeight: 600,
                  textAlign: 'center'
                }}>
                  {row.match}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CustomerDetailsTable;