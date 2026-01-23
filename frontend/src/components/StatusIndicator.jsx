import { Chip, Box } from "@mui/material";

const StatusIndicator = ({ status }) => {
  const safeStatus = (status ?? "unknown").toString();
  const normalizedStatus = safeStatus.toLowerCase();

  const getStatusColorKey = (value) => {
    switch (value) {
      case "live":
        return "success";
      case "waiting":
        return "warning";
      case "completed":
        return "info";
      case "scheduled":
        return "scheduled";
      case "missed call":
        return "error";
      default:
        return "default";
    }
  };

  const colorMap = {
    success: "#2e7d32",
    warning: "#dc3545",
    info: "#0288d1",
    scheduled: "rgba(28, 67, 166, 1)",
    error: "#dc3545",
    default: "#757575",
  };

  const colorKey = getStatusColorKey(normalizedStatus);
  const color = colorMap[colorKey];

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
      </Box>

      <Chip
        label={safeStatus}
        variant="plain"
        size="small"
        sx={{
          color,
          backgroundColor: "transparent",
          height: "20px",
          fontWeight: 600,
          "& .MuiChip-label": {
            padding: 0,
          },
        }}
      />
    </Box>
  );
};

export default StatusIndicator;