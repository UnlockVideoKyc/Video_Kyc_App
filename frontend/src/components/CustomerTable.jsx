import { useEffect, useState, useCallback } from "react";
import PastKycCallsTable from "../pages/AgentDashboard/PastKycCallsTable";

import {
  Box,
  Tabs,
  Tab,
  // useMediaQuery,
  // useTheme,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import {
  Groups as GroupsIcon,
  History as HistoryIcon,
  EditNote as EditNoteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import ActionButtons from "../components/ActionButtons";
import LiveScheduleTable from "./LiveScheduleTable";
import MissedCallsTable from "../components/MissedCallsTable";
import Pagination from "../components/Pagination";
import CallInitiationModal from "../components/CallInitiationModal";
import CallEndModal from "../components/CallEndModal";

/* ---------------- debounce hook ---------------- */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const api_base_url = `${API_BASE_URL}/api/kyc`;
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
};

const CustomerTable = () => {
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  

  const [activeTab, setActiveTab] = useState("Video KYC Waitlist");
  const [activeView, setActiveView] = useState("live");

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [initiationModalOpen, setInitiationModalOpen] = useState(false);
  const [endModalOpen, setEndModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  /* COUNTS (FIX #2) */
  const [liveCount, setLiveCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);

  

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let url = "";

      if (debouncedSearch) {
        url = `${api_base_url}/search?q=${debouncedSearch}&view=${activeView}`;
      } else if (activeView === "live") {
        url = `${api_base_url}/live-schedule`;
      } else {
        url = `${api_base_url}/missed`;
      }

      const res = await fetch(url);
      const json = await res.json();

      setCustomers(json.data || []);

      if (activeView === "live") {
        setLiveCount(json.totalCount ?? json.data?.length ?? 0);
      } else {
        setMissedCount(json.totalCount ?? json.data?.length ?? 0);
      }
    } catch (err) {
      console.error(err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [api_base_url, debouncedSearch, activeView]);

  useEffect(() => {
    if (activeTab === "Video KYC Waitlist") {
      fetchData();
    }
  }, [fetchData, activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeView]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = customers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleOpenInitiationModal = (customer) => {
    setSelectedCustomer(customer);
    setInitiationModalOpen(true);
  };

  const handleCloseInitiationModal = () => {
    setInitiationModalOpen(false);
  };

  const handleCloseIconClick = () => {
    setInitiationModalOpen(false);
    setEndModalOpen(true);
  };

  const handleEndCall = () => {
    setEndModalOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === "Video KYC Waitlist") {
      setActiveView("live");
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="standard"
          TabIndicatorProps={{
            sx: {
              backgroundColor: "#1C43A6",
              height: "2px",
              borderRadius: "0px", 
              top: "auto", 
            },
          }}
          sx={{
            minHeight: "44px",

            "& .MuiTabs-flexContainer": {
              display: "flex",
              alignItems: "center",
              gap: "24px", 
            },

            "& .MuiTabs-indicator": {
              borderTop: "none", 
            },
          }}
        >
          
          <Tab
            value="Video KYC Waitlist"
            icon={<GroupsIcon fontSize="small" />}
            iconPosition="start"
            label="Video KYC Waitlist"
            disableRipple
            sx={{
              minHeight: "44px",
              padding: "0",
              textTransform: "none",
              fontSize: "14px", 
              fontWeight: 500,
              color: "#111827",
              gap: "6px", 
              "&.Mui-selected": {
                color: "#1C43A6",
                fontWeight: 500, 
              },

              "& .MuiTab-iconWrapper": {
                margin: "0",
              },
            }}
          />

        
          <Tab
            value="Past KYC Calls"
            icon={<HistoryIcon fontSize="small" />}
            iconPosition="start"
            label="Past KYC Calls"
            disableRipple
            sx={{
              minHeight: "44px",
              padding: "0",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
              color: "#111827",
              gap: "6px",

              "&.Mui-selected": {
                color: "#1C43A6",
                fontWeight: 500,
              },
            }}
          />

         
          <Tab
            value="Draft List"
            icon={<EditNoteIcon fontSize="small" />}
            iconPosition="start"
            label="Draft List"
            disableRipple
            sx={{
              minHeight: "44px",
              padding: "0",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
              color: "#111827",
              gap: "6px",

              "&.Mui-selected": {
                color: "#1C43A6",
                fontWeight: 500,
              },
            }}
          />
        </Tabs>

        <Box sx={{ borderBottom: 1, borderColor: "divider", my: 3 }} />

        {activeTab === "Video KYC Waitlist" && (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
              mb={3}
            >
              <ActionButtons
                activeView={activeView}
                onViewChange={(v) => {
                  setSearch("");
                  setActiveView(v);
                }}
                liveCount={liveCount}
                missedCount={missedCount}
                onRefresh={fetchData}
              />

              <TextField
                size="small"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {loading ? (
              <Typography align="center">Loading...</Typography>
            ) : paginatedCustomers.length === 0 ? (
              <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                No records found
              </Typography>
            ) : activeView === "live" ? (
              <LiveScheduleTable
                customers={paginatedCustomers}
                onInitiateCall={handleOpenInitiationModal}
              />
            ) : (
              <MissedCallsTable
                customers={paginatedCustomers}
                onInitiateCall={handleOpenInitiationModal}
              />
            )}

            <Pagination
              currentPage={currentPage}
              totalItems={customers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {activeTab === "Past KYC Calls" && (
          <Box sx={{ mt: 2 }}>
            <PastKycCallsTable />
          </Box>
        )}

        {activeTab === "Draft List" && (
          <Box sx={{ mt: 2, p: 3, textAlign: "center" }}>
            <Typography variant="h5">Draft List</Typography>
            <Typography color="text.secondary">
              This page is under development.
            </Typography>
          </Box>
        )}

        {selectedCustomer && (
          <CallInitiationModal
            open={initiationModalOpen}
            onClose={handleCloseInitiationModal}
            onCloseIconClick={handleCloseIconClick}
            customer={selectedCustomer}
          />
        )}

        <CallEndModal
          open={endModalOpen}
          onClose={() => setEndModalOpen(false)}
          onConfirm={handleEndCall}
        />
      </div>
    </div>
  );
};

export default CustomerTable;
