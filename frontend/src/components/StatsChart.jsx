import React, { useEffect, useState } from "react";
import { fetchDashboardData } from "../api/dashboard.api";
import {
  Box,
  Card,
  CardContent,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { ArrowDropDown as ChevronDown } from "@mui/icons-material";

ChartJS.register(ArcElement, Tooltip, Legend);

/* =========================
   FILTER CONFIG
========================= */
const FILTERS = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "All", value: "all" }
];

const StatsChart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [stats, setStats] = useState({
    approved: 0,
    rejected: 0,
    discrepancy: 0
  });

  /* =========================
     FETCH DASHBOARD DATA
  ========================= */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetchDashboardData(selectedFilter.value);

        setStats({
          approved: Number(res?.data?.approved) || 0,
          rejected: Number(res?.data?.rejected) || 0,
          discrepancy: Number(res?.data?.discrepancy) || 0
        });
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      }
    };

    loadDashboard();
  }, [selectedFilter]);

  /* =========================
     CHART CONFIG
  ========================= */
  const chartData = {
    labels: ["Approved", "Rejected", "Discrepancy"],
    datasets: [
      {
        data: [
          stats.approved,
          stats.rejected,
          stats.discrepancy
        ],
        backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
        borderWidth: 0
      }
    ]
  };

  const total =
    stats.approved + stats.rejected + stats.discrepancy;

  return (
    <Card
      sx={{
        height: "100%",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        boxShadow: "none"
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* ================= HEADER ================= */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2
          }}
        >
          <Box component="h5" sx={{ m: 0, fontSize: "1.25rem" }}>
            Work Dashboard
          </Box>

          <Box sx={{ position: "relative" }}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                border: "1px solid #dee2e6",
                background: "transparent",
                padding: "4px 12px",
                borderRadius: "4px",
                fontSize: "14px",
                cursor: "pointer"
              }}
            >
              {selectedFilter.label}
              <ChevronDown fontSize="small" />
            </button>

            {dropdownOpen && (
              <Box
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  mt: "4px",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  backgroundColor: "#fff",
                  zIndex: 10,
                  minWidth: "140px"
                }}
              >
                {FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => {
                      setSelectedFilter(filter);
                      setDropdownOpen(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      textAlign: "left",
                      border: "none",
                      background:
                        selectedFilter.value === filter.value
                          ? "#f8f9fa"
                          : "transparent",
                      cursor: "pointer"
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        <hr />

        {/* ================= PIE CHART ================= */}
        <Box
          sx={{
            height: isMobile ? "220px" : "280px",
            position: "relative"
          }}
        >
          <Pie
            data={chartData}
            options={{
              maintainAspectRatio: false,
              cutout: isMobile ? "60%" : "50%",
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (ctx) =>
                      `${ctx.label}: ${ctx.parsed}`
                  }
                }
              }
            }}
          />

          {/* Center Text */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center"
            }}
          >
            <h2 style={{ margin: 0 }}>{total}</h2>
            <small>{selectedFilter.label}</small>
          </Box>
        </Box>

        {/* ================= FOOTER ================= */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mt: 2,
            pt: 2,
            borderTop: "1px solid #e0e0e0",
            flexWrap: isMobile ? "wrap" : "nowrap",
            gap: isMobile ? "8px" : 0
          }}
        >
          {chartData.labels.map((label, i) => (
            <Box
              key={label}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor:
                    chartData.datasets[0].backgroundColor[i],
                  mr: 1
                }}
              />
              <small>{label}:</small>
              <small style={{ fontWeight: "bold", marginLeft: 4 }}>
                {chartData.datasets[0].data[i]}
              </small>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsChart;
