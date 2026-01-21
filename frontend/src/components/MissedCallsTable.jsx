import { Button } from "@mui/material";
import { Phone, MessageCircle } from "lucide-react";
import StatusIndicator from "./StatusIndicator";

const MissedCallsTable = ({ customers, onInitiateCall  }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>Customer Name</th>
            <th>Client Name</th>
            <th>VCP ID</th>
            <th>Date & Time</th>
            <th>Customer Status</th>
            <th>Notification Tab</th>
            <th>Call Status</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.MissedId}>
              <td className="fw-bold">{c.CustomerName}</td>
              <td className="fw-bold">{c.ClientName}</td>
              <td className="fw-bold">{c.VcipId}</td>
              <td>
                <div className="fw-bold">
                  {c.CreatedAt
                    ? new Date(c.CreatedAt).toLocaleDateString()
                    : "-"}
                </div>
                <div className="fw-bold">
                  {c.CreatedAt
                    ? new Date(c.CreatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </div>
              </td>
              <td>
                <StatusIndicator status="Missed Call" />
                <div>
                  <small className="text-danger fw-bold">
                    +91 {c.MobileNumber}
                  </small>
                </div>
              </td>
              <td>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<MessageCircle size={16} />}
                  sx={{
                    backgroundColor: "rgba(28,67,166,0.1)",
                    color: "#1C43A6",
                    textTransform: "none",
                    boxShadow: "none",
                  }}
                >
                  Send Message
                </Button>
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
                  }}
                  onClick={() => onInitiateCall(customers)}
                >
                  Initiate Call
                </Button>
              </td>
              <td>
                <span className="text-muted">{c.Remark}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MissedCallsTable;
