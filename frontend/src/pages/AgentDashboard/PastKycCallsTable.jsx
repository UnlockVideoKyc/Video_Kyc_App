// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   Box,
//   Typography
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import  getPastKycCalls  from "../../api/kyc.api";

// const StatusChip = ({ status }) => {
//   if (status === "Approved")
//     return <Chip label="Approved" color="success" variant="outlined" />;
//   if (status === "Rejected")
//     return <Chip label="Rejected" color="error" variant="outlined" />;
//   return <Chip label="Discrepancy" color="primary" variant="outlined" />;
// };

// const PastKycCallsTable = () => {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchPastKyc();
//   }, []);

//   const fetchPastKyc = async () => {
//     try {
//       const res = await getPastKycCalls();
//       setRows(res.data || []);
//     } catch (err) {
//       console.error("Past KYC fetch failed", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ py: 4, textAlign: "center" }}>
//         <Typography>Loading Past KYC Calls...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <TableContainer component={Paper}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell><b>Customer Name</b></TableCell>
//             <TableCell><b>Client Name</b></TableCell>
//             <TableCell><b>VCIP ID</b></TableCell>
//             <TableCell><b>Connection ID</b></TableCell>
//             <TableCell><b>Call Status</b></TableCell>
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {rows.map((row, index) => (
//             <TableRow key={index}>
//               <TableCell>{row.customerName}</TableCell>
//               <TableCell>{row.clientName}</TableCell>
//               <TableCell>{row.vcipId}</TableCell>
//               <TableCell>{row.connectionId}</TableCell>
//               <TableCell>
//                 <StatusChip status={row.callStatus} />
//               </TableCell>
//             </TableRow>
//           ))}

//           {rows.length === 0 && (
//             <TableRow>
//               <TableCell colSpan={5} align="center">
//                 No Past KYC Records Found
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default PastKycCallsTable;

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
import { useEffect, useState } from "react";
import getPastKycCalls from "../../api/kyc.api";

const StatusChip = ({ status }) => {
  if (status === "Approved")
    return <Chip label="Approved" color="success" variant="outlined" />;
  if (status === "Rejected")
    return <Chip label="Rejected" color="error" variant="outlined" />;
  return <Chip label="Discrepancy" color="primary" variant="outlined" />;
};

const PastKycCallsTable = ({ data = [], loading }) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // ✅ If data comes from parent (search results), use it
    if (data && data.length >= 0) {
      setRows(data);
    }
  }, [data]);

  useEffect(() => {
    // ✅ Initial load only when no parent data
    if (!data || data.length === 0) {
      fetchPastKyc();
    }
    // eslint-disable-next-line
  }, []);

  const fetchPastKyc = async () => {
    try {
      const res = await getPastKycCalls();
      setRows(res.data || []);
    } catch (err) {
      console.error("Past KYC fetch failed", err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography>Loading Past KYC Calls...</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Customer Name</b>
            </TableCell>
            <TableCell>
              <b>Client Name</b>
            </TableCell>
            <TableCell>
              <b>VCIP ID</b>
            </TableCell>
            <TableCell>
              <b>Connection ID</b>
            </TableCell>
            <TableCell>
              <b>Call Status</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                {row.customerName || row.CustomerName || "-"}
              </TableCell>
              <TableCell>{row.clientName || row.ClientName || "-"}</TableCell>
              <TableCell>{row.vcipId || row.VcipId || "-"}</TableCell>
              <TableCell>
                {row?.connectionId || row?.ConnectionId || "-"}
              </TableCell>

              <TableCell>
                <StatusChip status={row.callStatus} />
              </TableCell>
            </TableRow>
          ))}

          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No Past KYC Records Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PastKycCallsTable;
