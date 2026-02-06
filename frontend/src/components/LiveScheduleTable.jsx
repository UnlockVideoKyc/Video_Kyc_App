import { Button } from "@mui/material";
import { Phone } from "lucide-react";
import StatusIndicator from "./StatusIndicator";
import { useEffect, useState } from "react";

const LiveScheduleTable = ({ customers = [], onInitiateCall }) => {
  const [, setTick] = useState(0);

  // re-render every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getWaitingTime = (createdAt) => {
    if (!createdAt) return "00:00:00";

    const diffMs = Date.now() - new Date(createdAt).getTime();
    if (diffMs < 0) return "00:00:00";

    const totalSeconds = Math.floor(diffMs / 1000);

    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(
      Math.floor((totalSeconds % 3600) / 60)
    ).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>Customer Name</th>
            <th>Client Name</th>
            <th>VCIP ID</th>
            <th>Waiting Since</th>
            <th>Customer Status</th>
            <th>Call Status</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c, index) => (
            <tr key={c.LiveId || `${c.VcipId}-${index}`}>
              <td className="fw-bold">{c.CustomerName || "-"}</td>
              <td className="fw-bold">{c.ClientName || "-"}</td>
              <td className="fw-bold">{c.VcipId || "-"}</td>

              <td className="text-danger fw-bold">
                {getWaitingTime(c.CreatedAt)}
              </td>

              <td>
                <StatusIndicator status={c.CustomerStatus} />
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LiveScheduleTable;
