import { Button } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import { MissedVideoCall, Refresh } from "@mui/icons-material";

const ActionButtons = ({
  activeView,
  onViewChange,
  liveCount,
  missedCount,
  onRefresh,
}) => {
  return (
    <div className="d-flex gap-3 my-3" style={{ flexWrap: "wrap" }}>
      <Button
        variant={activeView === "live" ? "contained" : "outlined"}
        startIcon={<VideocamIcon />}
        onClick={() => onViewChange("live")}
        sx={{
          borderColor: "#1C43A6",
          color: activeView === "live" ? "white" : "#1C43A6",
          backgroundColor: activeView === "live" ? "#1C43A6" : "transparent",
          textTransform: "none",

          minWidth: "160px",
          minHeight: "40px", 
          paddingY: "8px", 
          paddingX: "16px",

          "&:hover": {
            backgroundColor: "#1C43A6",
            color: "white",
          },
        }}
      >
        Live & Schedule ({liveCount})
      </Button>

      <Button
        variant={activeView === "missed" ? "contained" : "outlined"}
        startIcon={<MissedVideoCall />}
        onClick={() => onViewChange("missed")}
        sx={{
          borderColor: "#F12B01",
          color: activeView === "missed" ? "white" : "#F12B01",
          backgroundColor: activeView === "missed" ? "#F12B01" : "transparent",
          textTransform: "none",
          minWidth: "160px",
          "&:hover": {
            backgroundColor: "#F12B01",
            color: "white",
          },
        }}
      >
        Missed Calls ({missedCount})
      </Button>

      <Button
        variant="outlined"
        startIcon={<Refresh />}
        onClick={onRefresh}
        sx={{
          borderColor: "#1C43A6",
          color: "#1C43A6",
          textTransform: "none",
          minWidth: "140px",
          "&:hover": {
            backgroundColor: "#1C43A6",
            color: "white",
          },
        }}
      >
        Refresh
      </Button>
    </div>
  );
};

export default ActionButtons;
