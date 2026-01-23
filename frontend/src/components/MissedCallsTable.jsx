import { Button } from "@mui/material";
import { Phone } from "lucide-react";
import StatusIndicator from "./StatusIndicator";

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const MissedCallsTable = ({ customers, onInitiateCall }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th className="text-nowrap">Customer Name</th>
            <th className="text-nowrap">Client Name</th>
            <th className="text-nowrap">VCIP ID</th>
            <th className="text-nowrap">Date</th>
            <th className="text-nowrap">Customer Status</th>
            <th className="text-nowrap">Call Status</th>
            <th className="text-nowrap">Remark</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.MissedId}>
              <td className="fw-semibold">{c.CustomerName}</td>

              <td className="fw-semibold">{c.ClientName}</td>

              <td className="fw-semibold">{c.VcipId}</td>

              <td className="fw-semibold">{formatDate(c.CreatedAt)}</td>

              <td>
                <div className="d-flex flex-column gap-1">
                  <StatusIndicator status="Missed Call" />
                  <small className="text-danger fw-semibold">
                    +91 {c.MobileNumber}
                  </small>
                </div>
              </td>

              <td>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Phone size={16} />}
                  sx={{
                    backgroundColor: "rgba(28,67,166,0.1)",
                    color: "#1C43A6",
                    textTransform: "none",
                    boxShadow: "none",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "rgba(28,67,166,0.2)",
                    },
                  }}
                  onClick={() => onInitiateCall(c)}
                >
                  Initiate Call
                </Button>
              </td>

              <td>
                <span className="text-muted">{c.Remark || "-"}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MissedCallsTable;