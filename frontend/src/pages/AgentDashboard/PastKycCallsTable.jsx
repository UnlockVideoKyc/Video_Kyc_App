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
import Pagination from '../../components/Pagination'

/* ---------------- Status Chip ---------------- */
const StatusChip = ({ status }) => {
  if (status === "Approved")
    return <Chip label="Approved" color="success" variant="outlined" />;
  if (status === "Rejected")
    return <Chip label="Rejected" color="error" variant="outlined" />;
  return <Chip label="Discrepancy" color="primary" variant="outlined" />;
};

/* ---------------- Table ---------------- */
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
          {/* ---------- HEADER ---------- */}
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

          {/* ---------- BODY ---------- */}
          <TableBody>
            {paginatedData.map((row, index) => (
             <TableRow key={`${row.PastKycId || row.vcipId}-${index}`}>
                <TableCell>{row.customerName || "-"}</TableCell>
                <TableCell>{row.clientName || "-"}</TableCell>
                <TableCell>{row.vcipId || "-"}</TableCell>

                {/* ✅ Contact Number */}
                <TableCell>
                  {row.mobileNumber || "-"}
                </TableCell>

                <TableCell>{row.connectionId ?? "-"}</TableCell>

                <TableCell>
                  <StatusChip status={row.callStatus} />
                </TableCell>
              </TableRow>
            ))}

            {/* ---------- EMPTY STATE ---------- */}
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

      {/* ---------- PAGINATION ---------- */}
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
