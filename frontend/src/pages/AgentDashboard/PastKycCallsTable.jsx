import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
} from "@mui/material";
import Pagination from '../../components/Pagination';
const StatusChip = ({ status }) => {
  if (!status) return <Chip label="Unknown" variant="outlined" />;
  
  if (status === "APPROVED" || status === "Approved")
    return <Chip label="Approved" color="success" variant="outlined" />;
  if (status === "REJECTED" || status === "Rejected")
    return <Chip label="Rejected" color="error" variant="outlined" />;
  if (status === "DISCREPANCY" || status === "Discrepancy")
    return <Chip label="Discrepancy" color="primary" variant="outlined" />;
    
  return <Chip label={status} variant="outlined" />;
};

const PastKycCallsTable = ({ data = [], loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography>Loading Past KYC Calls...</Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Customer Name</b></TableCell>
              <TableCell><b>Client Name</b></TableCell>
              <TableCell><b>VCIP ID</b></TableCell>
              <TableCell><b>Contact Number</b></TableCell>
              <TableCell><b>Connection ID</b></TableCell>
              <TableCell><b>Call Status</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row, index) => {
              // ✅ Extract data from different possible column names
              const customerName = row.CustomerName || row.customerName || "-";
              const clientName = row.ClientName || row.clientName || "-";
              const vcipId = row.VcipId || row.vcipId || "-";
              const mobileNumber = row.MobileNumber || row.mobileNumber || "-";
              const connectionId = row.ConnectionId || row.connectionId || "-";
              const callStatus = row.CallStatus || row.callStatus || "Unknown";

              return (
                <TableRow key={`${row.PastKycId || row.VcipId || index}`}>
                  <TableCell>{customerName}</TableCell>
                  <TableCell>{clientName}</TableCell>
                  <TableCell>{vcipId}</TableCell>
                  <TableCell>{mobileNumber}</TableCell>
                  <TableCell>{connectionId}</TableCell>
                  <TableCell>
                    <StatusChip status={callStatus} />
                  </TableCell>
                </TableRow>
              );
           
 })}

            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Past KYC Records Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        currentPage={currentPage}
        totalItems={data.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default PastKycCallsTable;